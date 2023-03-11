import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { RemoteDbService } from '../remote-db/remote-db.service';
import { AuthService } from '../auth/auth.service'
//import { AuthService } from '../auth/auth.service';
import { UserModel } from '../remote-models/user-model';
import { UserRole } from '../remote-models/user-role-model';
import { Status } from '../remote-models/status-model';
import { UserTableDialogComponent } from './user-table-dialog/user-table-dialog.component'

import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { exit } from 'process';
import { get } from 'https';
import { ThrowStmt } from '@angular/compiler';
import { ContentObserver } from '@angular/cdk/observers';
import { resourceLimits } from 'worker_threads';
import { ScrollingVisibility } from '@angular/cdk/overlay';

// This interface will be used for print in "user-table" html.
interface User {
  id_user: number,
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}


interface UserDetails {
  id_user: number,
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  userSkills: Array<String>;
  userWorkingAreas: Array<String>;
}
interface UserAddress {
  state_name: string,
  colony_name: string,
  municipality_name: string,
  main_number: number,
  interior_number: number
  street_name: string
}

// userProfessions: Object;
// userAreas: Object;

@Component({
  selector: 'app-user-table',
  styleUrls: ['./user-table.component.css'],
  templateUrl: './user-table.component.html'
})

export class UserTableComponent implements OnInit{
  displayedColumns: string[] = ['last_name', 'first_name', 'role', 'status', 'actions'];
  userSubscription: Subscription; 
  roleSubscription: Subscription; 
  statusSubscription: Subscription; 
  dataSource: MatTableDataSource<any>;
  userData: UserModel[]; 
  users: User[];
  title: UserModel;

  @ViewChild('table') table: MatTable<User>;

  constructor(private remoteDbService: RemoteDbService, 
              private authService:  AuthService,
              public mediaObserve: MediaObserver,
              private router: Router,
              public dialog: MatDialog) {
    this.users = []
  }
  
  //See more (see the complete information of the user)
    openDialog(idUser: number): void {  


    this.remoteDbService.getUsersById(idUser).subscribe(userInfo => {
      this.remoteDbService.getRoleById(userInfo.user_role_id)
      .subscribe(userRole => {
        this.remoteDbService.getStatusesById(userInfo.user_status_id)
        .subscribe(userStatus => {  
          this.remoteDbService.getSkills().subscribe(allSkills => {
            let userProfessionName = [];
            userInfo.user_model_professions.forEach(actualSkillUser => {
              allSkills.forEach(actualSkill => {
                if(actualSkillUser.profession_skill == actualSkill.skills_id) userProfessionName.push(actualSkill.skills_name)
              });
            });
            this.remoteDbService.getMunicipalities().subscribe(allMunicipalities => {
              let userWorkingArea = [];
              userInfo.user_model_working_areas.forEach(actualWorkingArea => {
                allMunicipalities.forEach(actualMunicipality => {
                  if(actualWorkingArea.working_area_id == actualMunicipality.id_municipality) userWorkingArea.push(actualMunicipality.municipality_name)
                });
              })
              let userInfoFormat: UserDetails = {
                id_user: userInfo.user_model_id,            
                first_name: userInfo.user_model_first_name,
                last_name: userInfo.user_model_last_name,
                role: userRole.user_role_name,
                status: userStatus.status_name,
                userSkills: userProfessionName,
                userWorkingAreas: userWorkingArea
              };
              this.remoteDbService.getUserAddressById(idUser).subscribe(userAdress => {
                this.remoteDbService.getColonyById(userAdress.id_colony_code).subscribe(userColony => {
                  this.remoteDbService.getStatesById(userAdress.id_state_code).subscribe(userState => { 
                    this.remoteDbService.getMunicipalityById(userAdress.id_municipality).subscribe(userMunicipality => {
                      let userAddressFormat: UserAddress = {
                        state_name: userState.state_name,
                        colony_name: userColony.colony_name,
                        municipality_name: userMunicipality.municipality_name,
                        main_number: userAdress.main_number,
                        interior_number: userAdress.interior_number,
                        street_name: userAdress.street_name
                      }                  
                      this.dialog.open(UserTableDialogComponent,  {
                        width: '500px',
                        data: {
                                userInformation: userInfoFormat,
                                userAddressInformation: userAddressFormat,
                                userProfessions: "Profesiones",
                                userAreas: "Áreas usuario"
                              }
                      });
                    })
                  })
                })
              })
              });
            })
        })
      })  
    });
  }     

  ngOnInit(): void { 
    this.getData();
  }


  getData(): void {
    this.userSubscription = this.remoteDbService.getUsers().subscribe(allProfesionals => {
      this.authService.getUserModelObservable().subscribe(actualUserDataLogin => {
        const data = [];
        for (let profesional of allProfesionals){ if(profesional.user_model_org == actualUserDataLogin.user_model_org) data.push(profesional) }
        this.userData = data;
        this.formatUsers();
      })
    });
  }

  //Get roles from database
  formatUsers(): void {
      for (let data of this.userData) {
        this.remoteDbService.getRoleById(data.user_role_id)
        .subscribe(userRole => {
          this.remoteDbService.getStatusesById(data.user_status_id)
          .subscribe(userStatus => {
            
            let user: User = {
              id_user: data.user_model_id,            
              first_name: data.user_model_first_name,
              last_name: data.user_model_last_name,
              role: userRole.user_role_name,
              status: userStatus.status_name
            };
            
            // FIXME: Multi rendering calls
            this.users.push(user);
            this.table.dataSource = this.users
            this.table.renderRows()
          })
        })
      }
    // This for "merges" the data of "user, roles and status"
  }

  //Edit User
  editUser(id: number){
    this.router.navigate(['/editUser/'+id]);
  } //This function redirects directly to the edition interface
    /*
      Note: Theoretically first the data should be rendered in a form so the user could edit it and then
      be sent to the service remote-db.service.ts (method PUT for updating the user)

    */
  
  //Delete User
  deleteUser(id: number) {
    if (confirm("¿Está seguro de que desea eliminar a este usuario?"))
      this.userSubscription = this.remoteDbService.deleteUser(id).subscribe(data => {
        alert('Usuario eliminado correctamente');
        this.users = [];
        this.getData();
      });
  }
  
  ngOnDestroy(): void {
    // this.userSubscription.unsubscribe();
    // this.statusSubscription.unsubscribe();
    // this.roleSubscription.unsubscribe();
  }
}
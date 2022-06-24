import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { RemoteDbService } from '../remote-db/remote-db.service';
import { UserModel } from '../remote-models/user-model';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service'

import { MatDialog } from '@angular/material/dialog';
import { UserRole } from '../remote-models/user-role-model';
import { Status } from '../remote-models/status-model';
import { UserTableDialogComponent } from './user-table-dialog/user-table-dialog.component'

import { exit } from 'process';
import { get } from 'https';
import { ThrowStmt } from '@angular/compiler';
import { ContentObserver } from '@angular/cdk/observers';
import { resourceLimits } from 'worker_threads';

// This interface will be used for print in "user-table" html.
interface User {
  id_user: number,
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

interface UsedAddress {
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
  addressSubscription: Subscription; 
  userMediaSubscription: Subscription; 
  dataSource: MatTableDataSource<any>;
  userData: UserModel[]; 
  users: User[];
  title: UserModel;


  @ViewChild('table') table: MatTable<User>;

  constructor(private remoteDbService: RemoteDbService,
              private authService: AuthService, 
              public mediaObserve: MediaObserver,
              private router: Router,
              public dialog: MatDialog) {
    this.users = []
  }
  
  //See more (see the complete information of the user)
    openDialog(idUser: number): void {  
    console.log("ESTO ES VER MAS")


    this.remoteDbService.getUsersById(idUser).subscribe(userInfo => {
      this.remoteDbService.getRoleById(userInfo.user_role_id)
      .subscribe(userRole => {
        this.remoteDbService.getStatusesById(userInfo.user_status_id)
        .subscribe(userStatus => {  
          let userInfoFormat: User = {
            id_user: userInfo.user_model_id,            
            first_name: userInfo.user_model_first_name,
            last_name: userInfo.user_model_last_name,
            role: userRole.user_role_name,
            status: userStatus.status_name
          };
          this.remoteDbService.getUserAddressById(idUser).subscribe(userAdress => {
            this.remoteDbService.getColonyById(userAdress.id_colony_code).subscribe(userColony => {
              this.remoteDbService.getStatesById(userAdress.id_state_code).subscribe(userState => { 
                this.remoteDbService.getMunicipalityById(userAdress.id_municipality).subscribe(userMunicipality => {
                  let userAddressFormat: UsedAddress = {
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
                            userAreas: "Areas usuario"
                          }
                  });
                })
              })
            })
          })
        })
      })  
    });
  }     

  ngOnInit(): void {
    console.log("Comenzando ejecución")
    this.getData();
  }

  getData(): void {
    this.userSubscription = this.remoteDbService.getUsers().subscribe(data => {
      this.userData = [];
      data.forEach((proModel, index) => {
        this.authService.getUserModelObservable().subscribe(userModel => {
          if (proModel.user_model_org == userModel.user_model_org) this.userData.push(proModel);
          if (index == data.length-1) this.formatUsers();
        });
      });
    });
  }

  //Get roles from database
  formatUsers(): void {
    // This for "merges" the data of "user, roles and status"
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
  }

  //Edit User
  editUser(id: number){
    this.router.navigate(['/editUser/'+id]);
  } //This function redirects directly to the edition interface
    /*
      Note: Theoretically first the data should be rendered in a form so the user could edit it and then
      be sent to the service remote-db.service.ts (method PUT for updating the user)

    */
  
  // User deletion process:
  // 1) Delete user address with ID
  // 2) Delete user profile picture media
  // 3) Delete user
  //Delete User
  deleteUser(id: number) {
    if (confirm("¿Está seguro de que desea eliminar a este usuario?")) {
      // console.log("Borrando direccion")
      // this.remoteDbService.deleteUserAddress(id).subscribe( () => {
      //   console.log("Borrando media")
      //   console.log(this.userData.find(user => user.user_model_id == id).user_model_media_id)
      //   this.remoteDbService.deleteMedia(this.userData.find(user => user.user_model_id == id).user_model_media_id).subscribe(()=>{
      //     console.log("Borrando usuario")
      //     this.remoteDbService.deleteUser(id).subscribe(() => {
      //       alert('Usuario eliminado correctamente');
      //       this.users = [];
      //       this.getData();
      //     });
      //   })
      // })

      console.log("Borrando usuario")
      this.remoteDbService.deleteUser(id).subscribe(() => {
        console.log("Usuario borrado")
        console.log("Borrando direccion")
        this.remoteDbService.deleteUserAddressById(this.userData.find(user => user.user_model_id == id).user_model_address_id).subscribe(() => {
          console.log("Direccion borrada")
          console.log("Borrando foto de perfil")
          this.remoteDbService.deleteMedia(this.userData.find(user => user.user_model_id == id).user_model_media_id).subscribe(() => {
            console.log("Foto de perfil eliminada")
            alert("Usuario eliminado correctamente")
            this.users = []
            this.getData();
          })
        })
      })
    }
  }
  
  ngOnDestroy(): void {
    // this.userSubscription.unsubscribe();
    // this.statusSubscription.unsubscribe();
    // this.roleSubscription.unsubscribe();
  }
}



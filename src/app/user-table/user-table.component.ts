import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { RemoteDbService } from '../remote-db/remote-db.service';
import { UserModel } from '../remote-models/user-model';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';

// This interface will be used for print in "user-table" html.
interface User {
  id_user: number,
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})

export class UserTableComponent implements OnInit{
  displayedColumns: string[] = ['last_name', 'first_name', 'role', 'status', 'actions'];
  userSubscription: Subscription; 
  addressSubscription: Subscription; 
  userMediaSubscription: Subscription; 
  dataSource: MatTableDataSource<any>;
  userData: UserModel[]; 
  users: User[];
  
  @ViewChild('table') table: MatTable<User>;

  constructor(private remoteDbService: RemoteDbService, 
              public mediaObserve: MediaObserver,
              private router: Router) {
    this.users = []
  }

  ngOnInit(): void {
    console.log("Comenzando ejecución")
    this.getData();
  }

  getData(): void {
    this.userSubscription = this.remoteDbService.getUsers().subscribe(data => {
      this.userData=data;
      this.formatUsers();
    });
    console.log(this.userData)
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
      console.log("Borrando direccion")
      this.remoteDbService.deleteUserAddress(id).subscribe( () => {
        console.log("Borrando media")
        console.log(this.userData.find(user => user.user_model_id == id).user_model_media_id)
        this.remoteDbService.deleteMedia(this.userData.find(user => user.user_model_id == id).user_model_media_id).subscribe(()=>{
          console.log("Borrando usuario")
          this.remoteDbService.deleteUser(id).subscribe(() => {
            alert('Usuario eliminado correctamente');
            this.users = [];
            this.getData();
          });
        })
      })
    }
  }
}

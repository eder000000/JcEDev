import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, of } from 'rxjs';
import { RemoteDbService } from '../remote-db/remote-db.service';
import { UserModel } from '../remote-models/user-model';
import { UserRole } from '../remote-models/user-role-model';
import { Status } from '../remote-models/status-model';


// This interface will be used for print in "user-table" html.
interface User {
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

// Data harcodeada
const USERS: User[] = [
  {
    first_name: "Juan Pedro",
    last_name: "Salas Ríos",
    role: "Profesional",
    status: "Activo"
  },
  {
    first_name: "Ana María",
    last_name: "González Torres",
    role: "Administrador",
    status: "Activo"
  },
  {
    first_name: "José Armando",
    last_name: "Silas Armas",
    role: "Usuario",
    status: "Inactivo"
  }
];

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})

export class UserTableComponent implements OnInit{
  displayedColumns: string[] = ['last_name', 'first_name', 'role', 'status', 'actions'];
  userSubscription: Subscription; 
  roleSubscription: Subscription; 
  statusSubscription: Subscription; 
  dataSource: MatTableDataSource<any>;
  userData: UserModel[]; 
  users: User[]; 

  constructor(private remoteDbService: RemoteDbService) {}

  ngOnInit(): void {
    this.getData();
    this.formatUsers();
    this.dataSource = new MatTableDataSource(this.users);
  }

  getData(): void {
    this.userSubscription = this.remoteDbService.getUsers().subscribe(data => this.userData=data);
  }

  //Get roles from database
  formatUsers(): void {
    // This for "merges" the data of "user, roles and status"
    for (let data of this.userData) {
      let user: User = {
        first_name: data.user_model_first_name,
        last_name: data.user_model_last_name,
        role: this.getUserRole(data),
        status: this.getUserStatus(data) 
      };
      this.users.push(user);
    }
  }

  //Get roles from database
  getUserRole(user: UserModel): string {
    let role: UserRole;
    this.roleSubscription = this.remoteDbService.getRoleById(user.user_role_id).subscribe(data => role = data);
    return role.user_role_name;
  }

  //Get status from database
  getUserStatus(user: UserModel): string {
    let status: Status;
    this.statusSubscription = this.remoteDbService.getStatusesById(user.user_status_id).subscribe(data => status = data);
    return status.status_name;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
    this.roleSubscription.unsubscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table' 

interface User {
  nombre: string;
  apellido: string;
  rol: string;
  estatus: string;
}

const USERS: User[] = [
  {
    nombre: "Juan Pedro",
    apellido: "Salas Ríos",
    rol: "Profesional",
    estatus: "Activo"
  },
  {
    nombre: "Ana María",
    apellido: "González Torres",
    rol: "Administrador",
    estatus: "Activo"
  },
  {
    nombre: "José Armando",
    apellido: "Silas Armas",
    rol: "Usuario",
    estatus: "Inactivo"
  }
];

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})

export class UserTableComponent implements OnInit{
  displayedColumns: string[] = ['nombre', 'apellido', 'rol', 'editar'];
  dataSource = new MatTableDataSource(USERS);

  constructor() { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.displayedColumns;
    this.dataSource;
  }
}

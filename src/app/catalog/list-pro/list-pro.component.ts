import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/firebase/firebase.service';
import { Profesional } from 'src/app/user/profesional-data-model';
import { Oficio } from 'src/app/job/oficios.model';
import { OficiosService } from 'src/app/job/oficios.service';

@Component({
	selector: 'app-list-pro',
	templateUrl: './list-pro.component.html',
	styleUrls: [ './list-pro.component.css' ]
})
export class ListProComponent implements OnInit {
	oficios: Oficio[];
	panelOpenState = false;
  allPros: Profesional[];
  obsPerson: Observable<Profesional[]>

  constructor(private firebaseService: FirebaseService, private oficiosService: OficiosService) { }

  ngOnInit(): void {
    this.oficios = this.oficiosService.getOficios();
    this.firebaseService.getAll().subscribe(pros => {
      this.allPros = pros;
    })
  }
}

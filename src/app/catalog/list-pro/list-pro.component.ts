import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/firebase/firebase.service';
import { Profesional } from 'src/app/user/profesional-data-model';

@Component({
	selector: 'app-list-pro',
	templateUrl: './list-pro.component.html',
	styleUrls: [ './list-pro.component.css' ]
})
export class ListProComponent implements OnInit {
	panelOpenState: boolean[];
  allPros: Profesional[];
  obsPerson: Observable<Profesional[]>

  selectedJob: number[] 

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.selectedJob = []
    this.panelOpenState = []

    this.firebaseService.getAll().subscribe(pros => {
      this.allPros = pros;
      this.allPros.forEach(() => {
        this.selectedJob.push(0)
        this.panelOpenState.push(false)
      })
    })
  }

  updateJobInfo(proIndex, jobIndex) { 
    this.selectedJob[proIndex] = jobIndex
  }
}

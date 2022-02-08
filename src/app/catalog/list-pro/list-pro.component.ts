import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  registeredProfessions: string[];
  allPros: Profesional[];
  obsPerson: Observable<Profesional[]>
  requestedJob: string;
  selectedJob: number[] 

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.requestedJob = params['oficio'];
    })
    this.selectedJob = []
    this.panelOpenState = []
    this.registeredProfessions = []
    this.allPros = []
    this.firebaseService.getAll().subscribe(pros => {
      if (!this.requestedJob) this.allPros = pros;
      else {
        pros.forEach(pro => {
          pro.oficios.forEach(oficio => {
            if (oficio.oficio_name == this.requestedJob) {
              this.allPros.push(pro);
              return;
            }
          })
        })
      }
      if (this.allPros) {
        this.allPros.forEach(pro => {
          if (this.requestedJob) this.selectedJob.push(pro.oficios.findIndex(
            oficio => oficio.oficio_name == this.requestedJob));
          else this.selectedJob.push(0);
          this.panelOpenState.push(false)
          pro.oficios.forEach(oficio => {
            if (!this.registeredProfessions.includes(oficio.oficio_name)) {
              this.registeredProfessions.push(oficio.oficio_name);
            }
          })
        })
      }
    })
  }

  updateJobInfo(proIndex, jobIndex) { 
    this.selectedJob[proIndex] = jobIndex
  }

  filterProByProfession(prof : string, pro : Profesional) : boolean {
    return pro.oficios.some(oficio => oficio.oficio_name == prof);
  }
  
}

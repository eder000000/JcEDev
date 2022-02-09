import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  prosShown: boolean[];
  obsPerson: Observable<Profesional[]>;
  requestedJob: string;
  selectedJob: number[];

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private cd : ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.requestedJob = params['oficio'];
    })
    this.selectedJob = []
    this.panelOpenState = []
    this.registeredProfessions = []
    this.allPros = []
    this.firebaseService.getAll().subscribe(pros => {
      if (!this.requestedJob) { 
        this.allPros = pros;
      } else {
        this.registeredProfessions.push(this.requestedJob);
        pros.forEach(pro => {
          pro.oficios.forEach(oficio => {
            if (oficio.oficio_name == this.requestedJob) {
              this.allPros.push(pro);
              return;
            }
          })
        })
      }
      this.prosShown = Array(this.allPros.length).fill(false);
      if (this.allPros) {
        this.allPros.forEach(pro => {
          if (this.requestedJob) {
            this.selectedJob.push(pro.oficios.findIndex(
            oficio => oficio.oficio_name == this.requestedJob));
          } else {
            this.selectedJob.push(0);
            pro.oficios.sort();
            if (!this.registeredProfessions.includes(pro.oficios[0].oficio_name)) {
                this.registeredProfessions.push(pro.oficios[0].oficio_name);
            }
          }
          this.panelOpenState.push(false);
        })
      }
      this.registeredProfessions.sort();
    })
  }

  updateJobInfo(proIndex, jobIndex) { 
    this.selectedJob[proIndex] = jobIndex
  }

  filterProByProfession(prof : string, pro : Profesional, ind : number) : boolean {
    if (this.prosShown[ind]) return false;
    this.prosShown[ind] = pro.oficios.some(oficio => oficio.oficio_name == prof) && !this.prosShown[ind];
    if (ind == this.allPros.length-1) this.cd.detach();
    return this.prosShown[ind];
  }
  
}

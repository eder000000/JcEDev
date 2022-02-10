import { ChangeDetectorRef, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/firebase/firebase.service';
import { Profesional } from 'src/app/user/profesional-data-model';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';

@Component({
	selector: 'app-list-pro',
	templateUrl: './list-pro.component.html',
	styleUrls: [ './list-pro.component.css' ]
})
export class ListProComponent  implements OnInit {
	panelOpenState: boolean[];
  allPros: Profesional[];  
  prosShown: boolean[]; //Avoids repetitions when it's printing in the html
  obsPerson: Observable<Profesional[]>;
  requestedJob: string;
  selectedJob: number[];
  registeredProfessions: string[]; //Saves all the profesions

  //New variable
  separatorKeysCodes: number[] = [ENTER, COMMA]; //To say "ok" in the bar search 
  professionCtrl = new FormControl();
  filteredProfessions: Observable<string[]>;
  professions: string[] = []; // Saves the profesions selected by the user

  @ViewChild('profesionInput') profesionInput: ElementRef<HTMLInputElement>;

  constructor(private firebaseService: FirebaseService, 
              private route: ActivatedRoute, 
              private cd : ChangeDetectorRef) {

    // Saves all the profession in the filteredProfession (For print in the recomendation list) 
    this.filteredProfessions = this.professionCtrl.valueChanges.pipe(
      startWith(null), 
      map((profession: string | null) => 
      (profession ? this._filter(profession) : this.registeredProfessions.slice())
      )
    );

  }
  
  ngOnInit():void {
    this.route.queryParams.subscribe(params => { this.requestedJob = params['oficio']; })
    this.selectedJob = []
    this.panelOpenState = []
    this.registeredProfessions = []


    // Gets all the professions from the DB  
     this.firebaseService.getAll().subscribe(async pros => {
      if (!this.requestedJob) this.allPros = pros;
      else {
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
              if (!this.registeredProfessions.includes(pro.oficios[0].oficio_name))
                  this.registeredProfessions.push(pro.oficios[0].oficio_name);
          }
          this.panelOpenState.push(false);
        })
      }

      this.registeredProfessions.sort();
    })    
  }

  updateJobInfo(proIndex, jobIndex) { this.selectedJob[proIndex] = jobIndex; }

  filterProByProfession(prof : string, pro : Profesional, ind : number) : boolean {
    if (this.prosShown[ind]) return false; //Avoids repetitions when it's printing in the html    
    this.prosShown[ind] = pro.oficios.some(oficio => oficio.oficio_name == prof) && !this.prosShown[ind];
    if (ind == this.allPros.length-1) this.cd.detach();
    return this.prosShown[ind];
  }

  // Add data into "professions"
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.professions.push(value);
    }

    // Clear the input value
    if(event.input){
      event.input.value = '';    
    }

    this.professionCtrl.setValue(null);
  }

  // Remove data from "professions"
  // Note: Nowadays It doesn't use
  // remove(fruit: string): void {
  //   const index = this.professions.indexOf(fruit);

  //   if (index >= 0) {
  //     this.professions.splice(index, 1);
  //   }
  //   this.prosShown = [];
  // }

  // Function that allows the user to choose a profession from the list of recommendations
  selected(event: MatAutocompleteSelectedEvent): void {
    this.professions.push(event.option.viewValue);
    this.profesionInput.nativeElement.value = '';
    this.professionCtrl.setValue(null);
    
    this.prosShown = [];
  }

  removeAll(){
    window.location.reload();
    this.professions = [];
    this.prosShown = [];
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.registeredProfessions.filter(profesion => profesion.toLowerCase().includes(filterValue));
  }

}
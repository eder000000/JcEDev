import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/firebase/firebase.service';
import { Profesional } from 'src/app/user/profesional-data-model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';

interface CardData {
  skill_name?: string;
  professionals?: {
    id?: number;
    fotoPerfil?: string;
    nombres?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    selectedJob?: number;
    panelOpenState?: boolean;
    ubicacionTrabajo?: string;
    numeroCelular?: number;
    oficios?: {
      oficio_name?: string;
      oficio_descripcion?: string;
      fotos?: string[];
    }[]
  }[]
}

@Component({
	selector: 'app-list-pro',
	templateUrl: './list-pro.component.html',
	styleUrls: [ './list-pro.component.css' ]
})

export class ListProComponent  implements OnInit {
  cardsData: CardData[];
  queryPros: Profesional[];
  allPros: Profesional[];  
  requestedJob: string;

  registeredProfessions: string[];
  separatorKeysCodes: number[] = [ENTER, COMMA]; 
  professionCtrl = new FormControl();
  filteredProfessions: Observable<string[]>;
  professions: string[] = []; 

  @ViewChild('profesionInput') profesionInput: ElementRef<HTMLInputElement>;

  constructor(private firebaseService: FirebaseService, 
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.requestedJob = params['oficio'];
    })
    
    this.cardsData = [];

    this.firebaseService.getAll().subscribe(pros => {
      // No Requested Job
      this.queryPros = pros;

      if (!this.requestedJob) { 
        var skills:string[] = this.getAllVisibleSkills(pros);
        this.buildCardsData(pros, skills);
      } else {
        // Filter by selected job
        // TODO: Change query to use the filter service
        this.buildCardsDataWithFilter(
          this.getProfessionalsByProfession(pros, this.requestedJob), 
          this.requestedJob
        );

        this.sortCards();
      }

      // Saves all the profession in the filteredProfession (For print in the recomendation list)
      this.registeredProfessions = []
      this.cardsData.forEach(cardData => {
        this.registeredProfessions.push(cardData.skill_name);
      }); 

      this.filteredProfessions = this.professionCtrl.valueChanges.pipe(
        startWith(null), 
        map((profession: string | null) => 
        (profession ? this._filter(profession) : this.registeredProfessions.slice())
        )
      );
    })
  }

  // Add data into "professions"
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (this.registeredProfessions.includes(value)) {
      this.professions.push(value);
    }

    // Clear the input value
    if(event.input){
      event.input.value = '';    
    }

    this.professionCtrl.setValue(null);
    this.buildCardsData(this.queryPros, this.professions);
  }

  // TODO: Delete a single element from list
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
    
    this.buildCardsData(this.queryPros, this.professions);
  }

  // FIXME: Change for a no window.reload solution
  removeAll(){
    window.location.reload();
    this.professions = [];
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.registeredProfessions.filter(profesion => profesion.toLowerCase().includes(filterValue));
  }

  updateJobInfo(skillIndex, proIndex, jobIndex) { 
    this.cardsData[skillIndex]
      .professionals[proIndex]
      .selectedJob = jobIndex    
  }

  buildCardsData(pros: Profesional[], skills:string[]) {
    this.cardsData = [];
    skills.forEach(skill => {
      this.buildCardsDataWithFilter(
        this.getProfessionalsByProfession(pros, skill), 
        skill
      );
    }); 

    this.sortCards();
    this.removeDuplicated();
  } 

  getAllVisibleSkills(pros: Profesional[]): string[] {
    var skills:string[] = [];
    pros.forEach(pro => {
      pro.oficios.forEach(oficio => {
        if (!skills.includes(oficio.oficio_name)) {
          skills.push(oficio.oficio_name)
        }
      })
    });
    return skills;
  }

  sortCards() {
    this.cardsData = this.cardsData.sort((a, b) => {
      if (a.skill_name > b.skill_name) {
        return 1;
      } else if (a.skill_name < b.skill_name) {
        return -1;
      } else {
        return 0;
      }
    });

    this.cardsData.forEach(cardData => {
      cardData.professionals = cardData.professionals.sort((a, b) => {
        if ((a.nombres + a.apellidoPaterno + a.apellidoMaterno) > 
            (b.nombres + b.apellidoPaterno + b.apellidoMaterno)) {
          return 1;
        } else if ((a.nombres + a.apellidoPaterno + a.apellidoMaterno) <
                   (b.nombres + b.apellidoPaterno + b.apellidoMaterno)) {
          return -1;
        } else {
          return 0;
        }
      }) 

      cardData.professionals.forEach(pro => {
        pro.oficios = pro.oficios.sort((a, b) => {
          if (a.oficio_name > b.oficio_name) {
            return 1;
          } else if (a.oficio_name < b.oficio_name) {
            return -1;
          } else {
            return 0;
          }
        });
      })
    });
  }

  removeDuplicated() {
    if (this.cardsData.length < 2) {
      return;
    }

    for (var i = 0; i < this.cardsData.length-1; i++) {
      for (var j = i+1; j < this.cardsData.length; j++) {
        // Get intersection between pro-list of skill_i and skill_j
        var intersection = this.getIntersection(this.cardsData[i], this.cardsData[j])
        if (intersection.length > 0) {
          // Remove right registers
          intersection.forEach(item => {
            this.cardsData[j].professionals = this.cardsData[j].professionals.filter(pro => {
              return pro.id !== item.id;
            })

            // Check if we need to remove card section 
            if (this.cardsData[j].professionals.length === 0) {
              this.cardsData.splice(j, 1);
            }
          });
        }
      }
    }
  }

  getIntersection(listA:CardData, listB:CardData):any {
    var intersection = [];
    var flag:boolean;
    listA.professionals.forEach(elementA => {
      for (var k = 0; k < listB.professionals.length; k++) {
        flag = false;
        if (elementA.id === listB.professionals[k].id) {
          flag = true;
          break;
        }
      }

      if (flag) {
        intersection.push(elementA);
      }
    });
    return intersection;
  }
  
  buildCardsDataWithFilter(pros: Profesional[], filter:string) {
    this.cardsData.push({ skill_name: filter });
    var currentCard: CardData = this.cardsData[this.cardsData.length-1];

    currentCard.professionals = [];
    
    pros.forEach(pro => {
      var defaultSelectedJob:number =  0;
      if (this.requestedJob) {
        for (var k = 0; k < pro.oficios.length; k++) {
          if (pro.oficios[k].oficio_name === this.requestedJob) {
            defaultSelectedJob = k;
            break;
          }
        }
      }

      currentCard.professionals.push({
        id: this.queryPros.indexOf(pro),
        fotoPerfil: pro.fotoPerfil, 
        nombres: pro.nombres, 
        apellidoPaterno: pro.apellidoPaterno, 
        apellidoMaterno: pro.apellidoMaterno, 
        selectedJob: defaultSelectedJob, 
        panelOpenState: false, 
        ubicacionTrabajo: pro.ubicacionTrabajo, 
        numeroCelular: pro.numeroCelular, 
        oficios: pro.oficios
      })
    });
  }

  getProfessionalsByProfession(pros: Profesional[], filter: string) : Profesional[] {
    var filteredPros: Profesional[] = [];
      pros.forEach(pro => {
        pro.oficios.forEach(oficio => {
          if (oficio.oficio_name == filter) {
            filteredPros.push(pro);
            return;
          }
        })
      })
    return filteredPros;
  }
}
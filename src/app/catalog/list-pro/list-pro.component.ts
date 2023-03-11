import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { RemoteDbService } from 'src/app/remote-db/remote-db.service'
import { UserModel } from 'src/app/remote-models/user-model';
import { DomSanitizer } from '@angular/platform-browser';

// FIXME: Default job is not the right one [@serviciosocial]

interface CardData {
  skill_name?: string;
  professionals?: {
    id?: number;
    fotoPerfil?: string;
    primerNombre?: string;
    segundoNombre?: string;
    apellidos?: string;
    logo_org?: string;
    selectedJob?: number;
    panelOpenState?: boolean;
    ubicacionesTrabajo?: string;
    numeroCelular?: string;
    descripcion?: string;
    oficios?: {
      oficio_name?: string;
      oficio_descripcion?: string,
      fotos?: string[];
    }[]
  }[]
}

interface IconOrganization {
  user_model_org: number
  url_logo: string 
}

@Component({
	selector: 'app-list-pro',
	templateUrl: './list-pro.component.html',
	styleUrls: [ './list-pro.component.css' ]
})

export class ListProComponent  implements OnInit {
  cardsData: CardData[];
  queryPros: UserModel[];
  allPros: UserModel[];  
  requestedJob: string;
  iconOrganization: IconOrganization[];

  imagePrefix: string = "data:image/jpeg;base64, ";
  availableProfessions: string[];
  separatorKeysCodes: number[] = [ENTER, COMMA]; 
  professionCtrl = new FormControl();
  filteredProfessions: Observable<string[]>;
  professions: string[] = []; 
  allProfessionIds: number[] = [];
  allProfessions: string[] = [];
  profIdtoName: Map<number, string> = new Map<number, string>();
  profIdtoDesc: Map<number, string> = new Map<number, string>();
  proIdToMedia: Map<number, string> = new Map<number, string>();
  munIdToString: Map<number, string> = new Map<number, string>();
  proAndSkillToMedia: Map<string, string[]> = new Map<string, string[]>();
  

  @ViewChild('profesionInput') profesionInput: ElementRef<HTMLInputElement>;

  constructor(private remoteDbService: RemoteDbService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.requestedJob = params['oficio'];
    })
    
    this.cardsData = [];

    this.iconOrganization = [
      {
        user_model_org: 1,
        url_logo: ""
      },
      {
        user_model_org: 2,
        url_logo: "../../../assets/img/Bempleos circular 4 amarillo.png"
      }
    ]
    //Get all the users
    this.remoteDbService.getPublicUsersInfo().subscribe(pros => {
      // No Requested Job
      this.queryPros = pros;


      // Saves all unique idSkills in an array "this.allProfessionIds" and saves 
      //the key to use the media map "this.proAndSkillToMedia"  
      pros.forEach(pro => {

        // This part prevents profession without registered professionals from appearing in the recomendation list 
        pro.user_model_professions.forEach(oficio => {
          var id: string = 'pro'+pro.user_model_id+'sk'+oficio.profession_id; //unique id for pro and profession
          if (!this.allProfessionIds.includes(oficio.profession_skill)) {
            this.allProfessionIds.push(oficio.profession_skill)
          }

          this.proAndSkillToMedia.set(id, []);
          
          oficio.profession_evidences.forEach(ev => {
            this.proAndSkillToMedia.set(id, [])
            this.remoteDbService.getMediaById(ev.evidence_media).subscribe(m => {
              this.proAndSkillToMedia.get(id).push(m.media_link); 
            })
          })
        });

        
        // Save the professionals' media for a set profession in the map with a unique id
        this.remoteDbService.getUserMediaById(pro.user_model_id).subscribe(media => {
          this.proIdToMedia.set(pro.user_model_id, media.media_data)
        });
        
      });

      // // Request the name of each skill and add it to the array
      // this.allProfessionIds.forEach(id => {
      //   this.remoteDbService.getSkillsById(id).subscribe(skill => {
      //     this.allProfessions.push(skill.skills_name)
      //     this.profIdtoName.set(id, skill.skills_name)
      //     this.profIdtoDesc.set(id, skill.skills_description)
      //   })
      // });

      this.remoteDbService.getSkills().subscribe(skills => {
        skills.forEach(skill => {
          this.allProfessions.push(skill.skills_name)
          this.profIdtoName.set(skill.skills_id, skill.skills_name)
          this.profIdtoDesc.set(skill.skills_id, skill.skills_description)
        })

        // Saves all the profession in the filteredProfession (For print in the recomendation list)
        this.availableProfessions = []
        this.allProfessions.forEach(profession => {
          this.availableProfessions.push(profession);
        }); 
        this.availableProfessions.sort();

        var munArray = [];
        pros.forEach(pro => {
          pro.user_model_working_areas.forEach(wa => {
            if (!munArray.includes(wa.working_area_municipality)) {
              munArray.push(wa.working_area_municipality);
            }
          })
        })

        munArray.forEach(munId => {
          this.remoteDbService.getMunicipalityById(munId).subscribe(mun => {
            this.munIdToString.set(munId, mun.municipality_name);
            // Last mun loaded into map
            if (munArray[munArray.length-1] === mun.id_municipality) {

              if (!this.requestedJob) {
                this.buildCardsData(pros, this.getAllVisibleSkills(pros));
              } else {
                this.buildCardsDataWithFilter(
                  this.getProfessionalsByProfession(pros, this.requestedJob), 
                  this.requestedJob
                );
        
                this.availableProfessions = this.availableProfessions.filter(prof => {
                  return prof !== this.requestedJob; 
                });
        
                this.professions.push(this.requestedJob);
                this.sortCards();
              }
      
              this.filteredProfessions = this.professionCtrl.valueChanges.pipe(
                startWith(null), 
                map((profession: string | null) => 
                (profession ? this._filter(profession) : this.availableProfessions.slice())
                )
              );
            }
          })
        })
      })
    })
   }

  // CHIPLIST ***************************************************************************
  // Add data into "professions" to prints in recommendation bar
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (this.availableProfessions.includes(value)) {
      this.professions.push(value);
      this.availableProfessions = this.availableProfessions.filter(prof => {
        return !this.professions.includes(prof);
      })
      this.availableProfessions.sort();
    }

    // Clear the input value
    if(event.input){
      event.input.value = '';    
    }

    this.professionCtrl.setValue(null);
    this.buildCardsData(this.queryPros, this.professions);
  }

    // Function that allows the user to choose a profession from the list of recommendations
    selected(event: MatAutocompleteSelectedEvent): void {
      this.professions.push(event.option.viewValue);
      this.availableProfessions = this.availableProfessions.filter(prof => {
        return !this.professions.includes(prof);
      })
      this.availableProfessions.sort();
  
      this.profesionInput.nativeElement.value = '';
      this.professionCtrl.setValue(null);
      
      this.buildCardsData(this.queryPros, this.professions);
    }

    removeAll(){
      this.professions = [];
      this.availableProfessions = [];
      this.allProfessions.forEach(prof => {
        this.availableProfessions.push(prof);
      });
      this.availableProfessions.sort();
  
      this.buildCardsData(
        this.queryPros, 
        this.getAllVisibleSkills(this.queryPros)
      )
    }

    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.availableProfessions.filter(profesion => profesion.toLowerCase().includes(filterValue));
    }
  
    loadChipListOptions() {
      //????
    }
    

  // CARDS *******************************************************************************
  remove(profession: string): void {
    const index = this.professions.indexOf(profession);

    if (index >= 0) {
      this.availableProfessions.push(
        this.professions.splice(index, 1)[0]
      )
      this.availableProfessions.sort();
    }

    if (this.professions.length > 0){
      this.buildCardsData(this.queryPros, this.professions);
    } else {
      this.buildCardsData(
        this.queryPros, 
        this.getAllVisibleSkills(this.queryPros)
      )
    }
  }

  updateJobInfo(skillIndex, proIndex, jobIndex) { 
    this.cardsData[skillIndex]
      .professionals[proIndex]
      .selectedJob = jobIndex    
  }

  buildCardsData(pros: UserModel[], skills:string[]) {
    this.cardsData = [];
    skills.forEach(skill => {
      this.buildCardsDataWithFilter(
        this.getProfessionalsByProfession(pros, skill), 
        skill
      );
    }); 

    this.sortCards();
    this.removeDuplicatedCards();
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
        if ((a.primerNombre + a.segundoNombre + a.apellidos) > 
            (b.primerNombre + b.segundoNombre + b.apellidos)) {
          return 1;
        } else if ((a.primerNombre + a.segundoNombre + a.apellidos) <
                   (b.primerNombre + b.segundoNombre + b.apellidos)) {
          return -1;
        } else {
          return 0;
        }
      }) 

      //El problema es que al reordenar los indices se desacomodan 
      // cardData.professionals.forEach(pro => {
      //   pro.oficios = pro.oficios.sort((a, b) => {
      //     if (a.oficio_name > b.oficio_name) {
      //       return 1;
      //     } else if (a.oficio_name < b.oficio_name) {
      //       return -1;
      //     } else {
      //       return 0;
      //     }
      //   });
      // })
    });
  }

  removeDuplicatedCards() {
    if (this.cardsData.length < 2) {
      return;
    }

    for (var i = 0; i < this.cardsData.length-1; i++) {
      for (var j = i+1; j < this.cardsData.length; j++) {
        // Get intersection between pro-list of skill_i and skill_j
        var intersection = this.getIntersectionCards(this.cardsData[i], this.cardsData[j])
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

  getIntersectionCards(listA:CardData, listB:CardData):any {
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

  buildCardsDataWithFilter(pros: UserModel[], filter:string) {
    //Guarda la lista de profesiones que se estan buscando, en caso de no haber parametros se traen todas
    this.cardsData.push({ skill_name: filter }); 
    // console.log("Esto es: this.cardsData")
    // console.log(this.cardsData)
    //Lista de profesionales por profesionales
    var currentCard: CardData = this.cardsData[this.cardsData.length-1];
    // console.log("Esto es: currentCard")
    // console.log(currentCard)
    
    currentCard.professionals = []; //Aqui se guardaran las cartas ya creadas
    
    // console.log("Esto es: pros")
    // console.log(pros)

    pros.forEach(pro => {
      var defaultSelectedJob:number =  0;
      var formattedProfessions = [];
      for (var k = 0; k < pro.user_model_professions.length; k++) {
        if (this.profIdtoName.get(pro.user_model_professions[k].profession_skill) === filter) {
          defaultSelectedJob = k;
        }
        formattedProfessions[k] = {
          "oficio_name": this.profIdtoName.get(pro.user_model_professions[k].profession_skill),
          "oficio_descripcion": this.profIdtoDesc.get(pro.user_model_professions[k].profession_skill),
          "fotos": this.proAndSkillToMedia.get('pro'+pro.user_model_id+'sk'+pro.user_model_professions[k].profession_id).map(foto => this.imagePrefix + foto)
        }
      }

      var workingAreasString = "";
      pro.user_model_working_areas.forEach(wa => {
        workingAreasString += this.munIdToString.get(wa.working_area_municipality);
        if (pro.user_model_working_areas[pro.user_model_working_areas.length -1] != wa){
          workingAreasString += ", "
        }
      })

      var iconOrganizarion = '';
      this.iconOrganization.forEach(actualOrganizarion => {
        if(actualOrganizarion.user_model_org == pro.user_model_org) iconOrganizarion = actualOrganizarion.url_logo
      })
      
      currentCard.professionals.push({
        id: this.queryPros.indexOf(pro),
        fotoPerfil: this.imagePrefix + this.proIdToMedia.get(pro.user_model_id), 
        primerNombre: pro.user_model_first_name,
        segundoNombre: pro.user_model_surname,
        apellidos: pro.user_model_last_name,
        logo_org: iconOrganizarion,
        selectedJob: defaultSelectedJob, 
        panelOpenState: false, 
        ubicacionesTrabajo: workingAreasString, 
        numeroCelular: pro.user_model_phone_number,
        descripcion: pro.user_model_description, 
        oficios: formattedProfessions
      })
    });
  }

  //UTILIDAD ---
  getAllVisibleSkills(pros: UserModel[]): string[] {
    var skills:string[] = [];
    var skillIds:number[] = [];
    pros.forEach(pro => {
      pro.user_model_professions.forEach(oficio => {
        if (!skillIds.includes(oficio.profession_skill)) {
          skillIds.push(oficio.profession_skill)
        }
      });
    });

    skillIds.forEach(id => {
      skills.push(this.profIdtoName.get(id));
    });
    return skills;
  }


  getProfessionalsByProfession(pros: UserModel[], filter: string) : UserModel[] {
    var filteredPros: UserModel[] = [];
    pros.forEach(pro => {
      pro.user_model_professions.forEach(oficio => {
        if (this.profIdtoName.get(oficio.profession_skill) == filter) {
          filteredPros.push(pro);
          return;
        }
      })
    })
    return filteredPros;
  }
}
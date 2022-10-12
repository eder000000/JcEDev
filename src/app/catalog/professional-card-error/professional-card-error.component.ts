import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-professional-card-error',
  templateUrl: './professional-card-error.component.html',
  styleUrls: ['./professional-card-error.component.css']
})
export class ProfessionalCardErrorComponent implements OnInit {
  professionalErrorImage = './assets/img/professional-card-error-image.png';

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
	imageError = './assets/img/undraw_Notify_re_65on.png';

  constructor() { }

  ngOnInit(): void {
  }

}

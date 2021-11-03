import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'JcEApp';

  constructor(
    private breakpointObserver : BreakpointObserver) { }
  
  ngOnInit(): void {
    if (this.breakpointObserver.isMatched('(min-height: 900px)')) {
      console.log('The 900px viewport matched!');
    }
}
}

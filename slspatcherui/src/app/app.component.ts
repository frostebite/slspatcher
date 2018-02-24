import { Component, HostListener } from '@angular/core';
import { ISlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { OnInit, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
  }
  title = 'app';
  status = 'Waiting...';
  hasLoggedIn : boolean;

  @HostListener('window:syncing-all', ['$event', "$event.detail.state"]) 
  updateNodes(event, state) {
    console.log(state);
    this.status = state;
  }
}

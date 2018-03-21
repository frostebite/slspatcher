import { Component, OnInit, HostListener } from '@angular/core';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  path = {path: "not set"};

  @HostListener('window:config-read', ['$event', "$event.detail.state"]) 
  updateNodes(event, state) {
    this.path = state;
    console.log("received event config read"+state);
  }
}

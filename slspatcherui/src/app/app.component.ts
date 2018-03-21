import { Component, HostListener } from '@angular/core';
import { ISlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { OnInit, EventEmitter } from '@angular/core';
import { PatchingModalComponent } from './Dialog/patching-modal/patching-modal.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public dialog: MatDialog){
  }
  ngOnInit(): void {
      this.version = window.localStorage.getItem("version");

  }
  title = 'app';
  status = 'Waiting...';
  hasLoggedIn : boolean;
  version = "0.0.0";

  @HostListener('window:syncing-all', ['$event', "$event.detail.state"]) 
  updateNodes(event, state) {
    console.log(state);
    this.status = state;
  }

  patchingDialog;

  @HostListener('window:app-patch', ['$event'])
  openDialog(event): void {
    let patchingDialog = this.dialog.open(PatchingModalComponent);
  }
}

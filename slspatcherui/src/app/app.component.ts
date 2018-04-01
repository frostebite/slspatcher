import { Component, HostListener } from '@angular/core';
import { ISlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { OnInit, EventEmitter } from '@angular/core';
import { PatchingModalComponent } from './Dialog/patching-modal/patching-modal.component';
import { MatDialog } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  LoginForm: FormGroup;

  constructor(public dialog: MatDialog, 
    public formbuilder: FormBuilder,
    public readonly http: HttpClient) {
    this.LoginForm = formbuilder.group({
        loginid: ['', Validators.required],
        password: ['', Validators.required]
    }, {});
  }
  ngOnInit(): void {
      this.version = window.localStorage.getItem("version");

  }
  title = 'app';
  status = 'Waiting...';
  hasLoggedIn : boolean = false;
  version = "0.0.0";

  @HostListener('window:syncing-all', ['$event', "$event.detail.state"]) 
  updateNodes(event, state) {
    console.log(state);
    this.status = state;
  }

  patchingDialog;

  @HostListener('window:app-patch', ['$event'])
  openDialog(event): void {
    let patchingDialog = this.dialog.open(PatchingModalComponent, {disableClose: true});
  }

  
  Login(){
    var headers = new HttpHeaders();
    this.http.post("http://api.uk-sf.com/api/authtoken", this.LoginForm.value).subscribe(Result=>{
      if(Result["result"]=="success"){
        this.hasLoggedIn = true;
      }
    });
  }

  Logout(){
    this.hasLoggedIn = false;
  }
}

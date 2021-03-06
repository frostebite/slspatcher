import { Component, OnInit, HostListener } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.apps.forEach(element => {
      window.dispatchEvent(new CustomEvent("get-project-status", {detail:{directory:element.directory, project:element.name}}));
    });
  }
  apps:any[] = [
    {name: "Turn of War"            , directory:"ToW",                      description: "A game about ...", isAvailable:true,  status:"available"},
    {name: "Turn of War - WW2 "     , directory:"ToWWW2",                   description: "A game about ...", isAvailable:true,  status:"available"},
    {name: "Poser 3D"               , directory:"Poser",    launch:"Poser", description: "A game about ...", isAvailable:true,  status:"available"},
    {name: "Squad MOBA"             , directory:"MOBA",                     description: "A game about ...", isAvailable:false, status:"available"},
    {name: "The Valley"             , directory:"Valley",                   description: "A game about ...", isAvailable:true,  status:"available"},
    {name: "Area of Operations"     , directory:"AoO",                      description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Fantasy MMO"            , directory:"FMMO",                     description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Battle"                 , directory:"Battle",                   description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Fury Road MMO"          , directory:"Fury",                     description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Western MMO"            , directory:"wMMO",                     description: "A game about ...", isAvailable:false, status:"available"},
    {name: "SWAT/HVT"               , directory:"HVT",                      description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Paranormal"             , directory:"PNormal",                  description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Space?"                 , directory:"Space",                    description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Top Down/OTS Survival"  , directory:"TDS",                      description: "A game about ...", isAvailable:false, status:"available"},
  ];

  @HostListener('window:project-status', ['$event', "$event.detail.state", "$event.detail.project"]) 
  getStatus(event, state, project) {
    this.apps.forEach(element => {
      if(element.name == project || element.directory == project){
        element.status = state;
        if(event.detail.Size)
          element.size = event.detail.Size;
        if(event.detail.UpdateSize)
          element.UpdateSize = event.detail.UpdateSize;
        if(event.detail.DownloadSize)
          element.DownloadSize = event.detail.DownloadSize;
        if(event.detail.LocalSize)
          element.DownloadSize = event.detail.LocalSize;
        console.log(element);
      }
    });
  }

  Install(app){
    console.log(app);
    window.dispatchEvent(new CustomEvent("install-project", {detail:app}));
  }

  Launch(app){
    console.log(app);
    window.dispatchEvent(new CustomEvent("launch-project", {detail:app}));
  }

  Open(app){
    console.log(app);
    window.dispatchEvent(new CustomEvent("open-project-folder", {detail:app}));
  }
}

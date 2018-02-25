import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  apps:any[] = [
    {name: "Turn of War"            , description: "A game about ...", isAvailable:true, status:"ready"},
    {name: "Turn of War - WW2 "     , description: "A game about ...", isAvailable:true, status:"update"},
    {name: "Poser 3D"               , description: "A game about ...", isAvailable:true, status:"downloading"},
    {name: "Squad MOBA"             , description: "A game about ...", isAvailable:false, status:"available"},
    {name: "The Valley"             , description: "A game about ...", isAvailable:true, status:"available"},
    {name: "Area of Operations"     , description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Fantasy MMO"            , description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Battle"                 , description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Fury Road MMO"          , description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Western MMO"            , description: "A game about ...", isAvailable:false, status:"available"},
    {name: "SWAT/HVT"               , description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Paranormal"             , description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Space?"                 , description: "A game about ...", isAvailable:false, status:"available"},
    {name: "Top Down/OTS Survival"  , description: "A game about ...", isAvailable:false, status:"available"},
  ];
}

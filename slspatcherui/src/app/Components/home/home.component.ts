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
    {name: "Turn of War"            , description: "A game about ...", status:"ready"},
    {name: "Turn of War - WW2 "     , description: "A game about ...", status:"update"},
    {name: "Poser 3D"               , description: "A game about ...", status:"downloading"},
    {name: "Squad MOBA"             , description: "A game about ...", status:"available"},
    {name: "The Valley"             , description: "A game about ...", status:"ready"},
    {name: "Area of Operations"     , description: "A game about ...", status:"ready"},
    {name: "Fantasy MMO"            , description: "A game about ...", status:"ready"},
    {name: "Battle"                 , description: "A game about ...", status:"ready"},
    {name: "Fury Road MMO"          , description: "A game about ...", status:"ready"},
    {name: "Western MMO"            , description: "A game about ...", status:"ready"},
    {name: "SWAT/HVT"               , description: "A game about ...", status:"ready"},
    {name: "Paranormal"             , description: "A game about ...", status:"ready"},
    {name: "Space?"                 , description: "A game about ...", status:"ready"},
    {name: "Top Down/OTS Survival"  , description: "A game about ...", status:"ready"},
  ];
}

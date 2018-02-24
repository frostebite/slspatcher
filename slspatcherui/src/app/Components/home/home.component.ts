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
    {name: "Turn of War"        , status:"ready"},
    {name: "Turn of War - WW2 " , status:"update"},
    {name: "Poser 3D"           , status:"downloading"},
    {name: "Squad MOBA"         , status:"available"},
    {name: "The Valley"         , status:"ready"},
    {name: "Area of Operations" , status:"ready"},
    {name: "Fantasy MMO"        , status:"ready"},
    {name: "Battle"             , status:"ready"},
    {name: "Fury Road MMO"      , status:"ready"},
    {name: "Western MMO"        , status:"ready"},
    {name: "SWAT/HVT"           , status:"ready"},
    {name: "Paranormal"         , status:"ready"},
    {name: "Space?"             , status:"ready"},
    {name: "Top Down/OTS Base"  , status:"ready"},
  ];
}

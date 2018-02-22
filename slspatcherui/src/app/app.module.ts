import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { AppComponent } from './app.component';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, MatCardModule, MatButtonModule, MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { AppComponent } from './app.component';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { SocialComponent } from './Components/social/social.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { LoginComponent } from './Components/login/login.component';
import { DeveloperComponent } from './Components/developer/developer.component';
import { MissingComponent } from './Components/missing/missing.component';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatInputModule} from '@angular/material/input';
const appRoutes: Routes = [
  { path: 'developer', component: DeveloperComponent },
  { path: 'social',      component: SocialComponent },
  { path: 'settings',      component: SettingsComponent },
  { path: 'home',      component: HomeComponent },
  { 
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: MissingComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SocialComponent,
    SettingsComponent,
    LoginComponent,
    DeveloperComponent,
    MissingComponent
  ],
  imports: [
    BrowserModule, MatCardModule, MatButtonModule, MatCheckboxModule, MatToolbarModule,MatIconModule,MatProgressBarModule,MatInputModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    NgSlimScrollModule
  ],
  providers: [
    {
      provide: SLIMSCROLL_DEFAULTS,
      useValue: {
        alwaysVisible : false
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

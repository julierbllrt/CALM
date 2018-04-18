import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UsersService } from './shared/services/users.service';
import { AppComponent } from './app.component';
import {HomeComponent} from "./home/home";
import {ContactComponent} from "./contact/contact";
import {AboutComponent} from "./about/about";
import {LoginComponent} from "./login/login";
import {PostComponent} from './post/post.component';
import {NotFoundComponent} from "./not-found/not-found";
import {appRouting} from "./app.routing";
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './shared/services/authentication.service';
import { TreatmentService } from './shared/services/treatment.service';
import { ProfileComponent } from './profile/profile.component';
import { TrimValueAccessorModule } from 'ng-trim-value-accessor'; // Remove the trailing and the leading spaces
import { MedicalFileComponent } from './medical-file/medical-file.component';
import { DoctorProfileComponent } from './medical-file/doctor-profile/doctor-profile.component';
import { CurrentTreatmentComponent } from './medical-file/current-treatment/current-treatment.component';
import { MedicalFileService} from "./shared/services/medical-file.service";
import { SettingsComponent} from "./profile/settings/settings.component";
import { CalendarComponent } from './medical-file/calendar/calendar.component';
import { ReminderComponent } from './medical-file/reminder/reminder.component';
import { DoctorSpaceComponent } from './doctor-space/doctor-space.component';
import { BuildingSpaceComponent } from './building-space/building-space.component';
import { DoctorSpaceService} from './shared/services/doctor-space.service';
import { GoogleMapComponent } from './patient_rdv/google-map/google-map.component';
import{ AgmCoreModule } from '@agm/core';
import { PostsComponent } from './medical-file/posts/posts.component';
import { OrganisationSpaceComponent } from './organisation-space/organisation-space.component';
import {PatientTreatmentComponent} from './doctor-space/patient-treatment/patient-treatment.component';
import {PatientRdvComponent} from "./patient_rdv/patient_rdv.component";
import {DoctorRdvComponent} from "./doctor_rdv/doctor_rdv.component";
import {RdvService} from "./shared/services/rdv.service";
import {DoctorSearchService} from "./shared/services/doctor-search.service";
import {AutorisationService} from "./shared/services/autorisation.service";
import {MailService} from "./shared/services/mail.service";
import {LogService} from "./shared/services/log.service";

import {ReminderService} from "./shared/services/reminder.service";
import {DialogComponent} from "./medical-file/reminder/dialog.component";
import {DialogAnchorDirective} from "./medical-file/reminder/dialoganchor.directive";
import {AlertInfoComponent} from "./alert/alert-info.component";
import {GestionSupervisorComponent} from "./profile/settings/gestion-autorisation/gestion-supervisor.component";
import {GestionObserverComponent} from "./profile/settings/gestion-autorisation/gestion-observer.component";
import {GooglemapsService} from "./shared/services/googlemaps.service";
import { ReCaptchaModule } from 'angular2-recaptcha';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    AboutComponent,
    LoginComponent,
    NotFoundComponent,
    RegisterComponent,
    ProfileComponent,
    MedicalFileComponent,
    DoctorProfileComponent,
    CurrentTreatmentComponent,
    PatientTreatmentComponent,
    SettingsComponent,
    CalendarComponent,
    ReminderComponent,
    DoctorSpaceComponent,
    BuildingSpaceComponent,
    PostComponent,
    PatientRdvComponent,
    DoctorRdvComponent,
    OrganisationSpaceComponent,
    GoogleMapComponent,
    PostsComponent,
    DialogComponent,
    DialogAnchorDirective,
    AlertInfoComponent,
    GestionSupervisorComponent,
    GestionObserverComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    appRouting,
    TrimValueAccessorModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDVDZy1qXBBu6ctMvyYcSONy3-cs5PjYNU'
    }),
    ReCaptchaModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    UsersService,
    AuthenticationService,
    MedicalFileService,
    DoctorSpaceService,
    TreatmentService,
    DoctorSearchService,
    RdvService,
    MailService,
    LogService,
    ReminderService,
    AutorisationService,
    GooglemapsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

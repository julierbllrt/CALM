import { Component, OnInit } from '@angular/core';
import { isNumber } from "util";
import { forEach } from "@angular/router/src/utils/collection";
import { DoctorSearchService } from "../../shared/services/doctor-search.service";
import { UsersService } from "../../shared/services/users.service";
import { User } from "../../shared/models/user";
import { GooglemapsService } from "../../shared/services/googlemaps.service";
import { Autorisation } from "../../shared/models/autorisation";
import { AutorisationService } from "../../shared/services/autorisation.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  lat: number = 50.6315144;
  lng: number = 3.056218;
  zoom: number = 8;
  me: User;
  rayon: number;
  response: Object[] = [];
  // coordonate_list =[{'lng': 50.6315,'lat': 3.056, 'display': false,'id':0},{'lng': 50.6315,'lat': 3.156, 'display': false,'id':1}];

  constructor(private doctorSearch: DoctorSearchService,
    private userService: UsersService,
    private googlemapsService: GooglemapsService,
    private autorisationService: AutorisationService,
    private router: Router) {
    this.rayon = 10;
  }

  clikedMark(id: number): void {

    for (let temp of this.response) {
      if (temp['_id'] == id) {
        temp['isDisplay'] = true;
      }
      else
        temp['isDisplay'] = false;
    }
  }
  rechercheClick(searchText: string): void {
    if (searchText != '') {
      let searchKey: string = searchText + " " + "hopital";
      this.response = [];
      this.searchMedecins(searchKey);
      console.log(searchKey);
    }
    else {
      console.log('ya rien');
    }
  }
  mapClick(): void {
    for (let temp of this.response) {
      temp['isDisplay'] = false;
    }
  }


  newDoctorRdv(user_doctor: User) {
    // ajout autorisation RDV
    let autorisation = new Autorisation(null);
    autorisation.user = new User(this.me);
    autorisation.observer = new User(user_doctor);
    autorisation.subject = 'RDV';
    autorisation.type = 'READ_WRITE';
    autorisation.valide = true;
    autorisation.confirm = true;
    this.autorisationService.addAutorisation(autorisation)
      .subscribe(resp => {
        console.log(resp);
        // on redirige vers la page de reservation de rendez vous du docteur
        this.router.navigate(['/patient_rdv/', autorisation.observer._id]);
        location.reload();
      });
  }

  searchMedecins(searchText: string): void {

    this.doctorSearch.getAllUserDoctor()
      .subscribe(usersDoctor => {

        this.googlemapsService.convertAddresstoCode(searchText)
          .subscribe(resp => {
            const position = resp.results[0].geometry.location;
            if (usersDoctor) {
              for (let user of usersDoctor) {
                if (user.address.latitude && user.address.longitude) {
                  const latMe = position.lat * (Math.PI / (180));
                  const lngMe = position.lng * (Math.PI / (180));
                  const latDoc = user.address.latitude * (Math.PI / (180));
                  const lngDoc = user.address.longitude * (Math.PI / (180));
                  const R = 6367445;

                  const DistanceAB = R * Math.acos(Math.sin(latMe) * Math.sin(latDoc) + Math.cos(latMe) * Math.cos(latDoc) * Math.cos(lngMe - lngDoc));

                  console.log('distance : ' + DistanceAB.toString() + " Rayon max : " + (this.rayon * 1000).toString());
                  if (DistanceAB <= (this.rayon * 1000)) {
                    // afficher le marker
                    user.isDisplay = false;
                    this.response.push(user);
                  }
                }
              }

              // modifier centre maps
              this.lat = position.lat;
              this.lng = position.lng;
              this.zoom = 12;
            }
          });




      });
  }

  reSetCenter(): void {
    let _this = this;
    if (this.response.length !== 0) {
      this.zoom = 8;
      let sumLng = 0;
      let sumLat = 0;
      for (let temp of this.response) {
        sumLng += temp['address'].longitude;
        sumLat += temp['address'].latitude;
      }
      this.lng = sumLng / this.response.length + 0.1;
      this.lat = sumLat / this.response.length + 0.1;
      console.log(this.lng);
      console.log(this.lat);
      setTimeout(function() {
        _this.zoom = 10;
        _this.lng = _this.lng - 0.1;
        _this.lat = _this.lat - 0.1;
      }, 100);
    }
    else {
      console.log(this.lng);
      console.log(this.lat);
    }

  }
  zoomChange(): void {
  }


  ngOnInit() {
    this.userService.getProfile()
      .subscribe(resp => {
        this.me = new User(resp);
        console.log(this.me);
        this.doctorSearch.getAllUserDoctor()
          .subscribe(usersDoctor => {
            console.log(usersDoctor);
            if (usersDoctor) {
              for (const user of usersDoctor) {
                if (user.address.latitude && user.address.longitude) {
                  console.log(user);
                  const latMe = this.me.address.latitude * (Math.PI / (180));
                  const lngMe = this.me.address.longitude * (Math.PI / (180));
                  const latDoc = user.address.latitude * (Math.PI / (180));
                  const lngDoc = user.address.longitude * (Math.PI / (180));
                  const R = 6378137;

                  const DistanceAB = R * Math.acos(Math.sin(latMe) * Math.sin(latDoc) + Math.cos(latMe) * Math.cos(latDoc) * Math.cos(lngDoc - lngMe));
                  console.log('Distance user to doctor : ' + DistanceAB.toString());

                  if (DistanceAB <= (this.rayon * 1000)) {
                    // afficher le marker
                    user.isDisplay = false;
                    this.response.push(user);
                  }
                }

              }
            }

          });
      });
  }

}

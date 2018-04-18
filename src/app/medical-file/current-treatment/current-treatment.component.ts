import { Component, OnInit } from '@angular/core';
import { TreatmentService } from '../../shared/services/treatment.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Http, Headers, RequestOptions, Jsonp } from '@angular/http';
import { JsonpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { Treatment } from '../../shared/models/treatment';
import { User } from '../../shared/models/user';
import { UsersService } from '../../shared/services/users.service';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-current-treatment',
  templateUrl: './current-treatment.component.html',
  styleUrls: ['./current-treatment.component.css'],
  providers: [UsersService]
})
export class CurrentTreatmentComponent implements OnInit {
  userId: string;
  currentUser: User;
  selectedUser: User;
  treatments: Treatment[] = [];
  start: Date;
  searchList: {}[];
  treatmentInfo: {};
  interaction: {}[];
  treatmentDetail: Treatment;




  constructor(private http: Http, private treatment: TreatmentService,
    private usersService: UsersService, private route: ActivatedRoute, ) {

  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.userId = params['id'];
      if (this.userId) {
        this.getMedicamentList();
        this.usersService.getUser(this.userId).subscribe(
          data => {
            this.selectedUser = data;
            this.usersService.getProfile()
              .subscribe(user => {
                this.currentUser = new User(user);
                this.getMedicamentList();
              });
          },
          error => console.log(error)
        );
      } else {
        console.log('404');
      }
    });


  };

  getMedicamentList() {
    this.treatment.getUserTreatment(this.userId).subscribe(
      data => {
        this.treatments = data;
        this.treatments.forEach(function(element) {
          this.treatment.getTreatmentInfo(element.codeCIS).subscribe(response => {
            const tmp = JSON.parse(response);
            if (tmp != null) {

              element.substances = tmp.compositions[0].substancesActives.map(a =>
                a.denominationSubstance);
            }
          },
            error => console.log(error));
          if (element.start != null) {
            element.start = new Date(element.start);
          } else {
            element.start = new Date();
          }
          if (element.end != null) {
            element.end = new Date(element.end);
          } else {
            element.start = new Date();
          }
        }.bind(this));
        this.getInteraction(this.treatments.map(a => a.codeCIS));
      },
      error => console.log(error)
    );
  };

  getMedicamentInfo(bob: Treatment) {
    console.log("getmedicamentinfo");
  //  console.log(bob);
    this.treatmentDetail = bob;
    console.log(this.treatmentDetail);

  }

  getTreatmentInfo(treatment: Treatment) {
    this.treatment.getTreatmentInfo(treatment.codeCIS).subscribe(data => {
      this.treatmentInfo = JSON.parse(data);
    },
      error => console.log(error));
  }

  getInteraction(ids: {}[]) {
    if (ids.length > 0) {
      this.treatment.getTreatmentInteraction(ids.join('|')).subscribe(
        data => {
          this.interaction = JSON.parse(data);

        },
        error => console.log(error)
      );
    }
  };

  redirect(url: string) {
    window.open(url);
  }
}

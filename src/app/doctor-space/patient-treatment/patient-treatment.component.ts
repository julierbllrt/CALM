///<reference path="../../shared/models/treatment.ts"/>
import {Component, OnInit} from '@angular/core';
import {TreatmentService} from '../../shared/services/treatment.service';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Http, Headers, RequestOptions, Jsonp} from '@angular/http';
import {JsonpModule} from '@angular/http';
import 'rxjs/add/operator/map';
import {Treatment} from '../../shared/models/treatment';
import {User} from '../../shared/models/user';
import {UsersService} from '../../shared/services/users.service';
import {Patient} from '../../shared/models/patient';
import {ActivatedRoute, Params, Router} from '@angular/router';


@Component({
  selector: 'app-patient-treatment',
  templateUrl: './patient-treatment.component.html',
  styleUrls: ['./patient-treatment.component.css'],
  providers: [UsersService],
  inputs: [
    'patient'
  ]
})
export class PatientTreatmentComponent implements OnInit {
  currentUser: User;
  treatments: Treatment[] = [];
  userId: string;
  selectedTreatment: Treatment;
  newTreatment: Treatment;
  search: string;
  searchList: {}[];
  treatmentInfo: {};
  derivateList: {}[];
  codeCIS: string;
  name: string;
  oldMedicName: string;
  interaction: {}[];

  constructor(private http: Http, private treatment: TreatmentService, private usersService: UsersService,
              private route: ActivatedRoute, private router: Router) {
    this.currentUser = new User({});
  }

  ngOnInit() {
    this.newTreatment = new Treatment({});
	console.log("patient_treament");
    this.route.params.subscribe((params: Params) => {
      this.userId = params['id'];
      if (this.userId) {
	console.log(this.userId);
        this.getMedicamentList();
        this.usersService.getUser(this.userId).subscribe(
          data => {
            this.currentUser = data;
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
        this.treatments.forEach(function (element) {
	  console.log(element);
          this.treatment.getTreatmentInfo(element.codeCIS).subscribe(response => {
              const tmp = JSON.parse(response);
              if (tmp != null) {

                element.substances = tmp.compositions[0].substancesActives.map(a => a.denominationSubstance);
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
//          element.end.toLocaleDate| date:'dd/MM/yyyy'String('fr-FR');
        }.bind(this));
        this.getInteraction(this.treatments.map(a => a.codeCIS));
      },
      error => console.log(error)
    );
  };

  deleteMedicament(id: string) {
    const result = confirm('Supprimer définitivement ?');
    if (result) {
      this.treatment.deleteTreatment(id).subscribe(
        data => {
          this.getMedicamentList();
        },
        error => console.log(error)
      );
    }
  };

  isSelected(id: string) {
    if (this.selectedTreatment) {
      if (this.selectedTreatment._id === id) {
        return true;
      }
    }
    return false;
  }

  updateSelectedTreatment(treatment: Treatment) {
    this.selectedTreatment = treatment;
    this.clean();
  }

  updateUserTreatment(treatment: Treatment) {
    if (this.name != null && this.codeCIS != null) {
      //console.log('1');
      treatment.codeCIS = this.codeCIS;
      treatment.name = this.name;
    }
    this.treatment.updateUserTreatment(treatment._id, treatment).subscribe(
      data => {
        this.getMedicamentList();
        this.selectedTreatment = null;
      },
      error => console.log(error)
    );
    this.clean();
  }

  expiredTreatment(treatment: Treatment) {
    const result = confirm('Fin du traitement ?');
    if (result) {
      treatment.expired = true;
      this.updateUserTreatment(treatment);
    }
  }

  addTreatment(codeCIS: string, denomination: string) {
    /* if (treatment == null || treatment.name == null || treatment.start == null
       || treatment.typeFrequence == null || treatment.frequence == null
       || treatment.quantity == null || treatment.end == null || treatment.takingState == null) {
       console.log('Missing information');
     } else {
     */
    const treatment = new Treatment({});
    treatment.codeCIS = codeCIS;
    treatment.name = denomination;
    treatment.start = new Date();
    treatment.end = null;
    treatment.takingState = '';
    treatment.quantity = null;
    treatment.frequence = null;
    treatment.typeFrequence = '';
    treatment.expired = null;
    treatment.info = null;

    console.log(treatment);
    this.treatment.addTreatment(this.userId, treatment).subscribe(
      data => {
        this.newTreatment = new Treatment({});
        this.getMedicamentList();
        this.selectedTreatment = null;
      },
      error => console.log(error)
    );
    this.clean();
  }

  getMedicName(medicName: string) {
    this.treatment.getMedicamentList(medicName).subscribe(data => {
        let medicList = JSON.parse(data);

      },
      error => console.log(error));
  }

  eventHandler(event) {
    if (event !== '') {
      this.treatment.getMedicamentList(event).subscribe(data => {
          this.searchList = JSON.parse(data);
        },
        error => console.log(error));
    }
  }

  getTreatmentInfo(treatment: Treatment) {
    this.treatment.getTreatmentInfo(treatment.codeCIS).subscribe(data => {
        this.treatmentInfo = JSON.parse(data);
        console.log(this.treatmentInfo);
      },
      error => console.log(error));
  }

  changeCIS(event) {
    console.log(event);
    this.codeCIS = event.codeCIS;
    this.name = event.denomination;
  }

  redirect(url: string) {
    window.open(url);
  }


  getDerivateList(substance: string, medic: Treatment) {
    if (this.oldMedicName == null || this.oldMedicName == '') {
      this.oldMedicName = medic.name;

      substance = this.removeAccent(substance);

      if (typeof this.derivateList !== 'undefined' && this.derivateList != null && this.derivateList.length > 0) {
        this.derivateList = [];
      }
      this.treatment.getMedicamentList(substance).subscribe(data => {
          this.derivateList = JSON.parse(data);

        },
        error => console.log(error));
    }
  }

  clean() {
    this.oldMedicName = '';
    this.derivateList = [];
    this.codeCIS = null;
    this.name = null;
    this.searchList = [];
  }

  removeAccent(string: string) {
    if (string == null) {
      return null;
    }
      const accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
      ];
      const noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];
      let result = string;
      for (let i = 0; i < accent.length; i++) {
        result = result.replace(accent[i], noaccent[i]);
      }
      return result;

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
}

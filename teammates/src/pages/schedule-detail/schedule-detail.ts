import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {Schedule} from "../../models/schedule";

/*
  Generated class for the ScheduleDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-schedule-detail',
  templateUrl: 'schedule-detail.html'
})
export class ScheduleDetailPage {

  id: string;
  schedule: FirebaseObjectObservable<Schedule>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFire
  ) {
      this.id = navParams.get('id');
  }
    ionViewDidEnter() {
        this.schedule = this.af.database.object(`/schedules/${this.id}`);
    }


}

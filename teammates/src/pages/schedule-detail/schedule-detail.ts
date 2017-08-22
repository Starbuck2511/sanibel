import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';
import 'rxjs/add/operator/map'
import * as moment from 'moment/min/moment-with-locales';
import {TranslateService} from 'ng2-translate';
import {Observable} from 'rxjs/Observable';

import {AuthService} from '../../components/auth/auth.service';

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
    schedule: Observable<Schedule>;
    segment: string;
    accepts: Observable<any>;
    declines: Observable<any>;
    translation: Observable<Object>;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private toastCtrl: ToastController,
                private af: AngularFire,
                private auth: AuthService,
                private translate: TranslateService) {
        this.id = navParams.get('id');
        moment.locale('de');
        this.segment = 'feedback';
    }

    public accept(){
        this.af.database.object(`/schedules/${this.id}/feedback/declines/${this.auth.getUid()}`).remove();
        this.af.database.object(`/schedules/${this.id}/feedback/accepts/${this.auth.getUid()}`).set({
            email: this.auth.getEmail(),
            displayName: this.auth.getDisplayName()
        });
        this.feedbackToast();
    }

    public decline(){
        this.af.database.object(`/schedules/${this.id}/feedback/accepts/${this.auth.getUid()}`).remove();
        this.af.database.object(`/schedules/${this.id}/feedback/declines/${this.auth.getUid()}`).set({
            email: this.auth.getEmail(),
            displayName: this.auth.getDisplayName()
        });
        this.feedbackToast();

    }

    private feedbackToast(){
        let toast = this.toastCtrl.create({
            message: this.translation['action_success'],
            duration: 2000
        });
        toast.present().then(() => {
                this.segment = 'overview';
            }
        );
    }


    ionViewDidEnter() {
        this.schedule  = this.af.database.object(`/schedules/${this.id}`).map(
            scheduleDetail => {
                // format the ISO 8601 date string into a pretty locale date
                scheduleDetail.prettyDate = moment(scheduleDetail.current).format('LLLL') + '\xa0Uhr';
                return scheduleDetail;
            }
        );

        this.accepts = this.af.database.list(`/schedules/${this.id}/feedback/accepts`);
        this.declines = this.af.database.list(`/schedules/${this.id}/feedback/declines`);

        this.translate.getTranslation(this.translate.currentLang).subscribe((res) => {
                this.translation = res.app;
            }
        );
    }


}

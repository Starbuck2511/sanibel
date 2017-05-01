import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import * as moment from 'moment/min/moment-with-locales';

import {Schedule} from '../../models/schedule';
import {AuthService} from '../../components/auth/auth.service';
import {AlertService} from '../../components/alert/alert.service';
import {AppConfig} from '../../app/app.config';

/*
 Generated class for the ScheduleAdd page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-schedule-add',
    templateUrl: 'schedule-add.html'
})
export class ScheduleAddPage {

    scheduleForm: FormGroup;

    name: AbstractControl;
    date: AbstractControl;
    type: AbstractControl;

    groupSchedules: FirebaseListObservable<any[]>;
    schedules: FirebaseListObservable<Schedule[]>;

    userId: string;
    groupId: string;

    schedule: Schedule;

    dayNames: Array<string>;
    dayShortNames: Array<string>;
    monthNames: Array<string>;
    monthShortNames: Array<string>;
    minDate: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private af: AngularFire,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private auth: AuthService,
                private alert: AlertService
    ) {

        moment.locale('de');
        this.dayNames = AppConfig.DATETIME_CONFIG.dayNames;
        this.dayShortNames = AppConfig.DATETIME_CONFIG.dayShortNames;
        this.monthNames = AppConfig.DATETIME_CONFIG.monthNames;
        this.monthShortNames = AppConfig.DATETIME_CONFIG.monthShortNames;

        this.schedule = new Schedule();
        this.groupId = navParams.get('id');

        this.scheduleForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            date: ['', Validators.required],
            type: ['', Validators.required]

        });

        this.userId = this.auth.getUid();
        this.name = this.scheduleForm.controls['name'];
        this.date = this.scheduleForm.controls['date'];
        this.type = this.scheduleForm.controls['type'];

    }

    addSchedule(formData) {
        this.alert.showLoading('');
        this.schedule.name = this.name.value;
        // datetime picker returns utc without local offset, so we have to handle it here
        let offset = moment().utcOffset();
        let offsetDate = moment(this.date.value).utc().subtract(offset, 'm').format();
        this.schedule.date = offsetDate;
        this.schedule.current = offsetDate;
        this.schedule.type = this.type.value;
        this.schedule.uid = this.userId;
        this.schedule.feedback = null;

        let newRef = this.schedules.push(this.schedule);

        newRef.then(() => {
            let newScheduleId = newRef.key;

            // store the new schedules also under group node (and current for easier query order by)
            this.groupSchedules.$ref.ref.child(newScheduleId).set({current: this.schedule.current});
            this.alert.hideLoading();
            let toast = this.toastCtrl.create({
                message: 'Schedule was added successfully',
                duration: 2000
            });

            toast.present().then(() => {
                    this.navCtrl.pop();
                }
            );
        }).catch(error => {
            console.log(error.message)
        });
    }


    ionViewWillEnter() {

        this.schedules = this.af.database.list('/schedules');
        this.groupSchedules = this.af.database.list(`/groups/${this.groupId}/schedules`);
        // init date picker with today
        setTimeout(() => {
            let nowDate = moment().toISOString();
            this.date.setValue(nowDate);
            this.minDate = nowDate;
        });
    }


}

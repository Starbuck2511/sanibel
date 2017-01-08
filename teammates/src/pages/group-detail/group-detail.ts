import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {NavController, NavParams, ItemSliding, ActionSheetController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';

import {Group} from '../../models/group';
import {Schedule} from '../../models/schedule';
import {ScheduleAddPage} from "../schedule-add/schedule-add";
import * as moment from 'moment';
import {ScheduleDetailPage} from "../schedule-detail/schedule-detail";

/*
 Generated class for the GroupDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-group-detail',
    templateUrl: 'group-detail.html'
})
export class GroupDetailPage {

    id: string;
    name: string;
    description: string;
    uid: string;
    users: any;
    schedules: Observable<Schedule[]>;

    schedule: Schedule;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private af: AngularFire,
                private actionSheetCtrl: ActionSheetController) {
        this.id = navParams.get('id');
        this.name = navParams.get('name');
        moment.locale('de');
    }

    public goToAdd() {
        this.navCtrl.push(ScheduleAddPage, {id: this.id});
    }

    public goToDetail(id: string) {
        this.navCtrl.push(ScheduleDetailPage, {id: id});
    }

    public delete(slidingItem: ItemSliding, schedule: any) {
        slidingItem.close();
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Schedule',
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.deleteSchedule(schedule);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        });
        actionSheet.present();
    }

    private deleteSchedule(schedule: any) {
        // delete schedule itself
        this.af.database.object(`/groups/${this.id}/schedules/${schedule.id}`).remove();
        this.af.database.object(`/schedules/${schedule.id}`).remove();
    }

    private updateCurrent(id: string, current: any) {
        // get the date for next week
        current.add(7, 'days');
        let string = current.toISOString();
        // because we have a new current date, reset all accepts and declines
        this.af.database.object(`/schedules/${id}`).update({
            current: string,
            feedback: {
                accepts: {},
                declines: {},
            }
        });

        // and update the current under this groups schedules node
        this.af.database.object(`/groups/${this.id}/schedules/${id}`).update({current: string});

    }

    ionViewDidEnter() {
        // get the schedules from groups node
        this.schedules = this.af.database.list(`/groups/${this.id}/schedules`, {
            query: {
                orderByChild: 'current',
            }
        }).map(schedules => {
            schedules.map(schedule => {
                // get schedule details from schedule node
                this.af.database.object(`/schedules/${schedule.$key}`).forEach(scheduleDetail => {
                    schedule.id = scheduleDetail.$key;
                    schedule.name = scheduleDetail.name;
                    schedule.type = scheduleDetail.type;
                    let current = moment(scheduleDetail.current);
                    // if type is weekly and current is in the past we have to update the current schedule date
                    if ('weekly' === scheduleDetail.type && moment() > current) {
                        this.updateCurrent(schedule.id, current);
                    }

                    schedule.current = current.format('LLLL');

                }).catch((error) => {
                    console.log(error.message)
                });
            });
            return schedules;
        });
    }
}

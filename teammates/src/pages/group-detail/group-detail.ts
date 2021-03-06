import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {NavController, NavParams, ItemSliding, ActionSheetController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';
import * as moment from 'moment/min/moment-with-locales';

import {Schedule} from '../../models/schedule';
import {ScheduleAddPage} from '../schedule-add/schedule-add';
import {ScheduleDetailPage} from '../schedule-detail/schedule-detail';
import {ChatDetailPage} from '../chat-detail/chat-detail'
import {Chat} from "../../models/chat";
import {InvitationPage} from "../invitation/invitation";

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
    code: Observable<string>;
    pin: Observable<string>;
    description: string;
    uid: string;
    users: any;
    schedules: Observable<Schedule[]>;
    chats: Observable<Chat[]>;

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

    public goToScheduleDetail(id: string) {
        this.navCtrl.push(ScheduleDetailPage, {id: id});
    }

    public goToChatDetail(id: string, name: string, groupId: string) {
        this.navCtrl.push(ChatDetailPage, {id: id, name: name, groupId: groupId});
    }

    public goToInvitation(id: string, name: string) {

        this.navCtrl.push(InvitationPage, {id: id, name: name, code: this.code, pin: this.pin});
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

    private getSchedules(): void {
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
                    console.debug('GroupDetailPage::getSchedules -> ' + error.message);
                });
            });
            return schedules;
        });
    }

    private getChats(): void {
        // get the chats from groups node
        this.chats = this.af.database.list(`/groups/${this.id}/chats`)
            .map(chats => {
                chats.map(chat => {
                    // get chats details from ç node
                    this.af.database.object(`/chats/${chat.$key}`).forEach(chatDetail => {
                        chat.id = chatDetail.$key;
                        chat.name = chatDetail.name;
                    }).catch((error) => {
                        console.debug('GroupDetailPage::getChats -> ' + error.message);
                    });
                });
                return chats;
            });
    }

    ionViewWillEnter() {
        this.getSchedules();
        this.getChats();

    }

    ionViewDidLoad(){
        this.af.database.object(`/groups/${this.id}/invitation`).$ref.ref.once('value', snap => {
            this.code = snap.val();
        });
        this.af.database.object(`/groups/${this.id}/pin`).$ref.ref.once('value', snap => {
            this.pin = snap.val();
        });
    }
}

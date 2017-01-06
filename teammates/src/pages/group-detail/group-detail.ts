import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ScheduleAddPage} from "../schedule-add/schedule-add";

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


    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.id = navParams.get('id');
        this.name = navParams.get('name');
    }

    public goToAdd() {
        this.navCtrl.push(ScheduleAddPage, {id: this.id});
    }
}

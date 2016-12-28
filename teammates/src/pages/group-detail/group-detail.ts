import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

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

    name: string;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.name = navParams.get('name');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GroupDetailPage');
    }

}

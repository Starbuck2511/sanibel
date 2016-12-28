import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

import {Group} from '../../models/group';
import {GroupDetailPage} from '../group-detail/group-detail';
import {TeammatesGroups} from '../../providers/teammates-groups';


/*
 Generated class for the Groups page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-groups',
    templateUrl: 'groups.html'
})
export class GroupsPage {

    groups: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, private af:AngularFire) {
        this.groups = af.database.list('/groups');
        this.groups.push({'name': 'value', 'description': 'value'});
    }

    goToDetail(name: string) {
        this.navCtrl.push(GroupDetailPage, {name: name});
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GroupsPage');
    }

}

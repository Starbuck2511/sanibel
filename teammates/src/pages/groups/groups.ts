import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Group} from '../../models/group';

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

    groups: Group[];

    constructor(public navCtrl: NavController, public navParams: NavParams, private teammatesGroups: TeammatesGroups) {
        teammatesGroups.load().subscribe(groups => {
            this.groups = groups;
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GroupsPage');
    }

}

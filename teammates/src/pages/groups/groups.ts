import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {NavController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

import {AuthService} from "../../components/auth/auth.service";

import {GroupDetailPage} from '../group-detail/group-detail';
import {GroupAddPage} from "../group-add/group-add";


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

    groups: Observable<any[]>;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private af: AngularFire,
                private auth: AuthService) {


    }

    goToDetail(name: string) {
        this.navCtrl.push(GroupDetailPage, {name: name});
    }

    goToAdd() {
        this.navCtrl.push(GroupAddPage);
    }

    ionViewDidLoad() {
        // get the groups from user node
        this.groups = this.af.database.list(`/users/${this.auth.getUid()}/groups`)
            .map(groups => {
                groups.map(group => {
                    // get group details from group node
                    this.af.database.object(`/groups/${group.$key}`).forEach(groupDetail => {
                        group.name = groupDetail.name;
                    });
                });
                return groups;
            });
    }
}

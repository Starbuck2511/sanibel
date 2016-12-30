import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

import {AuthService} from '../../components/auth/auth.service';
import {GroupDetailPage} from '../group-detail/group-detail';
import {LoginPage} from '../login/login';


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

    constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private af:AngularFire) {

    }

    goToDetail(name: string) {
        this.navCtrl.push(GroupDetailPage, {name: name});
    }

    ionViewWillEnter() {
        if (true !== this.auth.isAuthenticated()) {
            this.navCtrl.setRoot(LoginPage);
        }
    }

}

import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {NavController, NavParams} from 'ionic-angular';

import {AuthPage} from '../../components/auth/auth-page';
import {AuthService} from '../../components/auth/auth.service';
import {GroupDetailPage} from '../group-detail/group-detail';


/*
 Generated class for the Groups page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-groups',
    templateUrl: 'groups.html'
})
export class GroupsPage extends AuthPage {

    groups: FirebaseListObservable<any>;

    constructor(private af:AngularFire, public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {
        super(navCtrl, navParams, auth);
    }

    goToDetail(name: string) {
        this.navCtrl.push(GroupDetailPage, {name: name});
    }

    ionViewDidLoad() {
        this.pageAuth();
    }

}

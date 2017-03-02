import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {AuthService} from '../../components/auth/auth.service';

import {LoginPage} from '../login/login';
import {GroupsPage} from '../groups/groups';
import {AboutPage} from '../about/about';
import {UserSettingsPage} from '../user-settings/user-settings';


/*
 Generated class for the Tabs page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */


@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // set the root pages for each tab
    tab1Root: any = GroupsPage;
    tab2Root: any = UserSettingsPage;
    tab3Root: any = AboutPage;
    tabSelectedIndex: number;

    constructor(public navCtrl: NavController, navParams: NavParams, private auth: AuthService) {
        this.tabSelectedIndex = navParams.data.tabIndex || 0;
    }

    ionViewWillEnter() {
        if (true !== this.auth.isAuthenticated()) {
            this.navCtrl.setRoot(LoginPage);
        }
    }

}

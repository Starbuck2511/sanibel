import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {DisplayNamePage} from '../display-name/display-name';
import {PushService} from '../../components/push/push.service';

/*
 Generated class for the UserSettings page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-user-settings',
    templateUrl: 'user-settings.html'
})
export class UserSettingsPage {

    pushNotificationsStatus: boolean;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public push: PushService,) {


    }

    goToPassword() {

    }

    goToDisplayName(){
        this.navCtrl.push(DisplayNamePage);
    }

    setPushNotifications() {
        this.push.changeSubscriptionStatus(this.pushNotificationsStatus);
        window.localStorage.setItem('pushNotificationsEnabled', this.pushNotificationsStatus.toString());
    }

    ionViewWillEnter() {
        // get the push notification settings
        this.pushNotificationsStatus = !!window.localStorage.getItem('pushNotificationsEnabled');
    }

}

import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TranslateService} from 'ng2-translate';

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

    pushNotificationsStatus: boolean = false;
    lang: string = 'undefined';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public push: PushService,
                private translate: TranslateService
    ) {

    }

    goToPassword() {

    }

    goToDisplayName(){
        this.navCtrl.push(DisplayNamePage);
    }

    setPushNotifications() {
        this.push.changeSubscriptionStatus(this.pushNotificationsStatus);
        console.debug('UserSettingsPage::setPushNotifications -> change push status to ... ' + this.pushNotificationsStatus);
        window.localStorage.setItem('pushNotificationsEnabled', this.pushNotificationsStatus.toString());
    }

    setCurrentUserLang() {
        this.translate.use(this.lang).subscribe(() => {
            console.debug('UserSettingsPage::setCurrentUserLang -> lang changed to ' + this.translate.currentLang);
        });


    }

    ionViewDidEnter() {
        // get the push notification settings
        this.pushNotificationsStatus = JSON.parse(window.localStorage.getItem('pushNotificationsEnabled'));
        console.debug('UserSettingsPage::ionViewDidEnter -> push status is ' + this.pushNotificationsStatus);

        this.lang = this.translate.currentLang;
        console.debug('UserSettingsPage::ionViewDidEnter -> currentLang is ' + this.lang);

    }

}

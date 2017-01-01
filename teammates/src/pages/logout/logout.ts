import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {AuthService} from '../../components/auth/auth.service';

import {TabsPage} from '../tabs/tabs';

/*
 Generated class for the Logout page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-logout',
    templateUrl: 'logout.html'
})
export class LogoutPage {

    constructor(public navCtrl: NavController,
                private auth: AuthService) {
        // construct
    }

    public logout(): void {
        this.auth.logout();
        setTimeout(() => {
            this.navCtrl.setRoot(TabsPage);
        }, 100);
    }

    ionViewWillEnter(){
        this.logout();
    }


}

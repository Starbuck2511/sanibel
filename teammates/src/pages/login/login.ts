import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';


import {AlertService} from '../../components/alert/alert.service';
import {AuthService} from '../../components/auth/auth.service';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    user = {
        email: '',
        password: ''
    };

    constructor(public navCtrl: NavController,
                private alert: AlertService,
                private auth: AuthService,
                private events: Events
                ) {
        // construct
    }

    public login(): void {
        this.alert.showLoading('');

        this.auth.login(this.user).then(authData => {
            let authStatus = this.auth.isAuthenticated();
            this.events.publish('auth:statusChanged', authStatus);
            this.navCtrl.setRoot(TabsPage);
            this.alert.loader.dismiss();
        }).catch(error => {

            this.alert.showError(error.message);
        });
    }

    public registerUser(): void {
        this.navCtrl.setRoot(SignupPage);
    }



}

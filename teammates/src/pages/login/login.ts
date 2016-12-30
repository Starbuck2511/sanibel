import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {AlertService} from '../../components/alert/alert.service';
import {AuthService} from '../../components/auth/auth.service';
import {GroupsPage} from '../groups/groups';
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
                private auth: AuthService
                ) {
        // construct
    }

    public login() {
        this.alert.showLoading('');

        this.auth.login(this.user).then(authData => {
            this.navCtrl.setRoot(GroupsPage);
            this.alert.loader.dismiss();
        }).catch(error => {

            this.alert.showError(error.message);
        });
    }

    public registerUser(){
        this.navCtrl.setRoot(SignupPage);
    }



}

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertService} from '../../components/alert/alert.service';
import {AngularFire} from "angularfire2";

import {LoginPage} from '../login/login';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {

    user = {
        email: '',
        password: ''
    };

    constructor(public navCtrl: NavController,
                private alert: AlertService,
                private af: AngularFire
    ) {
        // construct
    }

    public signUp() {
        this.alert.showLoading('');

        this.af.auth.createUser(this.user).then((authData) => {
            this.alert.showSuccess('Thank you for registering. You can now login to this app with your email and password.');
            this.navCtrl.setRoot(LoginPage);
         }).catch((error) => {
            this.alert.showError(error.message);
         });
    }
}

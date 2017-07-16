import {Component} from '@angular/core';
import {NavController, Events, ToastController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import * as firebase from 'firebase';


import {AlertService} from '../../components/alert/alert.service';
import {AuthService} from '../../components/auth/auth.service';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';
import {DisplayNamePage} from '../display-name/display-name';
import {LoginPage} from "../login/login";

@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

    fbUser: FirebaseListObservable<any>;

    user = {
        email: '',
        password: ''
    };

    constructor(public navCtrl: NavController,
                private alert: AlertService,
                private auth: AuthService,
                private events: Events,
                private af: AngularFire,
                private toastCtrl: ToastController
    ) {

    }

    public forgotPassword(): void {
        this.alert.showLoading('');
        this.auth.sendResetPasswordMail(this.user.email).then(data => {

            this.alert.hideLoading();
            let toast = this.toastCtrl.create({
                message: 'An e-mail with password link has been sent to you. You might check your spam folder.',
                duration: 10000
            });

            toast.present().then(() => {
                    this.navCtrl.setRoot(LoginPage);
                }
            );
            // reset password field
            this.user.email = '';
        }).catch(error => {
            this.alert.showError(error.message);
            // reset password field
            this.user.email = '';
        });
    }

    public goToRegisterUser(): void {
        this.navCtrl.setRoot(SignupPage);
    }


}

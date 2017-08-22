import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';

import {AlertService} from '../../components/alert/alert.service';
import {AuthService} from '../../components/auth/auth.service';
import {SignupPage} from '../signup/signup';
import {LoginPage} from "../login/login";

@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {


    user = {
        email: '',
        password: ''
    };

    constructor(public navCtrl: NavController,
                private alert: AlertService,
                private auth: AuthService,
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

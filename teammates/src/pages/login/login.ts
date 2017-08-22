import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import * as firebase from 'firebase';


import {AlertService} from '../../components/alert/alert.service';
import {AuthService} from '../../components/auth/auth.service';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';
import {DisplayNamePage} from '../display-name/display-name';
import {ForgotPasswordPage} from '../forgot-password/forgot-password';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    fbUser: FirebaseListObservable<any>;

    user = {
        email: '',
        password: ''
    };

    constructor(public navCtrl: NavController,
                private alert: AlertService,
                private auth: AuthService,
                private events: Events,
                private af: AngularFire) {

    }

    public login(): void {
        this.alert.showLoading('');

        this.auth.login(this.user).then(data => {
            // we add the user into an extra node in firebase for our app if user not exists yet
            this.fbUser = this.af.database.list(`/users/${data.uid}`);
            this.fbUser.$ref.once(
                'value', snapshot => {
                    // user does not exist in collection yet
                    if (snapshot.val() === null) {
                        // add the user in firebase collection
                        this.af.database.list('/users/').update(
                            data.uid,
                            {
                                'email': data.auth.email,
                                'created': firebase.database['ServerValue']['TIMESTAMP']
                            });
                    }
                }
            );

            let authStatus = this.auth.isAuthenticated();
            this.events.publish('auth:statusChanged', authStatus);
            // after login check if user has a displayName
            if (null === this.auth.getDisplayName()) {
                this.navCtrl.setRoot(DisplayNamePage).catch(() => {
                    console.log("Didn't set nav root");
                });
            } else {
                // everything is ok
                this.navCtrl.setRoot(TabsPage);
            }
            this.alert.loader.dismiss();
        }).catch(error => {
            this.alert.showError(error.message);
            // reset password field
            this.user.password = '';
        });
    }

    public goToRegisterUser(): void {
        this.navCtrl.setRoot(SignupPage);
    }

    public goToForgotPassword(): void {
        this.navCtrl.setRoot(ForgotPasswordPage);
    }


}

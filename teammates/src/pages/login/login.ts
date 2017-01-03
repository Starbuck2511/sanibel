import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import * as firebase from 'firebase';


import {AlertService} from '../../components/alert/alert.service';
import {AuthService} from '../../components/auth/auth.service';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';

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
                private af: AngularFire,) {
        // construct
    }

    public login(): void {
        this.alert.showLoading('');

        this.auth.login(this.user).then(data => {
            // we add the user into an extra collection in firebase for our app if not exists yet
            this.fbUser = this.af.database.list('/users/' + data.uid);
            this.fbUser.$ref.once(
                'value', snapshot => {
                    // user does not exist in collection yet
                    if (snapshot.val() === null) {
                        // add the user in firebase collection
                        this.af.database.list('/users/').update(
                            data.uid,
                            {
                                'email': data.auth.email,
                                'created': firebase.database.ServerValue.TIMESTAMP
                            });
                    }
                }
            );

            let authStatus = this.auth.isAuthenticated();
            this.events.publish('auth:statusChanged', authStatus);
            this.navCtrl.setRoot(TabsPage);
            this.alert.loader.dismiss();
        }).catch(error => {
            this.alert.showError(error.message);
        });
    }

    public gotToRegisterUser(): void {
        this.navCtrl.setRoot(SignupPage);
    }


}

import {NavController, NavParams} from 'ionic-angular';
import {AuthService} from '../../components/auth/auth.service';
import {LoginPage} from '../../pages/login/login';

export class AuthPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {

    }

    protected pageAuth(): void {
        if (true !== this.auth.isAuthenticated()) {
            this.navCtrl.setRoot(LoginPage);
        }
    }
}

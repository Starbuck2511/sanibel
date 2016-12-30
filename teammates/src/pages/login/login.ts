import {Component} from '@angular/core';
import {NavController, LoadingController, AlertController} from 'ionic-angular';

import {AuthService} from '../../components/auth/auth.service';
import {GroupsPage} from '../groups/groups';

/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    loader: any;

    user = {
        email: '',
        password: ''
    };

    constructor(public navCtrl: NavController,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private auth: AuthService
                ) {
        // construct
    }

    public login() {
        this.showLoading();

        this.auth.login(this.user).then(authData => {
            this.navCtrl.setRoot(GroupsPage);
            this.loader.dismiss();
        }).catch(error => {

            this.showError(error.message);
        });




        // on error
        //
    }

    public registerUser() {
        this.showLoading();

        /*this.af.auth.createUser(this.user).then((authData) => {
            setTimeout(() => {
                this.loader.dismiss();
            });
            let prompt = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Your new account was created!',
                buttons: ['OK']
            });
            prompt.present();
        }).catch((error) => {
            this.showError(error);
        });*/
    }

    showLoading() {
        this.loader = this.loadingCtrl.create({
            content: 'Please wait ...'
        });
        this.loader.present();
    }

    showError(text) {
        setTimeout(() => {
            this.loader.dismiss();
        });

        let prompt = this.alertCtrl.create({
            title: 'Error',
            subTitle: text,
            buttons: ['OK']
        });
        prompt.present();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

}

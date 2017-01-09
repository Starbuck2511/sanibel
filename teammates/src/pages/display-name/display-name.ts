import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, ToastController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';

import {TabsPage} from '../tabs/tabs';

import {AuthService} from '../../components/auth/auth.service';

/*
 Generated class for the DisplayName page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-display-name',
    templateUrl: 'display-name.html'
})
export class DisplayNamePage {

    userForm: FormGroup;

    displayName: AbstractControl;

    constructor(public navCtrl: NavController,
                private toastCtrl: ToastController,
                private af: AngularFire,
                private auth: AuthService,
                private formBuilder: FormBuilder
                ) {

        this.userForm = this.formBuilder.group({
            displayName: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
        });

        this.displayName = this.userForm.controls['displayName'];

    }

    updateData(formData) {


        // update the users auth firebase profile
        this.auth.updateAuthDisplayName(this.displayName.value);
        // update the user node of this app
        this.af.database.object(`/users/${this.auth.getUid()}/displayName`).set(this.displayName.value).then(() => {

            let toast = this.toastCtrl.create({
                message: 'Display name was saved successfully',
                duration: 2000
            });

            toast.present().then(() => {
                this.navCtrl.setRoot(TabsPage);
                }
            );
        }).catch(error => {
            console.log(error.message)
        });
    }

}

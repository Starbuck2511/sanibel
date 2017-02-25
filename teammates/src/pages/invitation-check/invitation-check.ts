import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, ToastController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';

import {Group} from '../../models/group';


import {AuthService} from '../../components/auth/auth.service'
import {TabsPage} from "../tabs/tabs";
import {groupBy} from "rxjs/operator/groupBy";

/*
 Generated class for the InvitationCheck page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-invitation-check',
    templateUrl: 'invitation-check.html'
})
export class InvitationCheckPage {

    inviteForm: FormGroup;

    code: AbstractControl;
    pin: AbstractControl;

    userId: string;

    group: Observable<Group>;
    groupId: string;
    groupPin: number;

    showPin: boolean = false;


    constructor(public navCtrl: NavController,
                private af: AngularFire,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private auth: AuthService) {


        this.inviteForm = this.formBuilder.group({
            code: ['', Validators.required],
            pin: ['', Validators.required],
        });
        this.userId = this.auth.getUid();
        this.code = this.inviteForm.controls['code'];
        this.pin = this.inviteForm.controls['pin'];


    }

    checkCode(formData) {

        let code = this.code.value;
        // check invitation code
        this.af.database.list('groups').$ref.ref.orderByChild('invitation').equalTo(code).once('value', snapshot => {
            snapshot.forEach(data => {
                this.groupId = data.key;
                data.val().forEach(
                    group => {
                        this.groupPin = group.pin;
                    }
                );
                this.showPin = true;
                // needs the forEach method of a snapshot to continue,
                // false to stay in the loop
                // return true to exit the loop early
                return false;
            });
        }).catch(error => {
            console.log(error.message);
        });

    }

    checkPin(formData) {


        if (this.pin.value == this.groupPin) {
            // add group to user data
            this.af.database.object(`/users/${this.userId}/groups`).$ref.ref.child(this.groupId).set(true);

            // add user to this group
            this.af.database.object(`/groups/${this.groupId}/users`).$ref.ref.child(this.userId).set(true).then(
                () => {
                    let toast = this.toastCtrl.create({
                        message: 'Your invitation code was processed successfuly.',
                        duration: 2000
                    });

                    toast.present().then(() => {
                            this.navCtrl.setRoot(TabsPage);
                        }
                    );
                }
            ).catch(error => {
                console.log(error.message);
            });
        }
    }
}

import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, ToastController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';

import {Group} from '../../models/group';


import {AuthService} from '../../components/auth/auth.service'
import {TabsPage} from "../tabs/tabs";

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

    inviteForm:FormGroup;

    code:AbstractControl;

    userId:string;

    group:Observable<Group>;
    groupId:string;


    constructor(public navCtrl:NavController,
                private af:AngularFire,
                private toastCtrl:ToastController,
                private formBuilder:FormBuilder,
                private auth:AuthService) {


        this.inviteForm = this.formBuilder.group({
            code: ['', Validators.required],
        });
        this.userId = this.auth.getUid();
        this.code = this.inviteForm.controls['code'];


    }

    checkInvitationCode(formData) {

        let code = this.code.value;

        this.af.database.list('groups').$ref.ref.orderByChild('invitation').equalTo(code).once('value', snapshot => {
            snapshot.forEach(data => {
                this.groupId = data.key;

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


            });
        });
    }
}

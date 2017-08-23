import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, ToastController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';
import {TranslateService} from 'ng2-translate';
import {Observable} from 'rxjs/Observable';

import {Group} from '../../models/group';


import {AuthService} from '../../components/auth/auth.service'
import {AlertService} from '../../components/alert/alert.service';
import {PushService} from '../../components/push/push.service';
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

    inviteForm: FormGroup;

    code: AbstractControl;
    pin: AbstractControl;

    userId: string;

    group: Observable<Group>;
    groupId: string;
    groupPin: number;
    groupName: string;

    showPin: boolean = false;
    translation: Observable<Object>;

    constructor(public navCtrl: NavController,
                private af: AngularFire,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private auth: AuthService,
                private alert: AlertService,
                private push: PushService,
                private translate: TranslateService
    ) {


        this.inviteForm = this.formBuilder.group({
            code: ['', Validators.required],
            pin: ['', Validators.required],
        });
        this.userId = this.auth.getUid();
        this.code = this.inviteForm.controls['code'];
        this.pin = this.inviteForm.controls['pin'];


    }

    checkCode(formData) {

        this.alert.showLoading('');
        let code = this.code.value;
        // check invitation code
        this.af.database.list('groups').$ref.ref.orderByChild('invitation').equalTo(code).once('value', snapshot => {
            snapshot.forEach(data => {
                this.groupId = data.key;
                this.group = data.val();
                this.groupPin = data.val().pin;
                this.groupName = data.val().name;
                this.alert.showSuccess(this.translation['code_valid']);
                this.showPin = true;

                // needs the forEach method of a snapshot to continue,
                // false to stay in the loop
                // return true to exit the loop early
                return false;
            });

            if(false === this.showPin){
                this.alert.showError(this.translation['code_invalid']);
                this.inviteForm.reset();

            }


        }).catch(error => {
            console.debug('InvitationCheckPage::checkCode -> ' + error.message);

        });

    }

    checkPin(formData) {
        this.alert.showLoading('');

        if (this.pin.value == this.groupPin) {

            // add group to user data
            this.af.database.object(`/users/${this.userId}/groups`).$ref.ref.child(this.groupId).set(true);

            // add user to this group
            this.af.database.object(`/groups/${this.groupId}/users`).$ref.ref.child(this.userId).set(true).then(
                () => {
                    // add onesignal userId to group/pushNotificationsUsers node
                    this.push.oneSignal.getIds().then(
                        ids => {
                            console.debug('InvitationCheckPage::checkPin -> one signal user id ' + ids.userId);

                            this.af.database.object(`/groups/${this.groupId}/pushNotificationUsers`).$ref.ref.child(this.userId).set(ids.userId);
                            this.alert.hideLoading();
                            let toast = this.toastCtrl.create({
                                message: this.translation['action_success'],
                                duration: 2000
                            });

                            toast.present().then(() => {
                                    this.navCtrl.setRoot(TabsPage);
                                }
                            );

                        }
                    );


                }
            ).catch(error => {
                console.debug('InvitationCheckPage::checkPin -> ' + error.message);
            });
        } else {
            this.alert.showError(this.translation['pin_invalid']);
            this.inviteForm.reset();
        }
    }

    ionViewWillEnter() {

        this.translate.getTranslation(this.translate.currentLang).subscribe((res) => {
                this.translation = res.app;
            }
        );
    }
}

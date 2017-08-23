import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {TranslateService} from 'ng2-translate';
import {Observable} from 'rxjs/Observable';

import {AuthService} from '../../components/auth/auth.service';
import {AlertService} from '../../components/alert/alert.service';


/*
 Generated class for the GroupEdit page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-group-edit',
    templateUrl: 'group-edit.html'
})
export class GroupEditPage {


    id: string;

    groupForm: FormGroup;

    name: AbstractControl;
    description: AbstractControl;

    group: FirebaseObjectObservable<any>;

    userId: string;
    chatId: string;
    translation: Observable<Object>;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private af: AngularFire,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private auth: AuthService,
                private alert: AlertService,
                private translate: TranslateService
    ) {


        this.id = navParams.get('id');
        this.userId = this.auth.getUid();

        this.groupForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            description: ['']
        });

        // bind controls to this model
        this.name = this.groupForm.controls['name'];
        this.description = this.groupForm.controls['description'];

        // get data for this group
        this.af.database.object(`/groups/${this.id}`).forEach(group => {
            // pre populate form controls with existing values
            this.groupForm.setValue({name: group.name, description: group.description});
            this.updateGroupChat();
        }).catch((error) => {
            console.debug('GroupEditPage::constructor -> ' + error.message);
        });

    }

    editGroup(formData) {
        this.alert.showLoading('');
        this.af.database.object(`/groups/${this.id}`).update({
            name: this.name.value,
            description: this.description.value
        }).then(() => {
            this.af.database.object(`/chats/${this.chatId}`).update({
                name: this.name.value
            }).then(() => {
                this.alert.hideLoading();
                let toast = this.toastCtrl.create({
                    message: this.translation['action_success'],
                    duration: 2000
                });

                toast.present().then(() => {
                        this.navCtrl.pop();
                    }
                );
            }).catch(
                error => {
                    console.debug('GroupEditPage::editGroup -> ' + error.message);
                }
            );
        }).catch(
            error => {
                console.debug('GroupEditPage::editGroup -> ' + error.message);
            }
        );
    }
    

    updateGroupChat() {
        this.af.database.list(`/groups/${this.id}/chats`).forEach(chats => {
            chats.forEach(chat => {
                // update this group chats
                this.af.database.object(`/chats/${chat.$key}`).update({
                    name: this.name.value,
                });
            });
        });
    }

    ionViewWillEnter() {

        this.translate.getTranslation(this.translate.currentLang).subscribe((res) => {
                this.translation = res.app;
            }
        );
    }
}

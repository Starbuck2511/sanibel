import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, ToastController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {TranslateService} from 'ng2-translate';
import {Observable} from 'rxjs/Observable';

import {Group} from '../../models/group';
import {Chat} from '../../models/chat';

import {AuthService} from '../../components/auth/auth.service';
import {AlertService} from '../../components/alert/alert.service';
import {PushService} from '../../components/push/push.service';

/*
 Generated class for the GroupAdd page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-group-add',
    templateUrl: 'group-add.html'
})
export class GroupAddPage {

    groupForm: FormGroup;

    name: AbstractControl;
    description: AbstractControl;

    groups: FirebaseListObservable<Group[]>;
    userGroups: FirebaseListObservable<any>;
    chats: FirebaseListObservable<Chat[]>;

    userId: string;

    group: Group;
    chat: Chat;

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

        this.group = new Group();
        this.chat = new Chat();

        this.groupForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            description: ['']
        });
        this.userId = this.auth.getUid();
        this.name = this.groupForm.controls['name'];
        this.description = this.groupForm.controls['description'];

    }

    addGroup(formData) {
        this.alert.showLoading('');
        this.group.name = this.name.value;
        this.group.description = this.description.value;

        this.group.uid = this.userId;
        this.group.schedules = null;

        // set an invitation code
        this.group.invitation = (+new Date * Math.random()).toString(36).substring(0,8);
        // set pin
        this.group.pin = Math.floor(1000 + Math.random() * 9000);

        // first create the chat for the group
        this.chat.name = this.name.value;
        let newRef = this.chats.push(this.chat);
        let chatId = newRef.key;

        newRef = this.groups.push(this.group);



        newRef.then(() => {
            let groupId = newRef.key;

            // add current user to group/users node
            newRef.child(`users/${this.userId}`).set(true);

            // add chat to group/chats node
            newRef.child(`chats/${chatId}`).set(true);

            // store the new group also under user node
            this.userGroups.$ref.ref.child(groupId).set(true);

            // add onesignal userId to group/pushNotificationsUsers node
            this.push.oneSignal.getIds().then(
                (ids) => {
                    newRef.child(`pushNotificationUsers/${this.userId}`).set(ids.userId);
                    this.alert.hideLoading();
                    let toast = this.toastCtrl.create({
                        message: this.translation['action_success'],
                        duration: 2000
                    });

                    toast.present().then(() => {
                            this.navCtrl.pop();
                        }
                    );
                }
            );


        }).catch(error => {
            console.debug('GroupAddPage::addGroup -> ' + error.message);
        });
    }

    ionViewWillEnter() {
        this.groups = this.af.database.list('/groups');
        this.userGroups = this.af.database.list(`/users/${this.userId}/groups`);
        this.chats = this.af.database.list('/chats');

        this.translate.getTranslation(this.translate.currentLang).subscribe((res) => {
                this.translation = res.app;
            }
        );

    }
}

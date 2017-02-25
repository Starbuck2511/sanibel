import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, ToastController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

import {Group} from '../../models/group';
import {Chat} from '../../models/chat';

import {AuthService} from '../../components/auth/auth.service';

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
    
    constructor(public navCtrl: NavController,
                private af: AngularFire,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private auth: AuthService) {

        this.group = new Group();
        this.chat = new Chat();

        this.groupForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            description: ['']
        });
        this.userId = this.auth.getUid();
        this.name = this.groupForm.controls['name'];
        this.description = this.groupForm.controls['description'];

    }

    addGroup(formData) {

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

        // add current user to group/users node
        newRef.child(`users/${this.userId}`).set(true);

        // add chat to group/chats node
        newRef.child(`chats/${chatId}`).set(true);


        newRef.then(() => {
            let groupId = newRef.key;

            // store the new group also under user node
            this.userGroups.$ref.ref.child(groupId).set(true);

            let toast = this.toastCtrl.create({
                message: 'Group was added successfully',
                duration: 2000
            });

            toast.present().then(() => {
                    this.navCtrl.pop();
                }
            );
        }).catch(error => {
            console.log(error.message)
        });
    }

    ionViewWillEnter() {
        this.groups = this.af.database.list('/groups');
        this.userGroups = this.af.database.list(`/users/${this.userId}/groups`);
        this.chats = this.af.database.list('/chats');
    }


}

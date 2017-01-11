import {Component, ViewChild} from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, NavParams, Content} from 'ionic-angular';
import {AngularFire} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as firebase from 'firebase';

import {AuthService} from '../../components/auth/auth.service';
import {ChatBubble} from '../../components/chat/chat-bubble';
import {Message} from "../../models/message";

/*
 Generated class for the ChatDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-chat-detail',
    templateUrl: 'chat-detail.html',
    queries: {scrollArea: new ViewChild('content')},
    entryComponents: [ChatBubble]
})
export class ChatDetailPage {
    @ViewChild(Content) scrollableContent: Content;
    id: string;
    name: string;

    messageForm: FormGroup;
    content: AbstractControl;

    message: Message;
    messages: Observable<Message[]>;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private af: AngularFire,
                private auth: AuthService,
                private formBuilder: FormBuilder) {
        this.id = navParams.get('id');
        this.name = navParams.get('name');
        this.message = new Message();

        this.messageForm = this.formBuilder.group({
            content: ['', Validators.required]
        });

        this.content = this.messageForm.controls['content'];
    }

    send() {
        this.message.content = this.content.value;
        this.message.uid = this.auth.getUid();
        this.message.name = this.auth.getDisplayName();
        this.message.timestamp = firebase.database.ServerValue.TIMESTAMP;

        this.af.database.list(`/messages/${this.id}`).push(this.message).then(
            () => {
                this.messageForm.reset();
            }
        ).catch(error => {
            console.log(error.message)
        });

    }

    ionViewWillEnter() {

        //@todo limit it to the last 20 messages then implement inifinty scroll
        this.messages = this.af.database.list(`/messages/${this.id}`).map(
            messages => {
                this.scrollableContent.scrollToBottom(300).then(
                    () => {}
                );
                return messages;
                
            }
        );

    }

    ionViewDidEnter(){

    }
}

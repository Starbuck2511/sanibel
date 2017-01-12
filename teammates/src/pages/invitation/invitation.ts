import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
 Generated class for the Invitation page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-invitation',
    templateUrl: 'invitation.html'
})
export class InvitationPage {

    id: string;
    name: string;
    code: string;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.id = navParams.get('id');
        this.name = navParams.get('name');
        this.code = navParams.get('code');
    }

    public openMail() {
        console.log('open mail ...');
    }

    public copyToClipboard() {
        console.log('copy to clipboard ...');
    }


}

import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {Clipboard, SocialSharing} from 'ionic-native';


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

    constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) {
        this.id = navParams.get('id');
        this.name = navParams.get('name');
        this.code = navParams.get('code');
        console.log(this.code);
    }

    public openMail() {

        let body = `URL: http://localhost:8100
                    Invitation Code: ${this.code}
`;
        let subject = `Invitation from ${this.name}`;

        SocialSharing.canShareViaEmail().then(() => {
            // Sharing via email is possible
            // Share via email
            SocialSharing.shareViaEmail(`${body}`, `${subject}`, []).then(() => {
                // Success!
            }).catch(error => {
                console.log(error.message);
            });
        }).catch(() => {
            // Sharing via email is not possible
            console.log('alternative sharing via email ...');

        });
    }

    public copyToClipboard() {

        let text = `URL: http://localhost:8100
                    Invitation Code: ${this.code}
`;

        Clipboard.copy(text).then(() => {
                let toast = this.toastCtrl.create({
                    message: 'Invitation copied to clipboard',
                    duration: 2000
                });

                toast.present().then(() => {

                    }
                );
            }
        ).catch(
            error => {
                console.log(error.message);
            }
        );
    }


}

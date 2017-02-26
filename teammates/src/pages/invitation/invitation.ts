import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, Platform} from 'ionic-angular';
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
    pin: string;
    body: string;
    subject: string;

    platform: string;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private toastCtrl: ToastController,
                private plt: Platform) {
        this.id = navParams.get('id');
        this.name = navParams.get('name');
        this.code = navParams.get('code');
        this.pin = navParams.get('pin');

        this.body = `This is a Sunbelt invitation for joining the group "${this.name}". 
Just get the free Sunbelt App from Google Play or the Apple Store and enter the following code and PIN. %0D%0A
Invitation Code: ${this.code} %0D%0A
PIN: ${this.pin} %0D%0A %0D%0A
Best regards %0D%0A
Your Sunbelt Team %0D%0A
`;
        this.subject = `Invitation from ${this.name}`;

        if (this.plt.is('core') || this.plt.is('mobileweb')) {
            this.platform = 'browser';
        } else {
            this.platform = 'device';
        }
    }

    public openMail() {
        SocialSharing.canShareViaEmail().then(() => {
            // Sharing via email is possible
            // Share via email
            SocialSharing.shareViaEmail(`${this.body}`, `${this.subject}`, []).then(() => {
                // Success!
            }).catch(error => {
                console.log(error.message);
            });
        }).catch(error => {
            // Sharing via email is not possible
            console.log(error.message);

        });


    }

    public openMailHref(){
        window.location.href=`mailto:%20?subject=${this.subject}&body=${this.body}`;
    }

    public copyToClipboard() {
        // use cordova plugin
        Clipboard.copy(this.body).then(() => {
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

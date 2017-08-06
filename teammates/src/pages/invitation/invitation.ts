import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, Platform} from 'ionic-angular';
import {Clipboard, SocialSharing} from 'ionic-native';
import {TranslateService} from 'ng2-translate';
import {Observable} from 'rxjs/Observable';


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
    translation: Observable<Object>;

    canShareViaWhatsApp: boolean = false;
    canShareViaEmail: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private toastCtrl: ToastController,
                private plt: Platform,
                private translate: TranslateService
    ) {

        this.id = navParams.get('id');
        this.name = navParams.get('name');
        this.code = navParams.get('code');
        this.pin = navParams.get('pin');

        if (this.plt.is('core') || this.plt.is('mobileweb')) {
            this.platform = 'browser';
        } else {
            this.platform = 'device';
        }

        SocialSharing.canShareVia('whatsapp').then(() => {
            this.canShareViaWhatsApp = true;
        }).catch(error => {
            // Sharing via whatsapp is not possible
            console.log(error.message);

        });
    }


    public openMailHref(){
        window.location.href=`mailto:%20?subject=${this.subject}&body=${this.body}`;
    }

    public shareSheet() {
        // share(message, subject, file, url)
        SocialSharing.share(`${this.body}`, `${this.subject}`, '', null).then(
            () => {
                // Success!
            }
        ).catch(error => {
                console.log(error.message);
            }
        );
    }

    public shareViaWhatsApp(){
        SocialSharing.canShareVia('whatsapp').then(() => {
            // Sharing via whatsapp is possible
            SocialSharing.shareViaWhatsApp(`${this.body}`).then(() => {
                // Success!
            }).catch(error => {
                console.log(error.message);
            });
        }).catch(error => {
            // Sharing via whatsapp is not possible
            console.log(error.message);

        });
    }

    public copyToClipboard() {
        // use cordova plugin
        Clipboard.copy(this.body).then(() => {
                let toast = this.toastCtrl.create({
                    message: this.translation['action_success'],
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

    ionViewWillEnter() {

        this.translate.getTranslation(this.translate.currentLang).subscribe((res) => {
                this.translation = res.app;
            }
        );

        let param = {
            'name': this.name,
            'code': this.code,
            'pin': this.pin
        };

        this.translate.get('app.invitation_body', param).subscribe((res) => {
                this.body = res;
            }
        );

        this.translate.get('app.invitation_subject', param).subscribe((res) => {
                this.subject = res;
            }
        );
    }
}

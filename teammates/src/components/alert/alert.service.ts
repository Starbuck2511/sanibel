import {Injectable} from '@angular/core';
import {LoadingController, AlertController} from 'ionic-angular';


@Injectable()
export class AlertService {

    public loader: any;

    constructor(private loadingCtrl: LoadingController,
                private alertCtrl: AlertController
    ) {
        // construct
    }

    showLoading(text: string) {
        this.loader = this.loadingCtrl.create({
            content: text
        });
        this.loader.present();
    }

    hideLoading() {
        setTimeout(() => {
            this.loader.dismiss();
        });

    }

    showError(text: string) {
        this.hideLoading();
        let prompt = this.alertCtrl.create({
            title: 'Error',
            subTitle: text,
            buttons: ['OK']
        });
        prompt.present();
    }

    showSuccess(text: string){
        this.hideLoading();
        let prompt = this.alertCtrl.create({
            title: 'Success',
            subTitle: text,
            buttons: ['OK']
        });
        prompt.present();
    }
}
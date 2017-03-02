import {Injectable} from '@angular/core';
import {AppConfig} from '../../app/app.config';



@Injectable()
export class PushService {


    public oneSignal: any;

    constructor(
    ) {
        // construct
    }

    init(oneSignal: any) {
        // to debug issues
        // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
        this.oneSignal = oneSignal;

        let iosSettings = {};
        iosSettings["kOSSettingsKeyAutoPrompt"] = false;

        let notificationOpenedCallback = function (jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        this.oneSignal.startInit(AppConfig.ONE_SIGNAL_CONFIG.appId, AppConfig.FIREBASE_CONFIG.messagingSenderId)
            .handleNotificationOpened(notificationOpenedCallback)
            .iOSSettings(iosSettings)
            .endInit();
    }
}
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
        //window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
        this.oneSignal = oneSignal;
        //this.oneSignal.setLogLevel({logLevel: 5, visualLevel: 5});

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

    changeSubscriptionStatus($status: boolean){
        this.oneSignal.setSubscription($status);
    }

    sendToGroup($message, $users){
        let notificationObj = { contents: {en: $message}, include_player_ids: $users};
        console.dir(notificationObj);
        this.oneSignal.postNotification(notificationObj).then(
            response => {
                console.log('Notification Post Success');
                console.dir(response);
            }
        ).catch(
            response => {
                console.log('Notification Post Failed');
                console.dir(response);
            }
        );


    }
}
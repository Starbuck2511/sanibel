import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {AngularFireModule} from 'angularfire2';
import {AppConfig} from './app.config';
import {MyApp} from './app.component';

import {AlertService} from '../components/alert/alert.service';
import {AuthService} from '../components/auth/auth.service';

import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {GroupsPage} from '../pages/groups/groups';
import {GroupAddPage} from '../pages/group-add/group-add';
import {GroupDetailPage} from '../pages/group-detail/group-detail';
import {AboutPage} from "../pages/about/about";
import {TabsPage} from "../pages/tabs/tabs";


@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        SignupPage,
        GroupsPage,
        GroupDetailPage,
        GroupAddPage,
        AboutPage,
        TabsPage
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(AppConfig.FIREBASE_CONFIG)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        SignupPage,
        GroupsPage,
        GroupDetailPage,
        GroupAddPage,
        AboutPage,
        TabsPage
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        AlertService,
        AuthService

    ]
})
export class AppModule {
}

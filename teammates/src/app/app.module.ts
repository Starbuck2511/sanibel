import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {FIREBASE_PROVIDERS, defaultFirebase} from 'angularfire2';
import {MyApp} from './app.component';

import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {GroupsPage} from '../pages/groups/groups';
import {GroupDetailPage} from '../pages/group-detail/group-detail';
import {TeammatesGroups} from "../providers/teammates-groups";

@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        SignupPage,
        GroupsPage,
        GroupDetailPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        SignupPage,
        GroupsPage,
        GroupDetailPage
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        TeammatesGroups,
        FIREBASE_PROVIDERS,
        defaultFirebase({
            apiKey: "AIzaSyBOGOQUrI3iLu8yKzcOCqQGPhk0St5GnY0",
            authDomain: "teammates-73d62.firebaseapp.com",
            databaseURL: "https://teammates-73d62.firebaseio.com",
            storageBucket: "teammates-73d62.appspot.com",
            //messagingSenderId: "739745043793"
        })
    ]
})
export class AppModule {
}

import {NgModule, ErrorHandler, enableProdMode} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {AngularFireModule} from 'angularfire2';
import {TranslateModule, TranslateStaticLoader, TranslateLoader} from 'ng2-translate';
import {HttpModule, Http} from '@angular/http';
import {AppConfig} from './app.config';
import {MyApp} from './app.component';

import {AlertService} from '../components/alert/alert.service';
import {AuthService} from '../components/auth/auth.service';
import {PushService} from '../components/push/push.service';
import {ChatBubble} from '../components/chat/chat-bubble';

import {SentryErrorHandler} from '../services/sentry-error-handler';

import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {GroupsPage} from '../pages/groups/groups';
import {GroupAddPage} from '../pages/group-add/group-add';
import {GroupEditPage} from '../pages/group-edit/group-edit';
import {GroupDetailPage} from '../pages/group-detail/group-detail';
import {AboutPage} from '../pages/about/about';
import {TabsPage} from '../pages/tabs/tabs';
import {ScheduleAddPage} from '../pages/schedule-add/schedule-add';
import {ScheduleDetailPage} from '../pages/schedule-detail/schedule-detail';
import {DisplayNamePage} from '../pages/display-name/display-name';
import {ChatDetailPage} from '../pages/chat-detail/chat-detail';
import {InvitationPage} from '../pages/invitation/invitation';
import {InvitationCheckPage} from '../pages/invitation-check/invitation-check';
import {UserSettingsPage} from '../pages/user-settings/user-settings';
import {ForgotPasswordPage} from '../pages/forgot-password/forgot-password';


enableProdMode();

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}



@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        SignupPage,
        DisplayNamePage,
        GroupsPage,
        GroupDetailPage,
        GroupAddPage,
        GroupEditPage,
        ScheduleAddPage,
        ScheduleDetailPage,
        ChatDetailPage,
        AboutPage,
        TabsPage,
        ChatBubble,
        InvitationPage,
        InvitationCheckPage,
        UserSettingsPage,
        ForgotPasswordPage
    ],
    imports: [
        IonicModule.forRoot(MyApp, {backButtonText: ''}, {}),
        AngularFireModule.initializeApp(AppConfig.FIREBASE_CONFIG),
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        LoginPage,
        SignupPage,
        DisplayNamePage,
        GroupsPage,
        GroupDetailPage,
        GroupAddPage,
        GroupEditPage,
        ScheduleAddPage,
        ScheduleDetailPage,
        ChatDetailPage,
        AboutPage,
        TabsPage,
        InvitationPage,
        InvitationCheckPage,
        UserSettingsPage,
        ForgotPasswordPage
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: SentryErrorHandler
        },
        AlertService,
        AuthService,
        PushService
    ]
})
export class AppModule {
}

import {Component, ViewChild} from '@angular/core';
import {Platform, MenuController, Nav, Events, ToastController} from 'ionic-angular';
import {StatusBar, Splashscreen, OneSignal, Network} from 'ionic-native';
import {TranslateService} from 'ng2-translate';

import {AuthService} from '../components/auth/auth.service';
import {PushService} from '../components/push/push.service';


import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';
import {InvitationCheckPage} from '../pages/invitation-check/invitation-check';
import {UserSettingsPage} from '../pages/user-settings/user-settings';

export interface PageInterface {
    title: string;
    component: any;
    index?: number;
    logout?: boolean;
    icon?: string;
}


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    pages: PageInterface[];
    pagesPublic: PageInterface[];
    pagesAuth: PageInterface[];

    isPrivate: boolean = false;


    constructor(public platform: Platform,
                public menu: MenuController,
                private auth: AuthService,
                private push: PushService,
                private events: Events,
                private translate: TranslateService,
                private toastCtrl: ToastController
    ) {
        this.initializeApp();

        this.pagesPublic = [
            {title: 'app.login', component: LoginPage, icon: 'log-in'},
            {title: 'app.sign_up', component: SignupPage, icon: 'create'}
        ];

        this.pagesAuth = [
            {title: 'app.groups', component: TabsPage, index: 0, icon: 'contacts'},
            {title: 'app.invites', component: InvitationCheckPage, icon: 'paper-plane'},
            {title: 'app.about', component: TabsPage, index: 1, icon: 'information-circle'},
            {title: 'app.settings', component: UserSettingsPage, icon: 'settings'},
            {title: 'app.logout', component: LoginPage, logout: true, icon: 'power'}
        ];

        this.pages = this.pagesPublic;
        this.rootPage = LoginPage;

        this.events.subscribe('auth:statusChanged', (authStatus) => {
            if (true === authStatus) {
                this.isPrivate = true;
                this.pages = this.pagesAuth;

            } else {
                this.isPrivate = false;
                this.pages = this.pagesPublic;
            }
        });

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // okay, so the platform is ready and our plugins are available
            // here you can do any higher level native things you might need
            StatusBar.styleDefault();
            Splashscreen.hide();

            // translations
            this.translate.setDefaultLang('de');
            this.translate.use('de');

            // enable push notifications
            if(!this.platform.is('core') && !this.platform.is('mobileweb')){
                this.push.init(OneSignal);
            }

            Network.onDisconnect().subscribe(() => {
                let toast = this.toastCtrl.create({
                    message: 'Offline',
                    showCloseButton: true,
                    closeButtonText: 'OK',
                    cssClass: 'danger'
                });
                toast.present().then(
                    () => {}
                );
            });

        });
    }

    openPage(page: PageInterface) {
        if (true === page.logout) {
            // on logout -> first redirect to the login page (because it's a public page)
            this.nav.setRoot(page.component).then(() => {
                this.menu.close();
                // give the menu a little bit time to close
                setTimeout(() => {
                    this.auth.logout();
                    let authStatus = this.auth.isAuthenticated();
                    this.events.publish('auth:statusChanged', authStatus);
                }, 1000);

            });
            return;
        }


        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component, {tabIndex: page.index}).catch(() => {
                console.log("Didn't set nav root");
            });

        } else {
            this.nav.setRoot(page.component).catch(() => {
                console.log("Didn't set nav root");
            });
        }
        // close the menu when clicking a link from the menu
        this.menu.close();
    }


}


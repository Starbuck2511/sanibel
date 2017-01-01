import {Component, ViewChild} from '@angular/core';
import {Platform, MenuController, Nav, Events} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {AuthService} from '../components/auth/auth.service';

import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';


export interface PageInterface {
    title: string;
    component: any;
    index?: number;
    logout?: boolean;
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


    constructor(public platform: Platform,
                public menu: MenuController,
                private auth: AuthService,
                private events: Events
    ) {
        this.initializeApp();

        this.pagesPublic = [
            {title: 'Login', component: LoginPage},
            {title: 'Sign up', component: SignupPage}
        ];

        this.pagesAuth = [
            {title: 'Groups', component: TabsPage, index: 0},
            {title: 'About', component: TabsPage, index: 1},
            {title: 'Logout', component: LoginPage, logout: true}
        ];

        this.pages = this.pagesPublic;
        this.rootPage = LoginPage;

        this.events.subscribe('auth:statusChanged', (authStatus) => {
            if (true === authStatus) {
               this.pages = this.pagesAuth;
            } else {
                this.pages = this.pagesPublic;
            }
        });


    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }

    openPage(page: PageInterface) {

        if(true === page.logout){
            this.auth.logout();
            let authStatus = this.auth.isAuthenticated();
            this.events.publish('auth:statusChanged', authStatus);
        }

        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component, {tabIndex: page.index});

        } else {
            this.nav.setRoot(page.component).catch(() => {
                console.log("Didn't set nav root");
            });
        }
        // close the menu when clicking a link from the menu
        this.menu.close();
    }
}


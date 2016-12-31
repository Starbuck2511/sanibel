import {Component, ViewChild} from '@angular/core';
import {Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';

export interface PageInterface {
    title: string;
    component: any;
    index?: number;
}


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    pages: PageInterface[];

    constructor(public platform: Platform, public menu: MenuController) {
        this.initializeApp();
        this.rootPage = TabsPage;
        // set our app's pages
        this.pages = [
            {title: 'Groups', component: TabsPage, index: 0},
            {title: 'Login', component: LoginPage},
            {title: 'Sign up', component: SignupPage},
            {title: 'About', component: TabsPage, index: 1},

        ];
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
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component, { tabIndex: page.index });

        } else {
            this.nav.setRoot(page.component).catch(() => {
                console.log("Didn't set nav root");
            });
        }
        // close the menu when clicking a link from the menu
        this.menu.close();
    }
}


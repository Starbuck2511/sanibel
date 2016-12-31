import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { GroupsPage } from '../groups/groups';
import {AboutPage} from "../about/about";



/*
  Generated class for the Tabs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = GroupsPage;
  tab2Root: any = AboutPage;
  tabSelectedIndex: number;

  constructor(navParams: NavParams) {
    this.tabSelectedIndex = navParams.data.tabIndex || 0;
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the ChatDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat-detail',
  templateUrl: 'chat-detail.html'
})
export class ChatDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDetailPage');
  }

}

import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

/*
 Generated class for the GroupAdd page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-group-add',
    templateUrl: 'group-add.html'
})
export class GroupAddPage {

    groups: FirebaseListObservable<any>;

    group = {
        name: '',
        description: ''
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private af: AngularFire,
                private toastCtrl: ToastController
    ) {
        this.groups = this.af.database.list('/groups');
    }

    addGroup(group){
        this.groups.push(group).then(() => {
            let toast = this.toastCtrl.create({
                message: 'Group was added successfully',
                duration: 3000
            });
            toast.present().then(() => {
                this.navCtrl.pop();
                }

            );
        });
    }

}

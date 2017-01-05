import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {NavController, NavParams, ItemSliding, ActionSheetController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';

import {AuthService} from "../../components/auth/auth.service";

import {GroupDetailPage} from '../group-detail/group-detail';
import {GroupAddPage} from "../group-add/group-add";


/*
 Generated class for the Groups page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-groups',
    templateUrl: 'groups.html'
})
export class GroupsPage {

    groups: Observable<any[]>;

    group: {
        id: string,
        name: string,
    };


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private af: AngularFire,
                private auth: AuthService,
                private actionSheetCtrl: ActionSheetController
    ) {

    }

    public goToDetail(name: string) {
        this.navCtrl.push(GroupDetailPage, {name: name});
    }

    public goToAdd() {
        this.navCtrl.push(GroupAddPage);
    }

    public goToEdit(slidingItem: ItemSliding, group: any) {
        console.log('go to edit group');
        slidingItem.close();
    }

    public delete(slidingItem: ItemSliding, group: any) {
        slidingItem.close();
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Group',
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.deleteGroup(group);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        });
        actionSheet.present();
    }

    private deleteGroup(group: any){
        console.log('deleting group ' + group.id);
        // get all the users of this group node
        this.af.database.list(`/groups/${group.id}/users`).forEach(users => {
            users.forEach(user => {
                // delete this group id from the user's groups node
                this.af.database.object(`/users/${user.$key}/groups/${group.id}`).remove();
                this.af.database.object(`/groups/${group.id}`).remove();
            });
        }).then( () => {
                // finally delete the group node itself
                console.log('group deleted');
            }
        );
        // delete schedules and chats
    }


    ionViewDidEnter() {
        // get the groups from user node
        this.groups = this.af.database.list(`/users/${this.auth.getUid()}/groups`)
            .map(groups => {
                groups.map(group => {
                    // get group details from group node
                    this.af.database.object(`/groups/${group.$key}`).forEach(groupDetail => {
                        group.id = groupDetail.$key;
                        group.name = groupDetail.name;
                    }).catch((error) => {console.log(error.message)});
                });
                return groups;
            });
    }

}

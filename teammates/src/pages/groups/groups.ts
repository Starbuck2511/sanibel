import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {NavController, NavParams, ItemSliding, ActionSheetController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';

import {AuthService} from '../../components/auth/auth.service';
import {PushService} from '../../components/push/push.service';
import {AlertService} from '../../components/alert/alert.service';
import {Group} from '../../models/group';

import {GroupEditPage} from '../group-edit/group-edit';
import {GroupAddPage} from '../group-add/group-add';
import {GroupDetailPage} from '../group-detail/group-detail';


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

    groups: Observable<Group[]>;

    group: Group;

    userId: string;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private af: AngularFire,
                private auth: AuthService,
                private push: PushService,
                private actionSheetCtrl: ActionSheetController,
                private alert: AlertService) {
        this.userId = this.auth.getUid();
    }

    public goToDetail(id: string, name: string) {
        this.navCtrl.push(GroupDetailPage, {id: id, name: name});
    }

    public goToAdd() {
        this.navCtrl.push(GroupAddPage);
    }

    public goToEdit(slidingItem: ItemSliding, {id: id}) {
        this.navCtrl.push(GroupEditPage, {id: id});
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

    private deleteGroup(group: any) {

        // get all the users of this group node
        this.af.database.list(`/groups/${group.id}/users`).forEach(users => {
            users.forEach(user => {
                // delete this group id from the user's groups node
                console.log('GroupsPage::deleteGroup delete groups from users group node ... ' + group.id);
                this.af.database.object(`/users/${user.$key}/groups/${group.id}`).remove();
            });
        }).then(() => {
                // delete schedule nodes
                this.af.database.list(`/groups/${group.id}/schedules`).forEach(schedules => {
                    schedules.forEach(schedule => {
                        console.log('GroupsPage::deleteGroup delete schedules ' + schedule.$key);
                        this.af.database.object(`/schedules/${schedule.$key}`).remove();
                    });
                }).then(() => {
                        // delete chat nodes and messages of chat
                        this.af.database.list(`/groups/${group.id}/chats`).forEach(chats => {
                            chats.forEach(chat => {
                                console.log('GroupsPage::deleteGroup delete messages ' + chat.$key);
                                console.log('GroupsPage::deleteGroup delete chats ' + chat.$key);
                                this.af.database.object(`/messages/${chat.$key}`).remove();
                                this.af.database.object(`/chats/${chat.$key}`).remove();
                            });
                        }).then(() => {
                                // finally delete the group node itself
                                console.log('GroupsPage::deleteGroup delete groups ' + group.id);
                                this.af.database.object(`/groups/${group.id}`).remove();
                            }
                        );
                    }
                );
            }
        );
    }

    promptForPermission() {
        this.push.oneSignal.registerForPushNotifications();
    }

    ionViewDidLoad() {
        // ask the user one time for permission on push notifications
        // its a good practice to do this on your own, because if the user
        // rejects the system message, he has to go through multi steps in the
        // device settings to enable push notifications for this app
        let pushNotificationsRequested = window.localStorage.getItem('pushNotificationsRequest');
        if (!pushNotificationsRequested) {
            let actionSheet = this.actionSheetCtrl.create({
                title: 'Allow push notifications? It is recommended to choose OK. You can easily turn them off in your user settings',
                buttons: [
                    {
                        text: 'OK',
                        icon: 'checkmark',
                        handler: () => {
                            this.promptForPermission();
                            window.localStorage.setItem('pushNotificationsRequest', 'true');
                            window.localStorage.setItem('pushNotificationsEnabled', 'true');
                        }
                    },
                    {
                        text: 'No, thank you.',
                        icon: 'close',
                        handler: () => {
                            window.localStorage.setItem('pushNotificationsRequest', 'true');
                            window.localStorage.setItem('pushNotificationsEnabled', 'false');
                        }
                    }
                ]
            });
            actionSheet.present();
        }

    }


    ionViewWillEnter() {
        this.alert.showLoading('');
        // get the groups from user node
        this.groups = this.af.database.list(`/users/${this.auth.getUid()}/groups`)
            .map(groups => {
                groups.map(group => {
                    // get group details from group node
                    this.af.database.object(`/groups/${group.$key}`).forEach(groupDetail => {
                        group.id = groupDetail.$key;
                        group.name = groupDetail.name;
                        group.uid = groupDetail.uid;
                    }).catch((error) => {
                        console.log(error.message)
                    });
                });
                this.alert.loader.dismiss();
                return groups;
            });
    }
}

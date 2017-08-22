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
        this.af.database.list(`/groups/${group.id}/users`).$ref.ref.once('value').then(
            snapshotUsers => {
                let users = snapshotUsers.val();
                Object.keys(users).forEach(userId => {
                    // delete this group id from the user's groups node
                    this.af.database.object(`/users/${userId}/groups/${group.id}`).remove();
                    console.log('GroupsPage::deleteGroup delete groups from users group node ... ' + group.id);
                });

                // delete schedule nodes
                this.af.database.list(`/groups/${group.id}/schedules`).$ref.ref.once('value').then(
                    snapshotSchedules => {
                        let schedules = snapshotSchedules.val();
                        if ('undefined' !== schedules && null !== schedules) {
                            Object.keys(schedules).forEach(scheduleId => {
                                this.af.database.object(`/schedules/${scheduleId}`).remove();
                                console.log('GroupsPage::deleteGroup delete schedules ' + scheduleId);
                            });
                        }

                        // delete chat nodes and messages of chat
                        this.af.database.list(`/groups/${group.id}/chats`).$ref.ref.once('value').then(
                            snapshotChats => {
                                let chats = snapshotChats.val();
                                Object.keys(chats).forEach(chatId => {
                                    this.af.database.object(`/messages/${chatId}`).remove();
                                    this.af.database.object(`/chats/${chatId}`).remove();
                                    console.log('GroupsPage::deleteGroup delete messages ' + chatId);
                                    console.log('GroupsPage::deleteGroup delete chats ' + chatId);
                                });

                                // finally delete the group node itself
                                this.af.database.object(`/groups/${group.id}`).remove();
                                console.log('GroupsPage::deleteGroup delete groups ' + group.id);
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
        let pushNotificationsUpdated = window.localStorage.getItem('pushNotificationsUpdate');
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

        if (pushNotificationsRequested && !pushNotificationsUpdated) {
            // update once all oneSignalIds of the user (oneSignalId changes if user has reinstalled the app)
            this.push.oneSignal.getIds().then(
                ids => {
                    console.log('update one signal user id ' + ids.userId);
                    this.af.database.list(`/users/${this.auth.getUid()}/groups`).$ref.ref.once('value').then(
                        snapshot => {
                            let groups = snapshot.val();
                            console.log('list of users groups ...');
                            console.dir(groups);
                            if ('undefined' !== groups && null !== groups) {
                                Object.keys(groups).forEach(groupId => {
                                    this.af.database.object(`/groups/${groupId}/pushNotificationUsers/${this.auth.getUid()}`).set(ids.userId);
                                    console.log('updated group with id ' + groupId + ' for push notification user id ');
                                })
                            }

                        }
                    );

                }
            );
            window.localStorage.setItem('pushNotificationsUpdate', 'true');
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

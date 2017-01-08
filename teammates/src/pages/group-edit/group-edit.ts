import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

import {AuthService} from '../../components/auth/auth.service';


/*
 Generated class for the GroupEdit page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-group-edit',
    templateUrl: 'group-edit.html'
})
export class GroupEditPage {


    id: string;

    groupForm: FormGroup;

    name: AbstractControl;
    description: AbstractControl;

    group: FirebaseObjectObservable<any>;

    userId: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private af: AngularFire,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private auth: AuthService) {


        this.id = navParams.get('id');
        this.userId = this.auth.getUid();

        this.groupForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            description: ['']
        });

        // bind controls to this model
        this.name = this.groupForm.controls['name'];
        this.description = this.groupForm.controls['description'];

        // get data for this group
        this.af.database.object(`/groups/${this.id}`).forEach(group => {
            // pre populate form controls with existing values
            this.groupForm.setValue({name: group.name, description: group.description});

        }).catch((error) => {
            console.log(error.message)
        });

    }

    editGroup(formData) {

        this.af.database.object(`/groups/${this.id}`).update({
            name: this.name.value,
            description: this.description.value
        }).then(() => {
                let toast = this.toastCtrl.create({
                    message: 'Group edited successfully',
                    duration: 2000
                });

                toast.present().then(() => {
                        this.navCtrl.pop();
                    }
                );
            }
        ).catch(
            error => {
                console.log(error.message)
            }
        );
    }
}

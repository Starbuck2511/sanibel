import {Component} from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {NavController, ToastController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {AuthService} from "../../components/auth/auth.service";

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

    groupForm: FormGroup;

    name: AbstractControl;
    description: AbstractControl;

    groups: FirebaseListObservable<any>;

    group = {
        name: '',
        description: '',
        uid: ''
    };

    constructor(public navCtrl: NavController,
                private af: AngularFire,
                private toastCtrl: ToastController,
                private formBuilder: FormBuilder,
                private auth: AuthService) {

        this.groupForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            description: ['']
        });

        this.name = this.groupForm.controls['name'];
        this.description = this.groupForm.controls['description'];
        this.groups = this.af.database.list('/groups');
    }

    addGroup(formData) {
        this.group.name = this.name.value;
        this.group.description = this.description.value;
        this.group.uid = this.auth.getUid();

        this.groups.push(this.group).then(() => {
            let toast = this.toastCtrl.create({
                message: 'Group was added successfully',
                duration: 2000
            });
            toast.present().then(() => {
                    this.navCtrl.pop();
                }
            );
        }).catch(error => {
            console.log(error.message)
        });
    }


}

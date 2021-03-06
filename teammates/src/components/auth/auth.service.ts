import {Injectable} from '@angular/core';
import {AngularFire, FirebaseAuth, FirebaseAuthState, AuthProviders, AuthMethods} from 'angularfire2';
import * as firebase from 'firebase';


@Injectable()
export class AuthService {

    private fbAuthState: FirebaseAuthState = null;
    private auth: boolean = false;
    private uid: string = null;
    private email: string = null;
    private displayName: string = null;


    constructor(private af: AngularFire,
                private fbAuth: FirebaseAuth) {
        this.fbAuth.subscribe((state: FirebaseAuthState) => {
            this.fbAuthState = state;
        });
    }


    public login(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this.af.auth.login(user, {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            }).then((authData) => {
                this.auth = true;
                this.uid = authData.uid;
                this.email = authData.auth.email;
                this.displayName = authData.auth.displayName;

                resolve(authData);

            }).catch((error) => {
                reject(error);
            });
        });
    }

    public logout(): void {
        this.af.auth.logout();
        this.auth = false;
        this.uid = null;
    }

    public isAuthenticated(): boolean {
        return this.auth;
    }

    public getUid(): string {
        return this.uid;
    }

    public getEmail(): string {
        return this.email;
    }

    public getDisplayName(): string {
        return this.displayName;
    }

    public updateAuthDisplayName(name) {
        // save the given display name in the auth users profile of firebase
        this.fbAuthState.auth.updateProfile({displayName: name, photoURL: ''}).then(
            () => {
                this.displayName = name
            }
        ).catch(error => {
            console.debug('AuthService::updateAuthDisplayName -> ' + error.message);
        });
    }

    public sendResetPasswordMail(email:string): Promise<any>  {
        return new Promise((resolve, reject) => {
            firebase.auth().sendPasswordResetEmail(email)
                .then((authData) => {
                resolve(authData);

            }).catch((error) => {
                reject(error);
            });
        });

    }


}
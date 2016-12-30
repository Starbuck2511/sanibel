import {Injectable} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';

@Injectable()
export class AuthService {

    private auth: boolean = false;

    constructor(private af: AngularFire) {

    }

    public login(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this.af.auth.login(user, {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            }).then((authData) => {
                this.auth = true;
                resolve(authData);

            }).catch((error) => {
                reject(error);
            });
        });
    }

    public isAuthenticated(): boolean {
        return this.auth;
    }
}
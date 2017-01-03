import {Injectable} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';

@Injectable()
export class AuthService {

    private auth: boolean = false;
    private uid: string = null;

    constructor(private af: AngularFire) {

    }

    public login(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this.af.auth.login(user, {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            }).then((authData) => {
                this.auth = true;
                this.uid = authData.uid;
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
}
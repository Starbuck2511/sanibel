import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import {Group} from '../models/group';
/*
 Generated class for the TeammatesGroups provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class TeammatesGroups {

    apiUrl = 'http://siesta-key.de/app_dev.php/api';

    constructor(public http: Http) {
        console.log('Hello TeammatesGroups Provider');
    }

    // Load all github users
    load(): Observable<Group[]> {
        return this.http.get(`${this.apiUrl}/groups`)
            .map(res => <Group[]>res.json());
    }

}

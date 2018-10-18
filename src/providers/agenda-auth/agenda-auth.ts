import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/*
  Generated class for the AgendaAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AgendaAuthProvider {

  constructor(public http: HttpClient, private _db:AngularFireDatabase, private _auth:AngularFireAuth) {
    console.log('Hello AgendaAuthProvider Provider');
  }

  GetAuthState():Observable<firebase.User>{
  	return this._auth.authState;
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';


import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


/*
  Generated class for the AgendaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AgendaProvider {

  constructor(public http: HttpClient, private _db:AngularFireDatabase, private _auth:AngularFireAuth, private _storage:AngularFireStorage) {
    
  }

  GetAuthState():Observable<firebase.User>{
  	return this._auth.authState;
  }

  GetContactosPorInstitucion(contactoSubject:BehaviorSubject<string | null>):Observable<AngularFireAction<DatabaseSnapshot<any>>[]>{
  	//return contactoSubject.switchMap(instit => this._db.list('/contactos', ref => instit ? ref.orderByChild('organizacion').equalTo(instit):ref).snapshotChanges());
    let lista:Observable<AngularFireAction<DatabaseSnapshot<any>>[]>;

    contactoSubject.subscribe(instit => {
      lista = this._db.list('/contactos', ref => instit ? ref.orderByChild('organizacion').equalTo(instit):ref).snapshotChanges();
    });

    return lista;
  }

  GetContacto(id:string):Observable<any>{
    return this._db.object('/contactos/'.concat(id)).valueChanges();
  }

  GetImgUrl(idContacto:string, archivo:string):Observable<string>{
  	return this._storage.ref('/contactos/'.concat(idContacto,'/foto/',archivo)).getDownloadURL();
  }

  GetInstituciones():Observable<AngularFireAction<DatabaseSnapshot<any>>[]>{
  	return this._db.list('/organizaciones', ref => ref.orderByChild('nombre_corto')).snapshotChanges();
  }

  GetInstitucion(id:string):Observable<any>{
    return this._db.object('/organizaciones/'.concat(id)).valueChanges();
  }

  GetMunicipio(id:string):Observable<any>{
    return this._db.object('/municipios/'.concat(id)).valueChanges();
  }

  GetProyectos(subject:BehaviorSubject<number>):Observable<AngularFireAction<DatabaseSnapshot<any>>[]>{
    let lista:Observable<AngularFireAction<DatabaseSnapshot<any>>[]>;

    subject.subscribe(anio => {
      lista = this._db.list('/proyectos', ref => anio ? ref.orderByChild('anio').equalTo(anio):ref).snapshotChanges();
    });

    return lista;
  }

  GetSectores():Observable<AngularFireAction<DatabaseSnapshot<any>>[]>{
    return this._db.list('/sectoresDesarrollo').snapshotChanges();
  }


}

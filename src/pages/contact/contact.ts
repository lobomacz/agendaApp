import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AgendaProvider } from '../../providers/agenda/agenda';

import { DetalleContactoPage } from '../../pages/detalle-contacto/detalle-contacto';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

	private descripcion:string;
	private filtroInstitucion:string;
	private institucione$:Observable<AngularFireAction<DatabaseSnapshot<any>>[]>;
	private listaInstituciones:AngularFireAction<DatabaseSnapshot<any>>[];
	private contactoSub:BehaviorSubject<string | null>;
	private contacto$:Observable<AngularFireAction<DatabaseSnapshot<any>>[]>;

  constructor(public navCtrl: NavController, private _provider:AgendaProvider, private modalCtrl:ModalController) {
  	this.descripcion = 'Listado de contactos de instituciones.';
    this.listaInstituciones = null;
    this.contacto$ = null;
    this.contactoSub = new BehaviorSubject(null);
  }

  ionViewDidLoad(){

  	this.institucione$ = this._provider.GetInstituciones();
    
  	this.institucione$.subscribe(lista => {
  		this.listaInstituciones = lista;
  	});

    this.contacto$ = this._provider.GetContactosPorInstitucion(this.contactoSub);


  }

  BuscaInstitucion(clave:string):string{
    let nombre:string;
    if (this.listaInstituciones !== null && this.listaInstituciones.length > 0) {
      for(let item of this.listaInstituciones){
        if (item.key === clave) {
          nombre = item.payload.val().nombre_corto;
        }
      }
    }

    return nombre;
  }

  BuscaFoto(clave:string, nombre:string):string{

  	let fotoUrl:string;

    if (nombre.indexOf('assets') < 0) {
      this._provider.GetImgUrl(clave, nombre).subscribe(imgUrl => {
        fotoUrl = imgUrl;
      });
    }else{
      fotoUrl = "assets/imgs/unknown_user.jpg";
    }

  	return fotoUrl;
  }

  BuscaOrganizacion(clave:string):string{
    let nombre:string;
    if (this.listaInstituciones !== null && this.listaInstituciones.length > 0) {
      for(let item of this.listaInstituciones){
        if (item.key === clave) {
          nombre = item.payload.val().nombre_corto;
        }
      }
    }

    return nombre;
  }

  DetalleContacto(evento:Event, clave:string){
  	let paginaDetalle = this.modalCtrl.create(DetalleContactoPage,{'id':clave});
    paginaDetalle.present();
  }

}

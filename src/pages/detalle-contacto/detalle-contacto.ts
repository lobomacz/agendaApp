import { Component } from '@angular/core';
import { ModalController, NavParams, ViewController, Platform } from 'ionic-angular';

import { AgendaProvider } from '../../providers/agenda/agenda';

/**
 * Generated class for the DetalleContactoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detalle-contacto',
  templateUrl: 'detalle-contacto.html',
})
export class DetalleContactoPage {

	private _id:string;
	private contacto:any;
	private organizacion:string;
	private fotoUrl:string;
	private municipio:string;

  constructor( public navParams: NavParams, private platform:Platform, private _provider:AgendaProvider, private modalCtrl:ModalController, private viewCtrl:ViewController) {
  	this._id = navParams.get('id');
    this.contacto = null;
  	this.fotoUrl = "assets/imgs/unknown_user.jpg";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleContactoPage');
    this._provider.GetContacto(this._id).subscribe(datos => {
    	
    	this.contacto = datos;

      console.log(this.contacto);

    	if(this.contacto.foto.indexOf('assets') < 0){
    		this._provider.GetImgUrl(this._id, this.contacto.foto).subscribe(imgUrl => this.fotoUrl = imgUrl);
    	}

    	this._provider.GetInstitucion(this.contacto.organizacion).subscribe(org => {
    		this.organizacion = org.nombre_largo;
    	});
    	this._provider.GetMunicipio(this.contacto.municipio).subscribe(muni => {
    		this.municipio = muni.nombre;
    	});
    });
  }

  cerrar(){
    this.viewCtrl.dismiss();
  }

}

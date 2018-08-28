import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ReportesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reportes',
  templateUrl: 'reportes.html',
})
export class ReportesPage {

	private descripcion:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.descripcion = 'Seleccione las opciones y presione Generar para descargar el documento en formato PDF.';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportesPage');
  }

}

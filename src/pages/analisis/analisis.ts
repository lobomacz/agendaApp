import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Chart } from 'chart.js';
import 'rxjs/add/operator/map';

import { AgendaProvider } from '../../providers/agenda/agenda';

/**
 * Generated class for the AnalisisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-analisis',
  templateUrl: 'analisis.html',
})
export class AnalisisPage {

	private descripcion:string;
	private grupo:string;
  private porIS:boolean;
  private filtroInstitucion:string;

  @ViewChild('chartFuente') chartFuente:any;
  @ViewChild('chartSector') chartSector:any;
  @ViewChild('chartInstitucion') chartInstitucion:any;
  @ViewChild('chartIS') chartIS:any;

  private cPorFuente:Chart;
  private cPorSector:Chart;
  private cPorInstitucion:Chart;
  private cPorInstitucionSector:Chart;

  private proyectos:AngularFireAction<DatabaseSnapshot<any>[]>;
  private organizaciones:AngularFireAction<DatabaseSnapshot<any>[]>;
  private sectores:AngularFireAction<DatabaseSnapshot<any>[]>;

  

  constructor(public navCtrl: NavController, public navParams: NavParams, private _provider:AgendaProvider) {
  	this.descripcion = 'Análisis de la inversión por tipo de fuente.';
  	this.grupo = 'fuente';
    this.porIS = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnalisisPage');
    
  }

  onSegment__Change(evento:Event){

    switch (this.grupo) {
      case "sector":
        this.descripcion = 'Análisis de la inversión por sector.';
        break;
      case "instit":
        this.descripcion = 'Análisis de la inversión por institución.';
        
        break;
      
      default:
        this.descripcion = 'Análisis de la inversión por tipo de fuente.';
        break;
    }
  	console.log(this.grupo);
  }

  CambiaDesc(){
    if (this.porIS == true) {
      this.descripcion = 'Análisis de la inversión por sector por institución.';
    }else{
      this.descripcion = 'Análisis de la inversión por institución.';
    }
  }

}

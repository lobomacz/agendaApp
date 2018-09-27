import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AnalisisPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-analisis-popover',
  templateUrl: 'analisis-popover.html',
})
export class AnalisisPopoverPage {

  private annio:number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController) {
    this.annio = this.navParams.get('annio');
  }

  ionViewDidLoad() {
    
  }

  On_Aplicar_Click(){
  	this.viewCtrl.dismiss({'annio':this.annio});
  }

  On_Cancelar_Click(){
    this.viewCtrl.dismiss(null);
  }

}

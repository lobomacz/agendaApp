import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, Popover, Slides, ViewController } from 'ionic-angular';
import { AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Chart } from 'chart.js';
import 'rxjs/add/operator/map';

import { AgendaProvider } from '../../providers/agenda/agenda';

import { AnalisisPopoverPage } from '../analisis-popover/analisis-popover';

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
  private conAlc:boolean;
  private filtroInstitucion:string;
  private annio:number;
  private annioSubject:BehaviorSubject<number>;

  @ViewChild('chartFuente') chartFuente:any;
  @ViewChild('chartSector') chartSector:any;
  @ViewChild('chartInstitucion') chartInstitucion:any;
  @ViewChild('chartIS') chartIS:any;
  @ViewChild('chartAlcaldias') chartAlcaldias:any;

  @ViewChild(Slides) slides:Slides;

  private cPorFuente:Chart;
  private cPorSector:Chart;
  private cPorInstitucion:Chart;
  private cPorInstitucionSector:Chart;
  private cConAlcaldias:Chart;

  private proyectos:AngularFireAction<DatabaseSnapshot<any>>[];
  private organizaciones:AngularFireAction<DatabaseSnapshot<any>>[];
  private organizacionesProyectos:AngularFireAction<DatabaseSnapshot<any>>[];
  private sectores:AngularFireAction<DatabaseSnapshot<any>>[];
  private alcaldias:AngularFireAction<DatabaseSnapshot<any>>[];

  private datosPorF:any;
  private datosPorS:any;
  private datosPorI:any;
  private datosPorIS:any;
  private datosPorInv:any;

  private colores:string[];

  private alertBotones:any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private _provider:AgendaProvider, private popoverCtrl:PopoverController) {
  	this.descripcion = 'Análisis por tipo de inversión.';
  	this.grupo = 'fuente';
    this.porIS = false;
    this.conAlc = false;
    this.annio = new Date().getFullYear();
    this.colores = [
      "#1e90ff",
      "#9b59b6",
      "#87d369",
      "#e67e22",
      "#E63183",
      "#060",
      "#ff6b81",
      "#ffb900",
      "#f7f7f7",
      "#28b485",
      "#33f",
      "#bc1339",
      "#ffeb56",
      "#2ed573",
      "#777",
      "#ff7730",
      "#bc3cb4",
      "#5eeded",
      "#2998ff",
      "#ff4949",
      "#f1c40f",
      "#2c3e50"
    ];

  }

  ionViewDidLoad() {
    this.annioSubject = new BehaviorSubject(this.annio);
    this.LlenaDatos();
    
  }

  SetFiltroInstitucion(evento:Event){
    this.cPorInstitucionSector = null;
    this.ChartPorIS();
  }

  LlenaDatos(){
    this._provider.GetProyectos(this.annioSubject).subscribe((res) => {
      this.proyectos = res;

      this._provider.GetAlcaldias().subscribe((dato) => {
        this.alcaldias = dato;
      });

      this._provider.GetInstituciones().subscribe((datos) => {
        this.organizaciones = datos;

        this.datosPorI = this.ProcesaPorInstitucion(this.proyectos.map(this.ArrayPorInstitucion));
        this.ChartPorInstitucion();

        this.organizacionesProyectos = this.InstitucionesConProyectos();
        if (this.organizacionesProyectos !== undefined && this.organizacionesProyectos.length > 0) {
          this.filtroInstitucion = this.organizacionesProyectos[0].key;
        }


        this._provider.GetSectores().subscribe((sectores) => {
          this.sectores = sectores;
          this.datosPorS = this.ProcesaPorSector(this.proyectos.map(this.ArrayPorSector));
          this.ChartPorSector();

          this.datosPorIS = this.ProcesaInstitucionSector(this.proyectos.map(this.ArrayPorInstitucionSector));
          this.ChartPorIS();
        });
        
        this.datosPorF = this.ProcesaPorFuente(this.proyectos.map(this.ArrayPorFuente));
        this.ChartPorFuente();

        this.datosPorInv = this.ProcesaPorInversion(this.proyectos.map(this.ArrayPorFuente));
        this.ChartPorInversion();

      });


    });
  }

  ArrayPorInstitucion(dato:any,indice:number):any{
    let clave = dato.payload.val().id_organizacion;
    let valor = dato.payload.val().monto;
    return {'organizacion':clave,'monto':valor};
  }

  ArrayPorSector(dato:any,indice:number):any{
    let clave = dato.payload.val().sector;
    let valor = dato.payload.val().monto;
    return {'sector':clave,'monto':valor};
  }

  ArrayPorInstitucionSector(dato:any,indice:number):any{
    let clave = dato.payload.val().id_organizacion;
    let dato1 = dato.payload.val().sector;
    let dato2 = dato.payload.val().monto;
    return {'organizacion':clave,'sector':dato1,'monto':dato2};
  }

  ArrayPorFuente(dato:any,indice:number):any{
    let clave:string;// = dato.payload.val().tipo;
    let valor:number;// = dato.payload.val().monto;
    let valor2:number;// = dato.payload.val().cooperacion;
    clave = dato.payload.val().tipo;
    valor = dato.payload.val().cooperacion;
    valor2 = dato.payload.val().monto;


    return {'fuente':clave, 'cext':valor, 'monto':valor2};
  }


  On_ShowPopOver_Click(){
    let popover:Popover = this.popoverCtrl.create(AnalisisPopoverPage, {'annio':this.annio}, {enableBackdropDismiss:false});
    popover.present();
    popover.onDidDismiss((datos) => {
      if(datos !== null){
        this.annio = datos.annio;
      }
    });
  }

  ProcesaPorInstitucion(datos:any[]):any{
    let seleccion = {};

    if(datos !== null && datos.length > 0){
      
      datos.forEach((valor) => {
        let clave:string;
        clave = valor.organizacion;
        if(seleccion[clave] == undefined){
          seleccion[clave] = valor.monto;
        }else{
          seleccion[clave] += valor.monto;
        }
      });

    }

    return seleccion;
  }

  ProcesaPorSector(datos:any[]):any{
    
    let seleccion = {};

    if(datos !== null && datos.length > 0){
      datos.forEach((valor) => {
        let nombre:string = this.NombreSector(valor.sector).toUpperCase();
        if(seleccion[nombre] == undefined){
          seleccion[nombre] = valor.monto;
        }else{
          seleccion[nombre] += valor.monto;
        }
      });
    }

    //AGREGADOS PARA PRESENTAR GRÁFICO DE BARRAS
    let dataset:any[] = [];

    for (let sector in seleccion) {
      let dato:any = {};
      dato['x'] = sector;
      dato['y'] = seleccion[sector];
      dataset.push(dato);
    }

    
    //Reemplazado por dataset para gráfico de barras
    return seleccion;
    //return dataset;
  }

  ProcesaInstitucionSector(datos:any[]):any{
    let seleccion = {};

    if(datos !== null && datos.length > 0){
      datos.forEach((valor) => {
        let clave = valor.organizacion;
        let entrada = [];
        entrada[valor.sector] = valor.monto;
        if(seleccion[clave] == null){
          seleccion[clave] = entrada;
        }else{
          if (seleccion[clave][valor.sector] == null) {
            seleccion[clave][valor.sector] = valor.monto;
          }else{
            seleccion[clave][valor.sector] += valor.monto;
          }
        }
      });
    }

    return seleccion;
  }

  ProcesaPorFuente(datos:any[]):any{
    let seleccion = {};

    if(datos !== null && datos.length > 0){
      datos.forEach((valor) => {

        let AddSeleccion:any = function(fuente:string,monto:number){
          if(seleccion[fuente.toUpperCase()] === undefined){
            seleccion[fuente.toUpperCase()] = monto;
          }else{
            seleccion[fuente.toUpperCase()] += monto;
          }
        };

        let clave:string = valor.fuente;
        let fuente:string;
        let monto:number;

        if(clave === 'privado'){

          fuente = clave;
          monto = valor.monto;
          AddSeleccion(fuente,monto);

        }else if(clave === 'ong'){

          fuente = 'cooperacion';
          monto = valor.monto;
          AddSeleccion(fuente,monto);

        }else{

          if(valor.cext > 0){
            fuente = 'cooperacion';
            monto = valor.cext;
            AddSeleccion(fuente,monto);
          }

          if(valor.monto > valor.cext){
            fuente = 'tesoro';
            monto = valor.monto - valor.cext;
            AddSeleccion(fuente,monto);
          }
        }

        
      });
    }

    return seleccion;
  }

  ProcesaPorInversion(datos:any[]):any{

    let seleccion:any = {};

    datos.forEach((valor) => {
      let tipo = valor.fuente.toUpperCase();

      if(seleccion[tipo] === undefined){
        seleccion[tipo] = valor.monto;
      }else{
        seleccion[tipo] += valor.monto;
      }

    });

    return seleccion;

  }

  InstitucionesConProyectos():AngularFireAction<DatabaseSnapshot<any>>[]{
    let lista:AngularFireAction<DatabaseSnapshot<any>>[] = [];
    
    for(let clave of Object.keys(this.datosPorI)){

      this.organizaciones.forEach((valor) => {
        if(valor.key === clave){
          lista.push(valor);
        }
      });
    }

    return lista;
  }

  NombreOrganizacion(clave:string):string{
    let nombre:string;
    
    for(let item of this.organizaciones){
      if (item.key === clave) {
        nombre = item.payload.val().nombre_corto;
      }
    }

    return nombre;
  }

  NombreSector(clave:number):string{
    return this.sectores[clave].payload.val();
  }

  ChartPorInstitucion(){
    let etiquetas:string[] = Object.keys(this.datosPorI);
    let valores:number[] = etiquetas.map((key) => {return this.datosPorI[key]});

    //etiquetas = etiquetas.map(this.NombreOrganizacion);
    for (let eti of etiquetas) {
      etiquetas[etiquetas.indexOf(eti)] = this.NombreOrganizacion(eti);
    }
    
    let ctx = this.chartInstitucion.nativeElement.getContext('2d');

    this.cPorInstitucion = new Chart(ctx,{
      type:'bar',
      data:{
        labels:etiquetas,
        datasets:[
          {
            data:valores,
            backgroundColor:this.colores
          }
        ]
      },
      options:{
        animation:{animateRotate:true},
        legend:{
          display:false,
          position:"bottom",
          labels:{fontColor:'#000'}
          
        },
        title:{
          display:false,
          text:"Distribución de la Inversión por Institución en la RACCS.",
          fontColor:"#000",
          fontSize:10,
        }
      },

    });
  }

  ChartPorSector(){

    let etiquetas:string[] = Object.keys(this.datosPorS);
    let valores:number[] = etiquetas.map((key)=>{return this.datosPorS[key]});


    let ctx = this.chartSector.nativeElement.getContext('2d');

    this.cPorSector = new Chart(ctx,{
      type:'bar',
      data:{
        labels:etiquetas,
        datasets:[{
          label:'Inversión por sector',
          data:valores,
          backgroundColor:this.colores
        }]
      },
      options:{
        //animation:{animateRotate:true},
        legend:{
          display:false,
        },
        title:{
          text:"Distribución de la Inversión por Sector en la RACCS.",
          fontColor:'#000',
          fontSize:10,
          display:false
        }
      }
    });
  }

  ChartPorFuente(){
    let etiquetas = Object.keys(this.datosPorF);
    let valores = etiquetas.map((key)=>{return this.datosPorF[key]});

    let ctx = this.chartFuente.nativeElement.getContext('2d');

    this.cPorFuente = new Chart(ctx,{
      type:'doughnut',
      data:{
        labels:etiquetas,
        datasets:[{
          label:'Fuente de Financ.',
          data:valores,
          backgroundColor:this.colores
        }]
      },
      options:{
        animation:{
          animateRotate:true,
          animateScale:true
        },
        title:{
          text:"Distribución de la Inversión por Fuente de Financiamiento.",
          fontColor:'#000',
          display:false,
          fontSize:10
        },
        legend:{
          display:true,
          position:'bottom'
        }
      }
    });
  }

  ChartPorIS(){

    let nombre:string;

    this.organizacionesProyectos.forEach((valor) => {
      if (valor.key === this.filtroInstitucion) {
        nombre = valor.payload.val().nombre_corto.toUpperCase();
      }
    });

    let datos:any[] = this.datosPorIS[this.filtroInstitucion];
    let etiquetas:any[] = Object.keys(datos);
    let valores:number[] = etiquetas.map((key)=>{return datos[key]});

    for (let eti of etiquetas) {
      etiquetas[etiquetas.indexOf(eti)] = this.NombreSector(eti).toUpperCase();
    }

    let ctx = this.chartIS.nativeElement.getContext('2d');

    this.cPorInstitucionSector = new Chart(ctx,{
      type:'doughnut',
      data:{
        labels:etiquetas,
        datasets:[{
          data:valores,
          backgroundColor:this.colores
        }]
      },
      options:{
        animation:{
          animateRotate:true
        },
        legend:{
          display:true,
          position:'bottom',
          labels:{
            fontColor:'#000'
          }
        },
        title:{
          text:"Distribución de la Inversión por Sector para ".concat(nombre),
          fontColor:'#000',
          fontSize:10,
          display:false
        }
      }
    });

  }

  ChartPorInversion(){

    let etiquetas:string[] = Object.keys(this.datosPorInv);
    let valores:number[] = etiquetas.map((key)=>{return this.datosPorInv[key]});

    let ctx = this.chartAlcaldias.nativeElement.getContext('2d');

    this.cConAlcaldias = new Chart(ctx,{
      type:'polarArea',
      data:{
        labels:etiquetas,
        datasets:[{
          data:valores,
          backgroundColor:this.colores
        }]
      },
      options:{
        animation:{
          animateRotate:true
        },
        legend:{
          display:true,
          position:'bottom',
          labels:{
            fontColor:'#000'
          }
        },
        title:{
          text:"Inversiones en el Caribe Sur ".concat(this.annio.toString()),
          fontColor:'#000',
          fontSize:10,
          display:false
        }
      }
    });

  }

}

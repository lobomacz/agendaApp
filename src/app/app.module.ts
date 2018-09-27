import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AnalisisPage } from '../pages/analisis/analisis';
import { ReportesPage } from '../pages/reportes/reportes';
import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';
import { DetalleContactoPage } from '../pages/detalle-contacto/detalle-contacto';
import { AnalisisPopoverPage } from '../pages/analisis-popover/analisis-popover';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AgendaProvider } from '../providers/agenda/agenda';

//Importamos los modulos de AF2
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgendaAuthProvider } from '../providers/agenda-auth/agenda-auth';

//Settings de AF2
export const firebaseConfig = {
  apiKey: "AIzaSyADHtFuM_KST7j7MgvO7yjYQ49pqrD1qOQ",
  authDomain: "agendaautonomia.firebaseapp.com",
  databaseURL: "https://agendaautonomia.firebaseio.com",
  projectId: "agendaautonomia",
  storageBucket: "agendaautonomia.appspot.com",
  messagingSenderId: "131196472512"
};

@NgModule({
  declarations: [
    MyApp,
    AnalisisPage,
    ReportesPage,
    ContactPage,
    TabsPage,
    DetalleContactoPage,
    AnalisisPopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AnalisisPage,
    ReportesPage,
    ContactPage,
    TabsPage,
    DetalleContactoPage,
    AnalisisPopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AgendaProvider,
    AgendaAuthProvider
  ]
})
export class AppModule {}

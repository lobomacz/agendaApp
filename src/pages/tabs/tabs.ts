import { Component } from '@angular/core';

import { AnalisisPage } from '../analisis/analisis';
import { ReportesPage } from '../reportes/reportes';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AnalisisPage;
  tab2Root = ReportesPage;
  tab3Root = ContactPage;

  constructor() {

  }
}

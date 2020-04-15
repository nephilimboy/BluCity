import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardModule} from './dashboard/dashboard.module';
import {PagesRoutingModule} from './pages-routing.module';
import {ThemeModule} from '../theme/theme.module';
import {NetworkGrapherModule} from "./networkGrapher/networkGrapher.module";
import {LogParserModule} from "./logParser/logParser.module";
import {GrapherEntitiesModule} from "./grapherEntities/grapherEntities.module";
import {BlcModule} from "./BLC/blc.module";
import {TaxiModule} from "./taxi/taxi.module";

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    NetworkGrapherModule,
    LogParserModule,
    GrapherEntitiesModule,
    BlcModule,
    TaxiModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}

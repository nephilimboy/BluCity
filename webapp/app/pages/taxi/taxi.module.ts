import {NgModule} from '@angular/core';
import {ThemeModule} from "../../theme/theme.module";
import {NgxEchartsModule} from "ngx-echarts";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {TaxiComponent} from './taxi.component'
import {TaxiRoutingModule} from "./taxi-routing.module";
import {TaxiService} from "./taxi.service";

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    TaxiRoutingModule,
    Ng2SmartTableModule,
    CodemirrorModule
  ],
  declarations: [
    TaxiComponent,
  ],
  providers:[
    TaxiService
  ]
})
export class TaxiModule {
}

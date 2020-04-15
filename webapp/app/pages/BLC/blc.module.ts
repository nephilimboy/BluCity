import {NgModule} from '@angular/core';
import {ThemeModule} from "../../theme/theme.module";
import {NgxEchartsModule} from "ngx-echarts";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {BlcComponent} from './blc.component'
import {BlcRoutingModule} from "./blc-routing.module";
import {BlcService} from "./blc.service";

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    BlcRoutingModule,
    Ng2SmartTableModule,
    CodemirrorModule
  ],
  declarations: [
    BlcComponent,
  ],
  providers:[
    BlcService
  ]
})
export class BlcModule {
}

import {NgModule} from '@angular/core';
import {NetworkGrapherComponent} from "./networkGrapher.component";
import {NetworkGrapherRoutingModule} from "./networkGrapher-routing.module";
import {RamSpinnerComponent} from "./ramSpinner/ramSpinner.component";
import {ThemeModule} from "../../theme/theme.module";
import {NgxEchartsModule} from "ngx-echarts";
import {NetworkGrapherService} from "./networkGrapher.service";
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    NetworkGrapherRoutingModule,
    CodemirrorModule
  ],
  declarations: [
    NetworkGrapherComponent,
    RamSpinnerComponent
  ],
  providers:[
    NetworkGrapherService
  ]
})
export class NetworkGrapherModule {
}

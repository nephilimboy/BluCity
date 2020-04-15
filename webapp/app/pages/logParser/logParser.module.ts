import {NgModule} from '@angular/core';
import {ThemeModule} from "../../theme/theme.module";
import {LogParserComponent} from "./logParser.component";
import {LogParserRoutingModule} from "./logParser-routing.module";
import {LogParserEditComponent} from "./logParser-edit.component";
import {NbDialogModule} from "@nebular/theme";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {LogParserService} from "./logParser.service";
import {CustomPatternService} from "./customPattern.service";
import {CustomPatternEditComponent} from "./customPattern-edit.component";
import {JasonParserEditComponent} from "./jasonParser-edit.component";
import {JasonParserService} from "./jasonParser.service";


@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    NbDialogModule.forChild(),
    LogParserRoutingModule,
  ],
  declarations: [
    LogParserComponent,
    LogParserEditComponent,
    CustomPatternEditComponent,
    JasonParserEditComponent,
  ],
  providers:[
    LogParserService,
    CustomPatternService,
    JasonParserService
  ],
  entryComponents:[
    LogParserEditComponent,
    CustomPatternEditComponent,
    JasonParserEditComponent,
  ]
})
export class LogParserModule {
}

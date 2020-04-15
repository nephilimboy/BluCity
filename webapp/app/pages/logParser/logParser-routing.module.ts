import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogParserComponent} from "./logParser.component";

const routes: Routes = [{
    path: '',
    component: LogParserComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LogParserRoutingModule {
}



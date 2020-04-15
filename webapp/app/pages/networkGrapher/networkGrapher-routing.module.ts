import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NetworkGrapherComponent} from "./networkGrapher.component";

const routes: Routes = [{
    path: '',
    component: NetworkGrapherComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NetworkGrapherRoutingModule {
}



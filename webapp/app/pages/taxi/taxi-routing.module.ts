import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaxiComponent} from "./taxi.component";

const routes: Routes = [{
    path: '',
    component: TaxiComponent,
}];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TaxiRoutingModule {
}



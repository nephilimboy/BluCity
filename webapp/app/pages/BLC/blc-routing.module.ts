import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlcComponent} from "./blc.component";

const routes: Routes = [{
    path: '',
    component: BlcComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BlcRoutingModule {
}



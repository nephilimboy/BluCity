import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GrapherEntitiesComponent} from "./grapherEntities.component";

const routes: Routes = [{
    path: '',
    component: GrapherEntitiesComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GrapherEntitiesRoutingModule {
}



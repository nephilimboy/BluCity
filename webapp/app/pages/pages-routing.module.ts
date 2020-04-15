import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        // {
        //     path: 'dashboard',
        //     component: DashboardComponent,
        // },
        // {
        //     path: 'networkGrapher',
        //     loadChildren: './networkGrapher/networkGrapher.module#NetworkGrapherModule',
        // },
        {
            path: 'BLC',
            loadChildren: './BLC/blc.module#BlcModule',
        },
        {
            path: 'taxi',
            loadChildren: './taxi/taxi.module#TaxiModule',
        },
        {
            path: 'grapherEntities',
            loadChildren: './grapherEntities/grapherEntities.module#GrapherEntitiesModule',
        },
        {
            path: 'logParser',
            loadChildren: './logParser/logParser.module#LogParserModule',
        },
        // {
        //     path: '',
        //     redirectTo: 'dashboard',
        //     pathMatch: 'full',
        // },
        {
            path: '',
            redirectTo: 'BLC',
            pathMatch: 'full',
        },
        {
            path: '**',
            redirectTo: 'BLC',
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}

import {Component} from '@angular/core';
import {LocalDataSource} from "ng2-smart-table";
import {GrapherEntities} from "./grapherEntities.model";
import {NbDialogService} from "@nebular/theme";
import {LogParserEditComponent} from "../logParser/logParser-edit.component";
import {LogParser} from "../logParser/logParser.model";
import {GrapherEntitiesEditComponent} from "./grapherEntities-edit.component";

@Component({
    selector: 'app-grapherEntities',
    templateUrl: './grapherEntities.component.html',
})
export class GrapherEntitiesComponent {
    grapherEntities_table_settings = {
        hideSubHeader: true,
        mode: 'external',
        add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
        },
        columns: {
            name: {
                title: 'Name',
                type: 'string',
            },
            parsers: {
                title: 'Parsers',
                type: 'string',
            },
        },
    };

    sourceGrapherEntities: LocalDataSource = new LocalDataSource();
    grapherEntities: GrapherEntities[];

    constructor(private dialogService: NbDialogService,) {

    }

    onDeleteGrapherEntities(){

    }

    onEditGrapherEntities(){

    }

    createNewGrapherEntities(){
        this.dialogService
            .open(GrapherEntitiesEditComponent, {
                closeOnBackdropClick: false,
                context: {
                    grapherEntities: new GrapherEntities(),
                    isEditData: false
                },
            })
            .onClose.subscribe((res) => this.loadAllGrapherEntities());
    }
// GrapherEntities: new LogParser()
    loadAllGrapherEntities(){

    }


}
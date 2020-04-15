import {AfterContentInit, Component, OnInit} from '@angular/core';
import {LocalDataSource} from "ng2-smart-table";
import {NbDialogService} from '@nebular/theme';
import {LogParserEditComponent} from "./logParser-edit.component";
import {LogParser} from "./logParser.model";
import {LogParserService} from "./logParser.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {CustomPatternService} from "./customPattern.service";
import {CustomPattern} from "./customPattern.model";
import {CustomPatternEditComponent} from "./customPattern-edit.component";
import {JasonParserEditComponent} from "./jasonParser-edit.component";
import {JasonParser, JasonParserVM} from "./jasonParser.model";
import {JasonParserService} from "./jasonParser.service";

@Component({
    selector: 'app-logParser',
    templateUrl: './logParser.component.html',
})
export class LogParserComponent implements OnInit, AfterContentInit {


    logParser_table_settings = {
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
            pattern: {
                title: 'Pattern',
                type: 'string',
            },
        },
    };

    customPatter_table_settings = {
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
            pattern: {
                title: 'Pattern',
                type: 'string',
            },
        },
    };

    jasonParser_table_settings = {
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
            jason_alias: {
                title: 'Alias',
                type: 'html',
            },
        },
    };

    sourceLogParser: LocalDataSource = new LocalDataSource();
    logParsers: LogParser[];
    sourceCustomPattern: LocalDataSource = new LocalDataSource();
    customPattern: CustomPattern[];
    sourceJasonParser: LocalDataSource = new LocalDataSource();
    jasonParser: JasonParser[];

    constructor(private dialogService: NbDialogService,
                private lopParserService: LogParserService,
                private jasonParserService: JasonParserService,
                private customPatternService: CustomPatternService) {
    }

    onDeleteConfirmLogParser(event): void {
        if (window.confirm('Are you sure you want to delete?')) {
            event.confirm.resolve();
        } else {
            event.confirm.reject();
        }
    }

    onDeleteConfirmCustomPattern(event): void {
        console.log('hhd');
    }

    ngOnInit() {
        this.loadAllLogParser();
        this.loadAllCustomPattern();
        this.loadAllJasonParser();
    }

    ngAfterContentInit(): void {
    }

    loadAllLogParser() {
        this.lopParserService.query().subscribe(
            (res: HttpResponse<LogParser[]>) => {
                this.logParsers = res.body;
                this.sourceLogParser.load(this.logParsers);
            },
            (res: HttpErrorResponse) => console.log('error')
        );
    }

    loadAllCustomPattern() {
        this.customPatternService.query().subscribe(
            (res: HttpResponse<CustomPattern[]>) => {
                this.customPattern = res.body;
                this.sourceCustomPattern.load(this.customPattern);
            },
            (res: HttpErrorResponse) => console.log('error')
        );
    }

    loadAllJasonParser() {
        this.jasonParserService.query().subscribe(
            (res: HttpResponse<JasonParser[]>) => {
                this.jasonParser = res.body;
                // this.sourceJasonParser.load(this.jasonParser);
                let jasonParserVM: JasonParserVM[] = [];
                this.jasonParser.forEach(jparser => {
                    let jParserVM = new JasonParserVM();
                    jParserVM.id = jparser.id;
                    jParserVM.name = jparser.name;
                    jParserVM.jason = jparser.jason;
                    jparser.jason_alias.forEach(alias => {
                        jParserVM.jason_alias += alias.name + '&nbsp;' + `<span class="jsonAlias bold" style="font-weight: 900 !important;"> <-> </span>` + "&nbsp;" + alias.path + "<br/>"

                    });
                    jasonParserVM.push(jParserVM);
                });
                console.log(jasonParserVM);
                this.sourceJasonParser.load(jasonParserVM);
            },
            (res: HttpErrorResponse) => console.log('error')
        );
    }

    createNewLogParser() {
        this.dialogService
            .open(LogParserEditComponent, {
                closeOnBackdropClick: false,
                context: {
                    logParser: new LogParser()
                },
            })
            .onClose.subscribe((res) => this.loadAllLogParser());
    }

    createNewCustomPattern() {
        this.dialogService
            .open(CustomPatternEditComponent, {
                closeOnBackdropClick: false,
                context: {
                    customPattern: new CustomPattern(),
                    isEditData: false
                },
            })
            .onClose.subscribe((res) => this.loadAllCustomPattern());
    }

    createNewJasonParser() {
        this.dialogService
            .open(JasonParserEditComponent, {
                closeOnBackdropClick: false,
                context: {
                    jasonParser: new JasonParser(),
                    isEditData: false
                },
            })
            .onClose.subscribe((res) => this.loadAllJasonParser());
    }

    onEditLogParser(evt) {
        let temp :LogParser = new LogParser();
        this.logParsers.forEach(parser =>{
            if (evt.data.id === parser.id) {
                temp.id = parser.id;
                temp.name = parser.name;
                temp.pattern = parser.pattern;
                temp.totalPattern = parser.totalPattern;
                parser.logParser_crudForm_customPattern.forEach(customPattern=>{
                    temp.logParser_crudForm_customPattern.push(customPattern);
                });
                parser.logParser_crudForm_staticPattern.forEach(staticPattern=>{
                    temp.logParser_crudForm_staticPattern.push(staticPattern);
                });
            }
        })
        this.dialogService
            .open(LogParserEditComponent, {
                closeOnBackdropClick: false,
                context: {
                    logParser: temp,
                    isEditData: true
                },
            })
            .onClose.subscribe((res) => this.loadAllLogParser());
    }

    onEditDataLogParser(evt) {
        console.log(evt)
    }

    onEditCustomPattern(evt) {
        this.dialogService
            .open(CustomPatternEditComponent, {
                closeOnBackdropClick: false,
                context: {
                    customPattern: evt.data,
                    isEditData: true
                },
            })
            .onClose.subscribe((res) => this.loadAllCustomPattern());
    }

    onEditJasonParser(evt) {
        let temp :JasonParser = new JasonParser();
        this.jasonParser.forEach(parser =>{
            if (evt.data.id === parser.id) {
                temp.id = parser.id;
                temp.name = parser.name;
                temp.jason = parser.jason;
                parser.jason_alias.forEach(alias=>{
                    temp.jason_alias.push(alias);
                });
            }
        })
        this.dialogService.open(JasonParserEditComponent, {
                closeOnBackdropClick: false,
                context: {
                    jasonParser: temp,
                    isEditData: true
                },
            })
            .onClose.subscribe((res) => this.loadAllJasonParser());

    }

    onDeleteLogParser(evt) {
        this.lopParserService.delete(parseInt(evt.data.id)).subscribe((response) => {
            this.loadAllLogParser();
        }, (res) => console.log('res'));
    }

    onDeleteCustomPattern(evt) {
        this.customPatternService.delete(parseInt(evt.data.id)).subscribe((response) => {
            this.loadAllCustomPattern();
        }, (res) => console.log('res'));
    }

    onDeleteJasonParser(evt) {
        this.jasonParserService.delete(parseInt(evt.data.id)).subscribe((response) => {
            this.loadAllJasonParser();
        }, (res) => console.log('res'));
    }

}
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";
import {GrapherEntities} from "./grapherEntities.model";
import {LogParserService} from "../logParser/logParser.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {LogParser} from "../logParser/logParser.model";

declare var $: any;

@Component({
    selector: 'app-grapherEntitiesEdit',
    templateUrl: './grapherEntities-edit.component.html',
})
export class GrapherEntitiesEditComponent implements AfterViewInit, OnInit {
    @ViewChild('exampleDiv') exampleDiv: ElementRef;

    @Input() grapherEntities: GrapherEntities;
    @Input() isEditData: boolean = false;


    public diagModel: any;

    private logParsers: LogParser[];
    private cx: number;
    private cy: number;

    constructor(protected ref: NbDialogRef<GrapherEntitiesEditComponent>,
                private logParserService:LogParserService) {
    }


    ngOnInit(): void {
        this.logParserService.query().subscribe(
            (res: HttpResponse<LogParser[]>) => {
                this.logParsers = res.body;
            },
            (res: HttpErrorResponse) => console.log('error')
        );
    }

    ngAfterViewInit() {

        var container = $('#chart_container');
        this.cx = $('#exampleDiv').width() / 2;
        this.cy = $('#exampleDiv').height() / 2;
        $('#exampleDiv').panzoom({
        });
        $('#exampleDiv').panzoom('pan', -this.cx + container.width() / 2, -this.cy + container.height() / 2);

        var possibleZooms = [0.5, 0.75, 1, 2, 3];
        var currentZoom = 2;
        container.on('mousewheel.focal', function (e) {
            e.preventDefault();
            var delta = (e.delta || e.originalEvent.wheelDelta) || e.originalEvent.detail;
            var zoomOut: any = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
            $('#exampleDiv').flowchart('setPositionRatio', possibleZooms[currentZoom]);
            $('#exampleDiv').panzoom('zoom', possibleZooms[currentZoom], {
                animate: false,
                focal: e
            });

        });



        setTimeout(() => {
            $(this.exampleDiv.nativeElement).flowchart({
                data: '',
                multipleLinksOnOutput: true,
                grid: 20,
            });
        }, 1000);

    }


    save() {
    }

    dismiss() {
        this.ref.close();
    }


    operatorI = 0;

    addNewOperator() {

        var operatorId = 'created_operator_' + this.operatorI;
        var operatorData = {
            top: this.cx,
            left: this.cy,
            properties: {
                title: 'Operator ' + (this.operatorI + 3),
                class: 'myTest',
                inputs: {},
                outputs: {
                    output_1: {
                        label: 'Output 1',
                    },
                    output_2: {
                        label: 'Output 2',
                    },
                    output_3: {
                        label: 'Output 3',
                    },
                    output_4: {
                        label: 'Output 4',
                    },
                }
            }
        }

        this.operatorI++;
        $(this.exampleDiv.nativeElement).flowchart('createOperator', operatorId, operatorData);
    }

    addTachometer() {
        var operatorId = 'Tachometer_' + this.operatorI;
        var operatorData = {
            top: this.cx,
            left: this.cy,
            properties: {
                title: 'Tachometer_ ' + (this.operatorI + 3),
                class: 'myTest2',
                inputs: {
                    input_1: {
                        label: 'number input',
                    }
                },
                outputs: {}
            }
        };
        this.operatorI++;
        $(this.exampleDiv.nativeElement).flowchart('createOperator', operatorId, operatorData);
    }
    addLogViewer() {
        var operatorId = 'LogViewer_' + this.operatorI;
        var operatorData = {
            top: this.cx,
            left: this.cy,
            properties: {
                title: 'LogViewer_ ' + (this.operatorI + 3),
                class: 'myTest2',
                inputs: {
                    input_1: {
                        label: 'log input',
                    }
                },
                outputs: {}
            }
        };
        this.operatorI++;
        $(this.exampleDiv.nativeElement).flowchart('createOperator', operatorId, operatorData);
    }
    addLink() {
        var operatorId = 'LinkViewer_' + this.operatorI;
        var operatorData = {
            top: this.cx,
            left: this.cy,
            properties: {
                title: 'LinkViewer_ ' + (this.operatorI + 3),
                class: 'myTest2',
                inputs: {
                    input_1: {
                        label: 'From',
                    },
                    input_2: {
                        label: 'To',
                    }
                },
                outputs: {}
            }
        };
        this.operatorI++;
        $(this.exampleDiv.nativeElement).flowchart('createOperator', operatorId, operatorData);
    }
    addAlert() {
        var operatorId = 'Alert_' + this.operatorI;
        var operatorData = {
            top: this.cx,
            left: this.cy,
            properties: {
                title: 'Alert_ ' + (this.operatorI + 3),
                class: 'myTest2',
                inputs: {
                    input_1: {
                        label: 'alert input',
                    }
                },
                outputs: {}
            }
        };
        this.operatorI++;
        $(this.exampleDiv.nativeElement).flowchart('createOperator', operatorId, operatorData);
    }


    deleteOperationOrLink() {
        $(this.exampleDiv.nativeElement).flowchart('deleteSelected');
    }

    load() {
        $(this.exampleDiv.nativeElement).flowchart('deleteSelected');
        var data = JSON.parse(this.diagModel);
        $(this.exampleDiv.nativeElement).flowchart('setData', data);
    }


    get() {
        $(this.exampleDiv.nativeElement).flowchart('deleteSelected');
        var data = $(this.exampleDiv.nativeElement).flowchart('getData');
        this.diagModel = JSON.stringify(data, null, 2);
    }

}
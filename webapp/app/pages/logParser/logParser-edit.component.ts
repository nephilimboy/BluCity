import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {LogParser, LogParserCrudFormCustomPattern, LogParserCrudFormStaticPattern} from "./logParser.model";
import {LogParserService} from "./logParser.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

@Component({
    selector: 'app-logParserEdit',
    templateUrl: './logParser-edit.component.html',
})
export class LogParserEditComponent implements OnInit, AfterContentInit {
    @Input() logParser: LogParser;
    @Input() isEditData: boolean = false;
    logParserRows: FormGroup;

    constructor(protected ref: NbDialogRef<LogParserEditComponent>,
                private formBuilder: FormBuilder,
                private lopParserService: LogParserService) {
    }

    ngOnInit() {
        if (this.logParser.id) {
            this.logParserRows = this.formBuilder.group({
                itemRows: this.formBuilder.array([])
            });
            this.fillFormBuilder();
            this.finalOutputHandler();
        } else {
            this.logParserRows = this.formBuilder.group({
                itemRows: this.formBuilder.array([this.initItemRows()])
            });
        }
    }

    ngAfterContentInit(): void {
    }

    fillFormBuilder() {
        const control = <FormArray>this.logParserRows.controls['itemRows'];
        for (let i = 0; i < this.logParser.totalPattern; i++) {
            let alreadyFoundRightOrder = false;
            this.logParser.logParser_crudForm_customPattern.forEach( customPat=>{
                console.log(customPat);
                if (i === parseInt(customPat.order)) {
                    console.log(customPat);
                    control.push(this.formBuilder.group({
                        itemId: [customPat.id],
                        itemParserType: [customPat.parserType],
                        itemName: [customPat.name],
                        itemPatternType: [customPat.patternType],
                        itemCustomPattern: [customPat.customPatternName],
                        itemStaticText: ['']
                    }));
                    alreadyFoundRightOrder = true;
                }
            });
            // Avoid extra loop
            if (!alreadyFoundRightOrder) {
                this.logParser.logParser_crudForm_staticPattern.forEach(staticPat=> {
                    if (i === parseInt(staticPat.order)) {
                        control.push(this.formBuilder.group({
                            itemId: [staticPat.id],
                            itemParserType: [staticPat.parserType],
                            itemName: [''],
                            itemPatternType: [''],
                            itemCustomPattern: [''],
                            itemStaticText: [staticPat.text]
                        }));
                    }
                });
            }
        }
    }

    initItemRows() {
        return this.formBuilder.group({
            itemId: [null],
            itemParserType: ['pattern'],
            itemName: [''],
            itemPatternType: ['custom'],
            itemCustomPattern: [''],
            itemStaticText: ['']
        });

    }

    addNewRow() {
        const control = <FormArray>this.logParserRows.controls['itemRows'];
        control.push(this.initItemRows());
        this.finalOutputHandler();
    }

    deleteRow(index: number) {
        const control = <FormArray>this.logParserRows.controls['itemRows'];
        control.removeAt(index);
        this.finalOutputHandler();
    }

    finalOutputHandler() {
        this.logParser.pattern = '';
        this.logParserRows.value.itemRows.forEach((element, i) => {
            if (element.itemParserType == 'pattern') {
                if (element.itemPatternType != 'custom') {
                    this.logParser.pattern = this.logParser.pattern + '%{' + element.itemPatternType + ':' + element.itemName + '}'
                } else {
                    this.logParser.pattern = this.logParser.pattern + '%{' + element.itemCustomPattern + ':' + element.itemName + '}'
                }
            } else {
                this.logParser.pattern = this.logParser.pattern + element.itemStaticText;
            }
            // %{WORD:name} is %{WORD:gender}, %{NUMBER:age} years old and weighs %{NUMBER:weight} kilograms
        })
    }

    moveUp(index: number) {
        const control = <FormArray>this.logParserRows.controls['itemRows'];
        if (control.at(index - 1)) {
            const extras = control.value;
            const newExtras = this.arraySwap(extras, index - 1, index);
            control.setValue(newExtras);
            this.finalOutputHandler();
        }

    }

    moveDown(index: number) {
        const control = <FormArray>this.logParserRows.controls['itemRows'];
        const extras = control.value;
        if (index < extras.length - 1) {
            const newExtras = this.arraySwap(extras, index, index + 1);
            control.setValue(newExtras);
            this.finalOutputHandler();
        }
    }

    arraySwap(arr: any[], index1: number, index2: number): any[] {
        arr = [...arr];
        const temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
        return arr;
    }


    dismiss() {
        this.ref.close();
    }

    save() {
        if (this.logParser.name != '') {
            // create new custom and static parsers
            this.logParser.totalPattern = 0;
            this.logParser.logParser_crudForm_customPattern.splice(0, this.logParser.logParser_crudForm_customPattern.length);
            this.logParser.logParser_crudForm_staticPattern.splice(0, this.logParser.logParser_crudForm_staticPattern.length);

            this.logParserRows.value.itemRows.forEach((element, i) => {
                this.logParser.totalPattern++;
                if (element.itemParserType == 'pattern') {
                    let customPatter = new LogParserCrudFormCustomPattern();
                    customPatter.id = element.itemId;
                    customPatter.parserType = element.itemParserType;
                    customPatter.name = element.itemName;
                    customPatter.patternType = element.itemPatternType;
                    customPatter.customPatternName = element.itemCustomPattern;
                    // we want to start from 0
                    customPatter.order = String(this.logParser.totalPattern - 1);
                    this.logParser.logParser_crudForm_customPattern.push(customPatter);
                } else if (element.itemParserType == 'static') {
                    let staticParser = new LogParserCrudFormStaticPattern();
                    staticParser.id = element.itemId;
                    staticParser.parserType = element.itemParserType;
                    staticParser.text = element.itemStaticText;
                    staticParser.order = String(this.logParser.totalPattern - 1);
                    this.logParser.logParser_crudForm_staticPattern.push(staticParser);
                }
            });

            console.log(this.logParser);
            if (this.isEditData) {
                this.lopParserService.update(this.logParser)
                    .subscribe((res: HttpResponse<LogParser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
            } else {
                this.lopParserService.create(this.logParser)
                    .subscribe((res: HttpResponse<LogParser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
            }
        }

    }

    protected onSaveSuccess() {
        this.ref.close('true');
    }

    protected onSaveError() {
        console.log('Log Parser saving error');
    }

}
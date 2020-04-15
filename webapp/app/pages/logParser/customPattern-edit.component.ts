import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {CustomPattern} from "./customPattern.model";
import {CustomPatternService} from "./customPattern.service";

@Component({
    selector: 'app-jasonParserEdit',
    templateUrl: './customPattern-edit.component.html',
})
export class CustomPatternEditComponent implements OnInit, AfterContentInit {
    @Input() customPattern: CustomPattern;
    @Input() isEditData: boolean = false;

    constructor(protected ref: NbDialogRef<CustomPatternEditComponent>,
                private customPatternService: CustomPatternService) {
    }

    ngOnInit() {
    }

    ngAfterContentInit(): void {
    }


    dismiss() {
        this.ref.close();
    }

    save() {
        if (this.customPattern.name != '' && this.customPattern.pattern != '') {
            this.customPattern.name = this.customPattern.name.toLocaleUpperCase();
            if (this.isEditData) {
                this.customPatternService.update(this.customPattern)
                    .subscribe((res: HttpResponse<CustomPattern>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
            } else {
                this.customPatternService.create(this.customPattern)
                    .subscribe((res: HttpResponse<CustomPattern>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
import {
    AfterContentInit,
    Compiler,
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Input,
    ModuleWithComponentFactories,
    NgModule,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {JasonParser, JasonParserAlias} from "./jasonParser.model"
import {JasonParserService} from "./jasonParser.service";
import {JasonParserUtil} from "../../core/utils/jasonParser/jasonParser";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

@Component({
    selector: 'app-logParserEdit',
    templateUrl: './jasonParser-edit.component.html',
})
export class JasonParserEditComponent implements OnInit, AfterContentInit {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    @Input() jasonParser: JasonParser;
    @Input() isEditData: boolean = false;

    // jasonInput: any = '';
    objectsParentsNodeKey: string = '';
    totalInputsNumber: number = 0;
    template: string;
    private componentRef: ComponentRef<{}>;

    // index number <-> jason path
    private keyPathIndexMap: Map<number, string>;

    // jason path <-> html input Value
    public keyPathValueMap: Map<string, string> = new Map<string, string>();

    constructor(protected ref: NbDialogRef<JasonParserEditComponent>,
                private componentFactoryResolver: ComponentFactoryResolver,
                private compiler: Compiler,
                private jasonParserService: JasonParserService) {
    }

    ngOnInit() {
        this.jasonParserService.jasonDataBetweenDynamicComponentAndParrent.subscribe((message: Map<string, string>) => {
            this.keyPathValueMap = new Map<string, string>(message);
        });
    }

    ngAfterContentInit(): void {
        if (this.jasonParser.id != null) {
            this.jasonParser.jason_alias.forEach(alias => {
                this.keyPathValueMap.set(alias.path, alias.name)
            });
            this.createJson();
        }
    }


    dismiss() {
        this.ref.close();
    }

    save() {
        if (this.jasonParser.name != '' && this.jasonParser.jason != '') {
            //apply new value to alias
            let all_alias_instances: JasonParserAlias[] = this.jasonParser.jason_alias;
            this.jasonParser.jason_alias.splice(0, this.jasonParser.jason_alias.length);
            console.log(this.jasonParser);
            this.keyPathValueMap.forEach((inputVal, path) => {
                if (inputVal !== null && inputVal !== '') {
                    console.log(inputVal);
                    console.log(all_alias_instances);
                    let alias: any;
                    let isAliasExist = false;
                    for (alias in all_alias_instances) {
                        if (alias.path === path) {
                            isAliasExist = true;
                            alias.name = inputVal;
                            break;
                        }
                    }
                    if (!isAliasExist) {
                        this.jasonParser.jason_alias.push(new JasonParserAlias(null, inputVal, path));
                    }
                }
            });
            if (this.isEditData) {
                this.jasonParserService.update(this.jasonParser)
                    .subscribe((res: HttpResponse<JasonParser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
            } else {
                this.jasonParserService.create(this.jasonParser)
                    .subscribe((res: HttpResponse<JasonParser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
            }
        }
    }

    protected onSaveSuccess() {
        this.ref.close('true');
    }

    protected onSaveError() {
        console.log('Jason Parser saving error');
    }

    createJson() {
        this.totalInputsNumber = 0;
        this.findJsonKeyPath(JSON.parse(this.jasonParser.jason));
        this.template = '<ul id="json_container" class="json_container" #json_container style="margin: 15px;">\n' + this.json2html(JSON.parse(this.jasonParser.jason), "expanded") + '\n</ul>';
        this.compileTemplate();
    }

    findJsonKeyPath(jsonData) {
        let jasonParserUtil = new JasonParserUtil();
        this.keyPathIndexMap = new Map<number, string>();
        jasonParserUtil.getAllKeys(jsonData).forEach((value: string, key: number) => {
            this.keyPathIndexMap.set(key, jasonParserUtil.getJasonPath(jsonData, value, key));
            if(this.keyPathValueMap.get(jasonParserUtil.getJasonPath(jsonData, value, key)) === null || this.keyPathValueMap.get(jasonParserUtil.getJasonPath(jsonData, value, key)) === undefined){
                this.keyPathValueMap.set(jasonParserUtil.getJasonPath(jsonData, value, key), '');
            }
        });
    }

    json2html(json, expanderClasses) {
        if (json !== '') {
            let html = '';
            for (let key in json) {
                if (!json.hasOwnProperty(key)) {
                    continue;
                }
                let value = json[key], type = typeof json[key];
                html = html + this.createElement(key, value, type, expanderClasses);
            }
            return html;
        }
    }

    createElement(key, value, type, expanderClasses) {

        let klass = 'object',
            open = '{{ "{" }}',
            close = '{{ "}" }}';
        if (value instanceof Array) {
            klass = 'array';
            open = '[';
            close = ']';
        }
        if (value === null) {
            return '<li><span class="key">"' + this.encode(key) + '": </span><span class="null">"' + this.encodeVal(key) + '"</span></li>';
        }

        switch (type) {
            case 'object':
                var object = '<li><span class="' + expanderClasses + '"></span><span class="key">"' + this.encode(key) + '": </span>     <span>' + this.encodeValExeptipns(key) + '</span>      <span class="jsonOpen">' + open + '</span> <ul class="' + klass + '">';
                object = object + this.json2html(value, expanderClasses);
                return object + '</ul><span class="jsonClose">' + close + '</span></li>';
                break;
            // case 'number':
            case 'boolean':
                return '<li><span class="key">"' + this.encode(key) + '": </span><span class="' + type + '">' + this.encodeVal(key) + '</span></li>';
            default:
                return '<li><span class="key">"' + this.encode(key) + '": </span><span class="' + type + '">"' + this.encodeVal(key) + '"</span></li>';
                break;
        }
    }

    encode(value) {
        return value;
    }

    encodeVal(value) {
        ++this.totalInputsNumber;
        let tempVal = "'" + this.keyPathIndexMap.get(this.totalInputsNumber) + "'";

        console.log('++++++ +++++++++++++++++++++');
        console.log(this.keyPathIndexMap.get(this.totalInputsNumber));
        console.log(this.keyPathValueMap);
        console.log(this.keyPathValueMap.get(this.keyPathIndexMap.get(this.totalInputsNumber)));
        // if (this.objectsParentsNodeKey == '') {
        return '<input type="text" class="form-control" name="model' + String(this.totalInputsNumber) + '" (input)="changeValue(' + tempVal + ',$event)"  placeholder="" value="' + this.keyPathValueMap.get(this.keyPathIndexMap.get(this.totalInputsNumber)) + '" style="display: inline;width: 121px;font-size: 13px;line-height: 1.2;font-family: monospace;height: 36px;" > ' +
            '<h6 class="jsonAlias" style="font-family: monospace; font-size: 12px"> ' + tempVal + '</h6>';
        // } else {
        //     return '<input type="text" class="form-control" name="model' + String(this.totalInputsNumber) + '" (input)="changeValue(' + tempVal + ',$event)"  placeholder="Parser Name" style="display: inline;width: 121px;font-size: 13px;line-height: 1.2;font-family: monospace;height: 36px;" > ' +
        //         '<h6 class="jsonAlias" style="font-family: monospace; font-size: 12px"> ' + tempVal + '</h6>';
        // }

    }

    encodeValExeptipns(value) {
        if (!isNaN(value)) {
            // this.objectsParentsNodeKey = value;
            return '';
        }
        ++this.totalInputsNumber;
        let tempVal = "'" + this.keyPathIndexMap.get(this.totalInputsNumber) + "'";
        // if (this.objectsParentsNodeKey == '') {
        return '<input type="text" class="form-control" name="model' + String(this.totalInputsNumber) + '" (input)="changeValue(' + tempVal + ',$event)"  placeholder="" value="' + this.keyPathValueMap.get(this.keyPathIndexMap.get(this.totalInputsNumber)) + '" style="display: inline;width: 121px;font-size: 13px;line-height: 1.2;font-family: monospace;height: 36px;" > ' +
            '<h6 class="jsonAlias" style="font-family: monospace; font-size: 12px"> ' + tempVal + '</h6>';
        // }
        // else {
        //     return '<input type="text" class="form-control" name="model' + String(this.totalInputsNumber) + '" (input)="changeValue(' + tempVal + ',$event)"  placeholder="Parser Name" style="display: inline;width: 121px;font-size: 13px;line-height: 1.2;font-family: monospace;height: 36px;" > ' +
        //         '<h6 class="jsonAlias" style="font-family: monospace; font-size: 12px"> ' + tempVal + '</h6>';
        // }
    }


    compileTemplate() {

        let metadata = {
            selector: `runtime-component-sample`,
            template: this.template,
        };

        let factory = this.createComponentFactorySync(this.compiler, metadata, null);

        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
        this.componentRef = this.container.createComponent(factory);
    }

    private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
        // const cmpClass = componentClass || class RuntimeComponent {
        const cmpClass = class RuntimeComponent {
            jasonPathValueMap: Map<string, string>;
            jasonParserService: JasonParserService;

            changeValue(key, evt) {
                this.jasonPathValueMap.set(key.toString(), evt.target.value);
                this.jasonParserService.updateJasonDataBetweenAllSharedComponents(this.jasonPathValueMap);
            }
        };
        const decoratedCmp = Component(metadata)(cmpClass);
        decoratedCmp.prototype.jasonParserService = this.jasonParserService;
        decoratedCmp.prototype.jasonPathValueMap = new Map<string, string>(this.keyPathValueMap);

        @NgModule({imports: [CommonModule, FormsModule], declarations: [decoratedCmp]})
        class RuntimeComponentModule {
        }

        let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
        return module.componentFactories.find(f => f.componentType === decoratedCmp);
    }


}
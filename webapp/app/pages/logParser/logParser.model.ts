export class LogParser {
    constructor(public id?: string,
                public name?: string,
                public pattern?: string,
                public totalPattern?: number,
                public logParser_crudForm_customPattern?: LogParserCrudFormCustomPattern[],
                public logParser_crudForm_staticPattern?: LogParserCrudFormStaticPattern[],
    ) {
        this.id = id ? id : null;
        this.name = name ? name : '';
        this.pattern = pattern ? pattern : '';
        this.totalPattern = totalPattern ? totalPattern : 0;
        this.logParser_crudForm_customPattern = logParser_crudForm_customPattern ? logParser_crudForm_customPattern : [];
        this.logParser_crudForm_staticPattern = logParser_crudForm_staticPattern ? logParser_crudForm_staticPattern : [];
    }
}

export class LogParserCrudFormCustomPattern {
    constructor(public id?: string,
                public order?: string,
                public parserType?: string,
                public name?: string,
                public patternType?: string,
                public customPatternName?: string,
    ) {
        this.id = id ? id : null;
        this.order = order ? order : '';
        this.parserType = parserType ? parserType : '';
        this.name = name ? name : '';
        this.patternType = patternType ? patternType : '';
        this.customPatternName = customPatternName ? customPatternName : '';
    }
}

export class LogParserCrudFormStaticPattern {
    constructor(public id?: string,
                public order?: string,
                public parserType?: string,
                public text?: string,
    ) {
        this.id = id ? id : null;
        this.order = order ? order : '';
        this.parserType = parserType ? parserType : '';
        this.text = text ? text : '';
    }
}

export class JasonParser {
    constructor(public id?: string,
                public name?: string,
                public jason?: string,
                public jason_alias?: JasonParserAlias[]
    ) {
        this.id = id ? id : null;
        this.name = name ? name : '';
        this.jason = jason ? jason : '';
        this.jason_alias = jason_alias ? jason_alias : []
    }
}

export class JasonParserAlias {
    constructor(public id?: string,
                public name?: string,
                public path?: string,
    ) {
        this.id = id ? id : null;
        this.name = name ? name : '';
        this.path = path ? path : '';
    }
}

export class JasonParserVM {
    constructor(public id?: string,
                public name?: string,
                public jason?: string,
                public jason_alias?: string
    ) {
        this.id = id ? id : null;
        this.name = name ? name : '';
        this.jason = jason ? jason : '';
        this.jason_alias = jason_alias ? jason_alias : ''
    }
}

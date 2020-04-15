export class CustomPattern {
    constructor(public id?: string,
                public name?: string,
                public pattern?: string,
    ) {
        this.id = id ? id : null;
        this.name = name ? name : '';
        this.pattern = pattern ? pattern : '';
    }
}

export class SrcElement {
    constructor(public name?: string,
                public level?: string,
                public kind?: string,
                public startPoint?: string,
                public endPoint?: string,
                public localElements?: SrcElement[],
                public foreignElements?: SrcElement[],
    ) {
        // this.id = id ? id : null;
        this.name = name ? name : '';
        this.level = level ? level : '';
        this.kind = kind ? kind : '';
        this.startPoint = startPoint ? startPoint : '';
        this.endPoint = endPoint ? endPoint : '';
        this.localElements = localElements ? localElements : [];
        this.foreignElements = foreignElements ? foreignElements : [];

    }
}




export class SrcCode {
    constructor(public code?: string,){
        this.code = code ? code : '';
    }
}
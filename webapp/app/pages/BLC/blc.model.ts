export class Position {
    constructor(public x?: number,
                public y?: number,
    ) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
}
export class Car {
    constructor(public id?: string,
                public position?: Position,
                public uuid?: string,
    ) {
        this.id = id ? id : '';
        this.position = position ? position : new Position(0,0);
        this.uuid = uuid ? uuid : '';
    }
}
export class Pedestrian {
    constructor(public id?: string,
                public position?: Position,
                public uuid?: string,
    ) {
        this.id = id ? id : '';
        this.position = position ? position : new Position(0,0);
        this.uuid = uuid ? uuid : '';
    }
}



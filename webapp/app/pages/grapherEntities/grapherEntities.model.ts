import {LogParser} from "../logParser/logParser.model";

export class GrapherEntities {
    constructor(public id?: string,
                public name?: string,
                public jasonData?: string,
                public logParser_list?: LogParser[]
    ) {
        this.id = id ? id : null;
        this.name = name ? name : '';
        this.jasonData = jasonData ? jasonData : '';
        this.logParser_list = logParser_list ? logParser_list : []
    }
}
export class JasonParserUtil {

    public allKeyArr : Map<number,string>;
    public key: any;
    public path: string;
    public searchKeyindex: number;
    private searchKeyIndexInJason = 0;

    constructor() {
    }

    getAllKeys(obj): Map<number,string> {
        this.allKeyArr = new Map<number, string>();
        this.searchKeyIndexInJason = 0;
        this.getKeyRecursive(obj);
        return this.allKeyArr;
    }

    getJasonPath(object, search, searchKeyIndex:number) {
        this.key = search;
        this.path = '';
        this.searchKeyindex = searchKeyIndex;
        this.searchKeyIndexInJason = 0;
        this.iterRec(object, []);
        return this.path;
    }

    private iterRec(obj, pth) {
        return Object.keys(obj).some((kkey: any)=>{
            if (!isNaN(kkey) && typeof obj[kkey] != 'object') {
                ++this.searchKeyIndexInJason;
                if (kkey === this.key && this.searchKeyindex === this.searchKeyIndexInJason) {
                    var standardPath = '';
                    for (let str of pth) {
                        if (isNaN(str) && pth.indexOf(str) > 0) {
                            standardPath += '.' + str
                        } else if (isNaN(str) && pth.indexOf(str) == 0) {
                            standardPath += str
                        } else {
                            standardPath += '[' + str + ']'
                        }
                    }
                    /*
                    if we want one of the root element
                        {
                        timestamp: bla_bla
                        }
                    the output would be ".timestamp" with extra "." so below "if" is to remove this dot
                    */
                    if (pth.length > 0) {
                        this.path = standardPath + '.' + kkey;
                    } else {
                        this.path = standardPath + kkey;
                    }
                    return true;
                }
            }
            if (isNaN(kkey)) {
                ++this.searchKeyIndexInJason;
                if (kkey === this.key && this.searchKeyindex === this.searchKeyIndexInJason) {
                    var standardPath = '';
                    for (let str of pth) {
                        if (isNaN(str) && pth.indexOf(str) > 0) {
                            standardPath += '.' + str
                        } else if (isNaN(str) && pth.indexOf(str) == 0) {
                            standardPath += str
                        } else {
                            standardPath += '[' + str + ']'
                        }
                    }
                    /*
                    if we want one of the root element
                        {
                        timestamp: bla_bla
                        }
                    the output would be ".timestamp" with extra "." so below "if" is to remove this dot
                    */
                    if (pth.length > 0) {
                        this.path = standardPath + '.' + kkey;
                    } else {
                        this.path = standardPath + kkey;
                    }
                    return true;
                }
            }
            if (obj[kkey] !== null && typeof obj[kkey] === 'object') {
                return this.iterRec(obj[kkey], pth.concat(kkey));
            }
        });
    }


    private getKeyRecursive(obj) {
        try {
            if (typeof obj !== 'object') {
                return;
            }
            let key: any;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var v = obj[key];
                    if (!isNaN(key) && typeof v != 'object') {
                        ++this.searchKeyIndexInJason;
                        this.allKeyArr.set(this.searchKeyIndexInJason, key.toString());
                    }
                    if (isNaN(key)) {
                        ++this.searchKeyIndexInJason;
                        this.allKeyArr.set(this.searchKeyIndexInJason, key.toString());
                    }
                    this.getKeyRecursive(v);
                }
            }
        } catch (e) {
            console.log(e.message);
        }
    }


}

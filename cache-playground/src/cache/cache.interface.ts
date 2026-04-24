export interface ReadStrategy{
    get(key:string,fetcher:()=>Promise<any>):Promise<any>;
}

export interface WriteStategy{
    write(key:string,data:any,dbWrite:()=>Promise<any>):Promise<any>;
}

export interface InvalidationStrategy{
    invalidate(key:string):Promise<void>;
}




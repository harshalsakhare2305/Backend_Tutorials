export interface ReadStrategy{
    get(key:string,fetcher:()=>Promise<any>):Promise<any>;
}


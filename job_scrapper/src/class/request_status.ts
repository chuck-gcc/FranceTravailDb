import fs from "fs";

export class ReqStatus  
{
    status:number
    status_txt:string;
    date: Date;
    range: [number, number, number];
    url: string | undefined;
    departement:string;

    constructor(status:number, status_txt:string,date: Date,range: [number, number, number],departement:string,url : string  | undefined)
    {
        {
            this.status = status;
            this.status_txt = status_txt;
            this.date = date;
            this.range = range;
            this.url =  url 
            this.departement = departement;
        }
    }
    save()
    {
        fs.writeFileSync(`./data/${this.departement}/status.json`, JSON.stringify(this, null, 2) + "\n", { flag: 'a' })
    }
}
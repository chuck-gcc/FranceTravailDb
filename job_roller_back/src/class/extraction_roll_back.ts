import { Token} from "../../token/token";
import axios from "axios";
import { exit} from "process";
import { Extract_date_roll_back } from "./date_roll_back";
import fs from "fs";



export class Extract_day
{
    total_size_day: number;
    token: Token;
    size_range: number;
    url_promise: string [] | null;
    departement: string;
    complet_batch: number;
    incomplet_batch: number;
    obj_date: Extract_date_roll_back;
    header_status: number;

    constructor(token: Token, departement: string, obj_date: Extract_date_roll_back)
    {
        this.token = token;
        this.departement = departement;
        this.url_promise = [];
        this.obj_date = obj_date;
        this.total_size_day = 0;
        this.size_range = 0;
        this.complet_batch = 0;
        this.incomplet_batch = 0;
        this.header_status = 0;
    }
    async get_header_data()
    {
        const res = await axios.get("https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search",
        {
            headers:{
                Authorization: `Bearer ${this.token.access_token}`
            },
            params:{
                departement:this.departement,
                // max == right min == letf
                minCreationDate: this.obj_date.dateLeft.toISOString().split('.')[0] + 'Z',
                maxCreationDate: this.obj_date.dateRight.toISOString().split('.')[0] + 'Z'
            },

        }).then((reponse) => {

            if(reponse.status == 200 || reponse.status == 206)
            {      
                this.header_status = 1; 
                this.total_size_day = Number(reponse.headers['content-range'].split('/')[1]);
                this.size_range = Number(reponse.headers['content-range'].split('/')[0].split('-')[1]);
                if(this.total_size_day > 0 && this.size_range > 0)
                {
                    this.complet_batch = Math.trunc(this.total_size_day / this.size_range);
                    if(this.total_size_day > 149)
                        this.incomplet_batch = this.total_size_day %  this.size_range;
                    else
                        this.incomplet_batch = 0;
                }
            }
            else
            {
                this.header_status = 0;
               
            }

        }).catch(function (err) {

            if(err.reponse)
            {
                fs.writeFileSync("error-2", JSON.stringify(err.response.headers,null,2));
                exit(110);  
            }
        })
    }
    create_promise_url()
    {
        if(this.header_status == 0)
                return;
        const url_base: string = "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search";
        let first_page = 0;
        let last_page = first_page + this.size_range;

        /*
            range loop from --> to 0-149, 150-299 ...
        */
        // console.log(`\nNombre d'annonce pour le departement ${this.departement}: ${this.total_size_day}`);
        // console.log(`${this.complet_batch} batch complet de ${this.size_range} annonces`);
        // console.log(`1 batch incomplet de  ${this.incomplet_batch} annonce\n`);

        //assert(this.complet_batch * this.size_range + this.incomplet_batch == this.total_size_day)

        for(let i = 0; i < this.complet_batch; i++)
        {
            const range_param = `${String(first_page)}-${String(last_page)}`
            const construct_url  = `${url_base}?range=${range_param}&departement=${this.departement}&minCreationDate=${this.obj_date.dateLeft.toISOString().split('.')[0] + 'Z'}&maxCreationDate=${this.obj_date.dateRight.toISOString().split('.')[0] + 'Z'}`;
            this.url_promise?.push(construct_url);
            //console.log(range_param);
            /*
                incrementation part: x * size_range + 1 * incomplet batch
            */
            
            first_page += this.size_range + 1;
            //dinamique adjustment last page
            if(i == this.complet_batch - 1)
                last_page += (this.incomplet_batch -  this.complet_batch) + 1;
            else
                last_page += this.size_range + 1;
        }
        if(this.incomplet_batch > 0 && first_page < last_page)
        {
            const range_param = `${String(first_page)}-${String(last_page)}`
            const construct_url  = `${url_base}?range=${range_param}&departement=${this.departement}`;
            this.url_promise?.push(construct_url);
        }
       
    }
    display()
    {
        console.log(`\n°Total size: ${this.total_size_day}`);
        console.log(`°Range: ${this.size_range}`);
        console.log(`°Complet batch: ${this.complet_batch} * ${this.size_range}`);
        console.log(`incomplete batch: 1 * ${this.incomplet_batch}`);
        console.log(`${this.size_range} * ${this.complet_batch} + ${this.incomplet_batch}\n`, this.size_range * this.complet_batch + this.incomplet_batch)
    }
    display_url()
    {
        if(this.url_promise)
            for(const ur of this.url_promise)
                console.log(ur);
    }
    get_promise_len()
    {
        return console.log(this.url_promise?.length);
    }
    reinit(token: Token, departement: string, obj_date: Extract_date_roll_back)
    {
        this.token = token;
        this.departement = departement;
        this.url_promise = [];
        this.obj_date = obj_date;
        this.total_size_day = 0;
        this.size_range = 0;
        this.complet_batch = 0;
        this.incomplet_batch = 0;
    }

}
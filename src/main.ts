import { Token, getToken } from "../token/token";
import dotenv from "dotenv"
import axios from "axios";
import { promises as fs } from 'fs';
import {Extract_date_roll_back} from "./class/date_roll_back"
import {Extract_day} from "./class/extraction_roll_back"
import {sleep} from "./utils/utils"


//try catch here    
async function extract_day_job(token: Token, roller_date:Extract_date_roll_back, roller: Extract_day )
{
    
    /* 
        make first request oonly for header now. 
        Optimisation is possible with saving the first call who de objectif is to get information about day dta
    */
    
    if(roller.url_promise)
    {
        const res  =  roller.url_promise.map(ur => {
            return axios.get(ur, {
                headers: {
                    Authorization: `Bearer ${token.access_token}`
                }
            })
        })

        // const r = (await axios.all(res))
        // .forEach((res, i) => {
        //     console.log(`Réponse ${i + 1}:`, res.statusText);
        //     /*
        //         file systeme managment. departement/date/date-range-batch_size-total_size
        //     */
        // const creation_date = roller.obj_date.dateRight.toISOString();
        //     if(!fs.existsSync(`./data/${roller.departement}`))
        //         fs.mkdirSync('./data/'+roller.departement)
        //     if(!fs.existsSync(`./data/${roller.departement}/${creation_date}`))
        //         fs.mkdirSync(`./data/${roller.departement}/${creation_date}`)
        //     fs.writeFileSync(`./data/${roller.departement}/${creation_date}/${creation_date}-${i}`, JSON.stringify(res.data, null, 2));
        // });
    }
}


async function departement_worker( departement: string, from: Date, to: Date) {


    const token: Token | null = await getToken();
    if(!token)
    {
        console.log("Error token\n");
        return;
    }
    const one_day = 1000 * 60  * 60 * 24;
    const range_ms = from.getTime() - to.getTime();
    const range_size = Math.round(range_ms / one_day);
    let idx = 1

    const date_roller = new Extract_date_roll_back();
    const roller: Extract_day | null = new Extract_day(token,departement,date_roller);

    //range size = how many day back
    while(idx < range_size)
    {
        console.log(`Iteration ${idx}`);
        await roller.get_header_data();
        roller.create_promise_url()
        
        if(roller.header_status == 1)
        {
            await extract_day_job( token,  date_roller, roller);

        }
        console.log("size of day ", roller.total_size_day)
        if(roller.total_size_day > 1000)
            await sleep(10000);
        else if(roller.total_size_day > 800)
            await sleep(5000);
        else
            await sleep(500);

        date_roller.set_new_date();
        roller.reinit(token,departement,date_roller);
        idx++;
    }
}

async function run_extraction(departement:string)
{
    
    dotenv.config();

    
    const from = new Date();
    const to = new Date();
    const day_range = 3;

    //from.setDate(from.getDate() - 1);
    to.setDate(from.getDate() - day_range);
    console.log("from : " + from.toISOString() + " To: ", to.toISOString(),` for department: ${departement}`);
    await departement_worker(departement, from, to)
}


function get_departement(dep: number): string
{   

    if(dep < 10)
        return( '0' + dep);
    else if(dep == 200)
        return("2a")
    else if(dep == 201)
        return("2b");
    else if(dep > 95)
        return(String(dep + 875))
    return(String(dep));
}

async function get_good_folder_day(date: Date, departement: string): Promise<string | undefined>
{
    const dirr = "./data/" + departement;
    const files = await fs.readdir(dirr.toString());
    const file = files.find((f) => f.split("T",2)[0] == date.toISOString().split("T",2)[0] )
    console.log("file: " + file);
    return (file);
}

async function main(argv: number)
{
    let i = 13;
    let corse = 0;
    let departement;
    let date = new Date();

    if(argv)
    {
        console.log("argv == 10");
        console.log("La date est " + date.toISOString());
        let path: string | undefined =  await get_good_folder_day(date,"74");
        console.log("le folder de travail est: " + path);
    }
    else
    {
        while(i <= 101)
        {
            console.log("start");
            if(i == 20)
            {
                if(corse == 0)
                {
                    departement = get_departement(200);
                    corse = 1;
                    continue;
                }
                else
                {
                    console.log("departement: ", get_departement(201))
                    departement = get_departement(201);
                    i++;
                    continue;
                }
            }
            // departement = get_departement(i);
            // await run_extraction(departement);

            i++;
            
        }
        departement = get_departement(74);
        await run_extraction(departement);
    }
    
}

main(1);
import { Token, getToken } from "../token/token";
import dotenv from "dotenv"
import axios from "axios";
import fs from 'fs';
import {Extract_date_roll_back} from "./class/date_roll_back"
import {Extract_day} from "./class/extraction_roll_back"
import {sleep} from "./utils/utils"


//try catch here    

async function process_promises(roller: Extract_day, token: Token, idx: number) {
    
    //console.log(roller.url_promise)

    // try catch here
    
    try {
        const res  =  roller.url_promise?.map(ur => {
            return axios.get(ur, {
                headers: {
                    Authorization: `Bearer ${token.access_token}`
                }
            })
        })
        if(res)
        {
            const r = await Promise.all(res)
            r.forEach((res, i) => {
                //console.log(`Réponse ${roller.counter + 1}:`, res.statusText);
                /*
                    file systeme managment. departement/date/date-range-batch_size-total_size
                */
                const creation_date = roller.obj_date.dateRight.toISOString();
                if(!fs.existsSync(`/home/cc/Documents/france_travail_worker/data/${roller.departement}`))
                    fs.mkdirSync('/home/cc/Documents/france_travail_worker/data/'+roller.departement)
                fs.writeFileSync(`/home/cc/Documents/france_travail_worker/data/${roller.departement}/${creation_date}-${roller.counter}`, JSON.stringify(res.data, null, 2));
                roller.counter++;
            });
        }
    } catch (e)
    {
        console.log("Error")
    }
    
}

function split_promise_arr(promises: string[])
{
    let i = 0;
    const max_size_batch = 8
    const len = promises.length;
    let result = []
    while(promises.length > 0)
    {
        let j = 0;
        let res = [];
        while (j < max_size_batch && promises.length > 0)
        {
            res.push(promises[0])
            promises.shift()
            j++;
        }
        result.push(res);
    }
    return(result)
}

async function extract_day_job(token: Token, roller: Extract_day )
{
    
    /* 
        make first request oonly for header now. 
        Optimisation is possible with saving the first call who de objectif is to get information about day dta
    */
    

    /* 
        probleme, parfois le nombre de promise est trop grand generant une erreur 429 de la part du serveur
        limite: 10 promise de 150 annonce

        solution: spliter le tableau de promises
    
    */
   if(roller.url_promise)
    {
        //roller.url_promise = roller.url_promise.slice(0,10);
        // Si le nombre d'url promise est plus petit ou egal a 10 , traiter dirrectement le tableau de promesse. sinon spliter le tableau
        if(roller.url_promise.length > 0 && roller.url_promise.length <= 8)
            await process_promises(roller, token, 1);
        else
        {

            //here
            let splited_arr: string[][];
            splited_arr = split_promise_arr(roller.url_promise);
            let i = 0
            while (i < splited_arr.length)
            {
                //console.log("split", splited_arr[i])
                roller.url_promise = splited_arr[i];
                await process_promises(roller, token, i);
                await sleep(800)
                i++;
            }
        }
    }
}


async function departement_worker( departement: string) {


    const token: Token | null = await getToken();
    if(!token)
    {
        console.log("Error token\n");
        return;
    }
   
    const date_roller = new Extract_date_roll_back();
    const roller: Extract_day | null = new Extract_day(token,departement,date_roller);

    //range size = how many day back
    await roller.get_header_data();
    
    roller.create_promise_url()
    if(roller.header_status == 1)
        await extract_day_job( token, roller);
    await sleep(400);

}

async function run_extraction(departement:string)
{
    
    dotenv.config();
    await departement_worker(departement)
}


function get_departement(dep: number): string
{   

    if(dep < 10)
        return( '0' + dep);
    else if(dep == 200)
        return("2A")
    else if(dep == 201)
        return("2B");
    else if(dep > 95)
        return(String(dep + 875))
    return(String(dep));
}

async function main(argv: number)
{
    let i = 1;
    let corse = 0;
    let departement;

    console.log("start");
    if(argv == 0)
    {
        departement = get_departement(69);
        await run_extraction(departement);
        return ;
    }
    while(i <= 101)
    {
        if(i == 20)
        {
            
            if(corse == 0)
            {
                departement = get_departement(200);
                console.log(get_departement(200))
                corse = 1;
                await run_extraction(departement);
                continue;
            }
            else
            {
                console.log(get_departement(201))
                departement = get_departement(201);
                await run_extraction(departement);
                i++;
                continue;
            }
        }
        departement = get_departement(i);
        await run_extraction(departement);
        console.log(departement)
        i++;
    }
}

main(1);
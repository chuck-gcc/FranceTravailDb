import http, { createServer } from 'http'
import fs from "fs"

function server()
{
    const en_cour: number[] = [];

    createServer((req, res) => {
        
        const url = new URL(req.url!,  `http://${req.headers.host}`)
        res.end(JSON.stringify({ message: "Extraction démarrée " , success: true }));
        console.log("message recu on serveur side");
        const departement = url.searchParams.get('departement');
        if(en_cour.indexOf(Number(departement)) != -1)
            console.log("Deparment deja en cour de traitement");
        else
        {
            console.log("Ajout du departement en cour")
            en_cour.push(Number(departement))
            console.log(en_cour);

        }
        en_cour.splice(en_cour.indexOf(Number(departement), 1))
        console.log("fin de traitement du departement");
        console.log(en_cour);
    }).listen(8080, () => {
        console.log("serveur a l'ecoute");
    })
}

async function main()
{
    
    const data =  await fs.openAsBlob("./data/obj.json");
    console.log(data['size']);
}

main();
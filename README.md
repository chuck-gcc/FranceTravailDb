# France Travail job warehouse data

![Alt text](/doc/general_structure.png)


Cette outils extrait les offres d'emploi du jours par departement à travers l'api de france travail.
Il est composé de trois module: un job scrapper en typescript, une machine de traitement en python et une data base sqlite.


Les batch d'annonce calibré d'apres les restriction api sont stoker d'apres la strucnture:

```
    {
    "resultat": [
            {obj},
            {obj},
            {obj},
            {obj},
        ]
    }
```
Chaque object est controlé et stocker dans la base de donnée au format Bytes.


# Job scrapper

``` bash

cd job_scrapper
npm install
npm run dev

```
# processing machine

``` bash

cd processing machine
python3 processing machine.py

```




# France Travail job for warehouse data

![Alt text](/doc/general_struct.png)


Cet outil permet d’extraire les offres d’emploi quotidiennes par département à travers l’API de France Travail.
Il est composé de trois modules principaux :

+ Job Scraper → collecte les annonces via l’API (TypeScript).

+ Processing Machine → traite et nettoie les données (Python).

+ SQLite Database → stocke les annonces au format bytes.

📂 Structure des batchs

Les annonces, calibrées selon les restrictions de l’API, sont stockées dans des fichiers JSON de la forme :

```
{
    "resultat": [
        {obj},
        {obj},
        {obj},
        {obj}
    ]
}
```

Chaque objet est contrôlé puis inséré dans la base de données SQLite.

# 🚀 Installation & Exécution

## job_scrapper (TypeScript)


```bash
cd job_scrapper

```
Creer un fichier .env et renseigner les clé api et scope

``` bash
CLIENT_ID=xxxxx
CLIENT_SECRET=xxxxx
SCOPES_API= o2dsoffre api_offresdemploiv2

```

``` bash

npm install
npm run dev

```

or 

``` makefile
    make data
```

## Processing Machine (Python)

``` bash

cd processing machine
python3 processing machine.py

```

or 

``` makefile
    make sort
```

# 🛠️ Technologies utilisées

TypeScript / Node.js → collecte et appels API

Python → traitement et transformation des données

SQLite → stockage local léger et rapide
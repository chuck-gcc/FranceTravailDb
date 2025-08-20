# France Travail job warehouse data

![Alt text](/doc/general_structure.png)


Cet outil permet d’extraire les offres d’emploi quotidiennes par département à travers l’API de France Travail.
Il est composé de trois modules principaux :

+ Job Scraper → collecte les annonces via l’API (TypeScript).

+ Processing Machine → traite et nettoie les données (Python).

+ SQLite Database → stocke les annonces au format bytes.

📂 Structure des batchs

Les annonces, calibrées selon les restrictions de l’API, sont stockées dans des fichiers JSON de la forme :

{
    "resultat": [
        {obj},
        {obj},
        {obj},
        {obj}
    ]
}

Chaque objet est contrôlé puis inséré dans la base de données SQLite.

# 🚀 Installation & Exécution

## job_scrapper (TypeScript)

``` bash

cd job_scrapper
npm install
npm run dev

```
## Processing Machine (Python)

``` bash

cd processing machine
python3 processing machine.py

```

# 🛠️ Technologies utilisées

TypeScript / Node.js → collecte et appels API

Python → traitement et transformation des données

SQLite → stockage local léger et rapide
# France Travail job warehouse data

![Alt text](/doc/general_structure.png)


Cette outils extrait les offres d'emploi du jours par departement à travers l'api de france travail.
Il est composé de trois module: un job scrapper en typescript, une machine de traitement en python et une data base sqlite.

{
    J'aime typage fort de typescript pour la communication avec les api
    J'ai choisie de traiter les donner avec python pour la pratique du language
    Sqlite ma semblé etre la solution la plus simple et efficasse pour entreposer les offres 
}




actual time scraping:           2 min 13. Amelioration : mutiplier le nombre de cle api and passer en mode stream? ecouter le flux
actual time manage offers:      4min12??? wdf (amelioration potentiel: reduire les apelle is_on_bd. Telecharger La table une seule fois et utiliser une methode filtre sur la table)

# Global structure

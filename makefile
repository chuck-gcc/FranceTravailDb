OBJS_METIER = src/data/rome_metiers/**/* 
OBJS_COMP = src/data/rome_competences/**/*
NAME= offres_emploi
ORIGIN =  $(shell git branch --show-current)
COM=default_push
NPM   := /home/cc/.nvm/versions/node/v22.18.0/bin/npm
NODE  := /home/cc/.nvm/versions/node/v22.18.0/bin/node
SORTER_NAME = sorting_machine.py

git: aclean

	git add . 
	git commit -m $(COM) 
	git push origin $(ORIGIN)

clean:
	rm -rf data/*
	rm -rf sorting_machine/__pycache__

cleandb:
	rm -f db/annonces.db

fclean: clean cleandb
	
aclean: clean 
	rm -rf /job_scrapper/node_modules

data:
	cd /home/cc/Documents/france_travail_worker/job_scrapper && $(NPM) run dev

t: 
	npm run test

sort:
	cd /home/cc/Documents/france_travail_worker/sorting_machine && python3 $(SORTER_NAME)

.PHONY: data sort t aclean fclean cleandb
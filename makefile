OBJS_METIER = src/data/rome_metiers/**/* 
OBJS_COMP = src/data/rome_competences/**/*
NAME= offres_emploi
ORIGIN =  $(shell git branch --show-current)
COM=default_push

SORTER_NAME = sorting_machine.py

git: clean

	git add . 
	git commit -m $(COM) 
	git push origin $(ORIGIN)

clean:
	rm -rf data/*

fclean: clean
	rm -rf node_modules

data:
	cd job_scrapper && npm run dev

t: 
	npm run test

sort:
	cd sorting_machine && python3 $(SORTER_NAME)

.PHONY: data
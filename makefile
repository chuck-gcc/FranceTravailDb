OBJS_METIER = src/data/rome_metiers/**/* 
OBJS_COMP = src/data/rome_competences/**/*
NAME= offres_emploi
ORIGIN =  $(shell git branch --show-current)
COM=default_push

git: clean

	git add . 
	git commit -m $(COM) 
	git push origin $(ORIGIN)

clean:
	rm -rf data/*

fclean: clean
	rm -rf node_modules
r: 
	npm run dev
t: 
	npm run test

scp: fclean
	scp -r -P 2021 ../../franceDb/offres_emploi  ast@192.168.1.147:/home/ast/franceDb/
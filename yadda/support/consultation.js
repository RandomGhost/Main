/**
   ==============================================================================================================
   Ce fichier contient toute les fonctions necessaire au remplissage du formulaire de recherche dans consultation
   ==============================================================================================================
*/

/**
   \brief Rempli le champ nom du formulaire de recherche
   \param nom le nom a inserer dans le formulaire
 */
casper.consultFillNom = function(nom) {
    casper.fill('form#searchForm', {
	'criteres.assure.nom' : nom
    }, false);
};


/**
   \brief Rempli le champ prenom du formulaire de recherche
   \param prenom le prenom a inserer
*/
casper.consultFillPrenom = function(prenom) {
    casper.fill('form#searchForm', {
	'criteres.addire.prenom' : prenom
    }, false);
};

/**
   \brief Rempli le champ telephone du formulaire de recherche
   \param tel le numero de telephone a inserer
*/
casper.consultFillTel = function(tel) {
    casper.fill('form#searchForm', {
	'criteres.assure.tel' : tel
    }, false);
};


/**
   \brief Rempli l'addresse mail du formulaire de recherche
   \param mail le mail a inserer
*/
casper.consulFillMail = function(mail) {
    casper.fill('form#searchForm', {
	'critere.assure.email' : mail
    }, false);
};


/**
   \brief Rempli le code Postal du formulaire de recherche
   \param code le code postal a inserer
*/
casper.consultFillCP = function(code) {
    casper.fill('form#searchForm', {
	'criteres.assure.codePostal' : code
    }, false);
};


/**
   \brief Rempli la ville du formulaire de recherche
   \param ville la ville a inserer
*/
casper.consultFillVille = function(ville) {
    casper.fill('form#searchForm', {
	'criteres.assure.ville' : ville
    }, false);
};



/**
   \brief Rempli le N d adherent du formulaire de recherche
   \param num le numero de l'adherent
*/
casper.consultFillNumAdh = function(num) {
    casper.fill('form#searchForm', {
	'criteres.assure.codeAdherent' : num
    }, false);
};

/**
   \brief Rempli le numero du contrat dans le formulaire de recherche
   \param numRacine le debut du numero du contrat
   \param numSuff la fin du numero du contrat
*/
casper.consultFillNumCont = function(numRacine, numSuff) {
    casper.fill('form#searchForm', {
	'criteres.contrat.numContratRacine' : numRacine,
	'criteres.contrat.numContratSuffixe' : numSuff
    }, false);
};

/**
   \brief Rempli le nom du contrat dans le formulaire de recherche
   \param nom le nom du contrat 
*/
casper.consultFillNomCont = function(nom) {
    casper.fill('form#searchForm', {
	'criteres.contrat.contrat' : nom
    }, false);
};


/**
   \brief Rempli le numero de dossier sinistre
   \param num le numero du dossier
*/
casper.consultFillNumDoss = function(num) {
    casper.fill('form#searchForm', {
	'criteres.dossier.numDossier' : num
    }, false);
};


/**
   \brief clique sur le bouton rechercher du formulaire de recherche
   \param void
*/
casper.consultClickSearch = function() {
    casper.click('input[value="Rechercher"]');
};

/**
   \brief clique sur le bouton de reinitialisation
   \param void
*/
casper.consultClickRein = function() {
    casper.click('a[id="btnReset"]');
};
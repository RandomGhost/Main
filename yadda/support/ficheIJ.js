/**
   ==================================================================================================
   Ce fichier contient toutes les foncions necessaires pour modifier, visualiser, submit une fiche IJ
   ==================================================================================================
*/



/**
   \brief Cette fonction va retourner la valeur du statut de la fiche
   \param void
*/
casper.ficheIJGetStatut = function() {
    
    var statut = casper.evaluate(function() {
	var span = document.querySelector('.statutFiche');
	if ( span == null ) {
	    return null;
	} else {
	    return span.textContent;
	}
    });
    
    return statut;
};


/**
   \brief Remplis la nature de l'appel dans le formulaire
   \param nature La nature de l'appel
*/
casper.ficheIJfillNatureApp = function(nature) {

    var value = casper.evaluate(function(nature) {
	var elem = document.querySelector("#ga-natcall");
	var find = false, i = 0;
	var value = null;
	while ( i < elem.children.length && !find ) {
	    if ( elem.children[i].innerHTML == nature ) {
		find = true;
		value = elem.children[i].value;
	    }
	    i++;
	}
	return value;
    }, nature);

    casper.fill('form#afficherFicheIj', {
	'ficheIjDto.codeNatureAppel' : value
    }, false);
};


/**
   \brief Remplis la qualification de l'appel
   \brief la nature de l'appel doit deja etre rempli
   \param qualif la qualification de l'appel
*/
casper.ficheIJfillQualifApp = function(qualif) {

    var value = casper.evaluate(function(qualif) {
	var elem = document.querySelector("#ga-qualif");
	var find = false, i = 0;
	var value = null;
	while ( i < elem.children.length && !find ) {
	    if ( elem.children[i].innerHTML == qualif ) {
		find = true;
		value = elem.children[i].value;
	    }
	    i++;
	}
	return value;
    }, qualif);

    casper.fill('form#afficherFicheIj', {
	'ficheIjDto.codeNatureAppel' : value
    }, false);
    casper.fill('form#afficherFicheIj', {
	'ficheIjDto.codeQualificationReponse' : value
    }, false);
};

/**
   \brief Remplis le champ question dans la fiche
   \param question la question 
*/
casper.ficheIJfillQuestion = function(question) {
    casper.fill('form#afficherFicheIj', {
	'ficheIjDto.libQuestion' : question
    }, false);
};


/**
   \brief Rempli la reponse dans la fiche
   \param reponse la reponse
*/
casper.ficheIJfillReponse = function(reponse) {
    casper.fill('form#afficherFicheIj', {
	'ficheOjDto.libReponse' : reponse
    }, false);
};


/**
   \brief rempli la Famille du litige
   \param famille la Famille
*/
casper.ficheIJfillFamilleL = function(famille) {

      var value = casper.evaluate(function(famille) {
	var elem = document.querySelector("#ga-famille");
	var find = false, i = 0;
	var value = null;
	while ( i < elem.children.length && !find ) {
	    if ( elem.children[i].innerHTML == famille ) {
		find = true;
		value = elem.children[i].value;
	    }
	    i++;
	}
	return value;
    }, famille);

    casper.fill('form#afficherFicheIj', {
	'ficheIjDto.codeFamilleCause' : value
    }, false);
};


/**
   \brief Rempli le cause du litige de la fiche
   \brief il faut que les champs soit present avant d'appeler cette fonction qui ne prend pas en charge l'attente
   \param code la cause du litige (Fournisseurs, Sous ...)
*/
casper.ficheIJfillCodeCause = function(code) {
    
    var value = casper.evaluate(function(code) {
	var elem = document.querySelector("#ga-cause");
	var find = false, i = 0;
	var value = null;
	while ( i < elem.children.length && !find ) {
	    if ( elem.children[i].innerHTML == code ) {
		find = true;
		value = elem.children[i].value;
	    }
	    i++;
	}
	return value;
    }, code);

    casper.fill('form#afficherFicheIj', {
	'ficheIjDto.codeCause' : value
    }, false);
};

/**
   \brief Rempli la demande de piece de la fiche
   \param value la demande de piece selectionner ( le numero 1 - 2 - 3 )
*/
casper.ficheIJfillDemandePiece = function(value) {
    if ( value == 1 ) {
	casper.waitForSelector('#demandePiece_1', function() {
	    casper.click('#demandePiece_1');
	});
    } else if ( value == 2 ) {
	casper.waitForSelector('#demandePiece_2', function() {
	    casper.click('#demandePiece_2');
	});
    } else if ( value == 3 ) {
	casper.waitForSelector('#demandePiece_3', function() {
	    casper.click('#demandePiece_3');
	});
    }
};

/**
   \brief Rempli la nature du traitement 
   \param nature la nature du traitement ( le numero 1 - 2 - 3 )
*/
casper.ficheIJfillNatureTrait = function(nature) {
    if ( nature == 1 ) {
	casper.click('#afficheFicheIj_ficheIjDtp_codeCategorieFcheIj1');
    } else if ( nature == 2 ) {
	casper.click('#afficheFicheIj_ficheIjDtp_codeCategorieFcheIj2');
    } else if ( nature == 3 ) {
	casper.click('#afficheFicheIj_ficheIjDtp_codeCategorieFcheIj3');
    }
};

/**
   \brief Selectionne le type de reroutage de la fiche
   \param type le type de reroutage ( en toute lettre )
 */
casper.ficheIJfillReroutage = function(type) {
    casper.clickLabel(type, 'span');
};


/**
   \brief selectionne le type d'evenement
   \param type de l'evenement ( en toute lettre )
*/
casper.ficheIJFillTypeEvenement = function(type) {
    casper.clickLabel(type, 'label');
};


/**
   \brief Rempli la date butoir de la fiche IJ
   \param date la date ( en format DD/MM/YYYY )
*/
casper.ficheIJFillDateButoir = function(date) {

};


/**
   \brief Clos la fiche
   \param void
*/
casper.ficheIJClore = function() {
    casper.click('input[value="Clore"]');
};


/**
   \brief Clique sur la checkbox Urgent 
   \param coche le boolean pour savoir si elle doit etre coche
 */
casper.ficheIJCocheUrgent = function(bool) {
    var coche = casper.resourceExists('.checkboxField.inputField.checkboxStyle2.select');
    if ( bool ) {
	if ( !coche ) {
	    casper.click('span[text()="Urgent"]');
	}
    } else {
	if ( coche ) {
	    casper.click('span[text()="Urgent"]');
	}
    }
};


/**
   \brief Rempli le champs commentaire de la fiche IJ
   \param comm le commentaire a inserer
 */
casper.ficheIJFillComm = function(comm) {
    casper.fill('form#afficherFicheIj', {
	'ficheIjDto.libCommentaireUrgent' : comm
    }, false);
};


/**
   \brief Clique sur envoye les coordonnees de Gpj par email
   \param bool le boolean pour savoir si il faux coche ou non
   \param mail le mail a envoyer, n'est insere que si coche 
 */
casper.ficheIJCocheEmail = function(bool, mail) {
    var coche = casper.evaluate(function() {
	var elem = document.querySelector('.ga-choose-way ga-clear.checkboxStyle2');
	return elem.children[0].className == '.checkboxField.select';
    });
    if ( bool ) {
	if ( !coche ) {
	    casper.clicklabel('Par mail', 'span');
	    casper.fill('form#afficherFicheIj', {
		'ficheIjDto.emailAssure' : mail
	    }, false);
	}
    } else {
	if ( coche ) {
	    casper.clickLabel('Par mail', 'span');
	}
    }
};



/**
   \brief Clique sur la checkbox par sms 
   \param bool si la checkbox doit etre valide ou non
   \param sms le numero a inserer si la checkbox est valide
*/
casper.ficheIJCocheSMS = function(bool, sms) {
    var coche = casper.evaluate(function() {
	var elem = document.querySelector('.ga-choose-way ga-clear.checkboxStyle2');
	return elem.children[1].className == '.checkboxField.select';
    });
    if ( bool ) {
	if ( !coche ) {
	    casper.clickLabel('Par SMS', 'span');
	    casper.fill('form#afficherFicheIj', {
		'ficheIjDto.telAssure' : sms
	    });
	}
    } else {
	if ( coche ) {
	    casper.clickLabel('Par SMS', 'span');
	}
    }
};


/**
   \brief Agender la fiche
   \param void
 */
casper.ficheIjAgender = function() {
    casper.click('input[value="Agender fiche"]');
};

/**
   \brief met la fiche en brouillon
   \param void
*/
casper.ficheIjBrouillon = function() {
    casper.click('input[value="Brouillon"]');
};

module.exports.init = function() {
    var dictionary = new Dictionary() 
	.define('LOCALE', /(fr|es|ie)/)
	.define('NUM', /(\d+)/);


    var library = English.library(dictionary)

    /** 
	\brief remplis un champ dans un formulaire dans un iFrame
	\param doc iframe a remplir
	\param name le nom de l'input a remplir
	\param value la valeur a inserer dans l input
	\param form le formulaire 
    */ 
	.when('dans le sous document {$DOC} je rempli le champ {$NAME} avec {$VALUE} du form {$FORM}', function(doc, name, value, form) {
	    casper.echo(casper.evaluate( function(name, doc, value) {
		var elem = document.querySelector(doc);
		if ( elem != null ) {
		    elem = elem.contentDocument;
		    if ( elem != null ) {
			var champ = elem.querySelector('input[name="' + name + '"]');
			if ( champ != null ) {
			    champ.value = value;
			    return "reussi";
			} else {
			    return "champ inexistant";
			}
		    } else {
			return "document vide";
		    }
		} else {
		    return "document inexistant";
		}
	    }, name,doc, value));
	})


    /** 
	\brief vide un champ dans un formulaire dans un iFrame
	\param doc iframe a remplir
	\param name le nom de l'input a remplir
	\param form le formulaire 
    */ 
	.when('dans le sous document {$DOC} je vide le champ {$NAME} du form {$FORM}', function(doc, name, form) {
	    casper.echo(casper.evaluate( function(name, doc) {
		var elem = document.querySelector(doc);
		if ( elem != null ) {
		    elem = elem.contentDocument;
		    if ( elem != null ) {
			var champ = elem.querySelector('input[name="' + name + '"]');
			if ( champ != null ) {
			    champ.value = "";
			    return "reussi";
			} else {
			    return "champ inexistant";
			}
		    } else {
			return "document vide";
		    }
		} else {
		    return "document inexistant";
		}
	    }, name,doc));
	})



    
    /** 
	\brief remplis un champ a partir d'une variable de sauvegarde
	\param ID l identifiant du champ (Namespace)
	\param VALUE l identifiant de la valeur (Namespace)
    */ 
	.when('je remplis le champ {$ID} avec save {$VALUE}', function(id, value) {
	    var real_value = namespace.get('GLOBAL::' + value);
	    var real_id = namespace.get(session.get('type_user') + "::" + id);
	    casper.echo(real_value + " " + real_id);
	    casper.echo( casper.evaluate ( function ( value , id , under_doc ) {
		var doc = document;
		if ( under_doc != '' ) {
		    doc = document.querySelector(under_doc).contentDocument;
		}
		var elem = doc.querySelector(id);
		if ( elem != null ) {
		    elem.value = value;
		    return elem.value;
		} else {
		    return 'element inexistant';
		}
	    }, real_value , real_id, session.get('under_doc')));
	})


    /**
       \brief Verifie verifie la presence de l'autocompletion et clique dessus des qu'elle apparait
       \param void
    */
	.then('je remplis le nom du contrat et je clique sur l autocompletion', function() {
	    casper.sqliScreenshot('search');
	    casper.sendKeys('form#searchForm input[name="criteres.contrat.contrat"]','GPR', {keepFocus : true});
	    
	    casper.waitForSelector('li.ui-menu-item a', function() {
		casper.click('li.ui-menu-item a');
		casper.test.assert(true);
	    });
	})


    /**
       \brief Fais un screen avant le remplissage pour debugger
       \param void
    */
	.when('je rempli la fiche ', function() {
	    casper.sqliScreenshot('fiche'); 
	})

    /**
       \brief Va remplir le formulaire de recherche avec des données 
       \brief ne submit pas le formulaire
       \param void
    */
	.when('je remplis le nom, le prenom, le code postal et la ville de l assure puis je clique sur Créer Assuré inconnu', function() {
	    
	    casper.fillSelectors('form#searchForm', {
		'input[name="criteres.assure.nom"]' : 'ROBERT',
		'input[name="criteres.assure.prenom"]' : 'Martin',
		'input[name="criteres.assure.codePostal"]' : '69009',
		'input[name="criteres.assure.ville"]' : 'LYON',
		'input[name="creationAssure"]' : true
	    }, false);

	})

    /** 
	\brief rempli un champ avec son identifiant dans le norme namespace
	\param le namespace de l'element
	\param la valeur a inserer
    */ 
	.when('je remplis le champ {$ELEM} avec {$VALUE}', function(elem, value) {
	    var id = namespace.get(session.get('type_user') + "::" + elem);
	    var real_value = namespace.get(session.get('type_deb') + "::" + value);
	    casper.echo(id + " " + real_value);
	    var result = casper.evaluate( function(id, value, under_doc) {
		var doc;
		if ( under_doc != "" ) {
		    doc = document.querySelector(under_doc).contentDocument;
		} else {
		    doc = document;
		}
		var elem = doc.querySelector(id);
		if ( elem != null ) {
		    elem.value = value;
		    return [true, elem.value];
		    
		} else {
		    return [false, 'element non trouve ' + id];
		}
	    }, id, real_value, session.get('under_doc'));
	    casper.echo(result);
	    casper.echo (result[1]);
	    casper.test.assert(result[0]);
	})




    /** 
	\brief rempli un champ avec son identifiant dans le norme namespace
	\param le namespace de l'element
	\param la valeur a inserer
    */ 
	.when('je remplis le champ {$ELEM} avec session {$VALUE}', function(elem, value) {
	    var id = namespace.get(session.get('type_user') + "::" + elem);
	    var real_value = session.get ( value );
	    casper.echo(id + " " + real_value);
	    var result = casper.evaluate( function(id, value, under_doc) {
		var doc;
		if ( under_doc != "" ) {
		    doc = document.querySelector(under_doc).contentDocument;
		} else {
		    doc = document;
		}
		var elem = doc.querySelector(id);
		if ( elem != null ) {
		    elem.value = value;
		    return [true, elem.value];
		    
		} else {
		    return [false, 'element non trouve ' + id];
		}
	    }, id, real_value, session.get('under_doc'));
	    casper.echo(result);
	    casper.echo (result[1]);
	    casper.test.assert(result[0]);
	})




    /**
       \brief rempli le champ avec son identifiant Namespace et clique sur l'autocompletion qui s'affiche
       \param id l 'identifiant de l' element
       \param value la valeur a inserer
    */
	.when('je remplis le champ {$ID} et je clique sur l autocompletion avec {$VALUE}', function(id, value){
	    id = namespace.get(session.get('type_user') + "::" + id);
	    var real_value = namespace.get(session.get('type_deb') + "::" + value);
	    casper.sendKeys(id, real_value, { keepFocus : true });
	    casper.sqliScreenshot( 'completion' );
	    casper.waitForSelector('li.ui-menu-item a', function() {
		casper.click('li.ui-menu-item a');
		casper.test.assert(true);
	    });
	})


	.when('je rempli le champ {$ARG1} du sous document {$ARG2} avec {$ARG3} du form {$ARG4}', function(arg1,arg2,arg3,arg4) {
	    casper.evaluate(function(champ, doc, value) {
		var elem = document.querySelector(doc).contentDocument;
		var ch = elem.querySelector(champ);
		ch.value = value;
	    }, arg1, arg2, arg3);
	    casper.sqliScreenshot(arg1);
	})



    /** 
	\brief 
	\param name le nom du textarea
	\param value la valeur a entre dans le champ texte
	\param form le fomulaire contenant le textarea
    */ 
	.when('je rempli le textarea {$NAME} avec {$VALUE} du form {$FORM}', function(name, value, form) {
	    form = 'form#' + form;
	    var element = {};
	    element[name] = value;
	    casper.fill(form, element , false);
	})


    /**
       \brief remplis un select en cliquant sur l'option
       \param sel l'identifiant du select
       \param value la valeur du select
     */
	.when('je rempli le select {$SEL} avec {$VALUE}', function(sel, value) {
	    casper.click('option[value="' + value + '"]');
	})

    /**
       \brief remplis un champ dans un formulaire
       \param name le nom de l'input
       \param value la valeur 
       \param form le formulaire 
     */
	.when('je rempli le champ {$NAME} avec {$VALUE} du form {$FORM}', function(name,value, form) {  
	    casper.sendKeys('input[name="' + name + '"]', value);
	})





    /** 
	\brief remplir un champ de type date avec la date du jour plus un nombre de jour
	\param name le nom du champ
	\param nb le nombre de jour en plus
    */ 
	.when('je rempli {$NAME} avec la date du jour en ajoutant {$NB} jours', function(name, nb) {
	    var date = new Date();
	    date.setTime(date.getTime() + (nb * 60 * 60 * 1000 * 24));
	    var text = casper.sqliDateFormat(date);

	    var id_elem = namespace.get(session.get('type_user') + "::" + name);
	    casper.echo(id_elem);
	    var result = casper.evaluate( function( id , value , under_doc ) {
		var doc = under_doc == "" ? document : document.querySelector ( under_doc ).contentDocument;
		var elem = doc.querySelector(id);
		if ( elem != null ) {
		    elem.value = value;
		    return [true, elem.value];
		} else {
		    return [false, 'element introuvable'];
		} 
	    }, id_elem, text , session.get('under_doc') );
	    casper.echo(result[1]);
	    casper.test.assert(result[0]);
	})



    /** 
	\brief rempli un input n'appartenant pas forcement a un formulaire
	\param name le nom du formulaire
	\param value la valeur a inserer dans le formulaire
    */ 
	.when('je rempli le champ {$NAME} avec {$VALUE}', function(name, value) {
	    casper.echo( casper.evaluate( function(name, value) {
		var input = document.querySelector('input[name="' + name + '"]');
		if ( input != null ) {
		    input.value = value;
		    return "reussi";
		} else {
		    return "pas d'input de nom " + name; 
		}


	    }, name, value));
	    
	})



    /** 
	\brief rempli un textarea n'appartenant pas forcement a un formulaire
	\param name le nom du textarea
	\param value la valeur a inserer
    */ 
	.when('je rempli le textarea {$NAME} avec {$VALUE}', function(name, value) {
	    casper.echo( casper.evaluate( function( name, value ) {
		var text = document.querySelector('textarea[name="' + name + '"]');
		if ( text != null ) {
		    text.value = value;
		    return "reussi";
		} else {
		    return "le textarea n'existe pas";
		}
	    }, name, value));
	    
	    
	})


    /** 
	\brief remplis un champ en fonction de son identifiant
	\param id l'identifiant de l'input
	\param value la valeur a inserer dans l'input
    */ 
	.when('je rempli le champ d identifiant {$ID} avec {$VALUE}', function(id, value) {
	    casper.sendKeys('input[id="' + id + '"]', value);
	})



    /** 
	\brief Rempli un input avec un element precedement enregistrer dans les variables de session
	\param name le nom du champ
	\param value le nom de la variable de session
    */ 
	.when('je rempli le champ {$NAME} avec la variable {$VALUE}', function(name, value) {
	    session.set('Num_Contrat', '000AOCCAS');
	    casper.echo( casper.evaluate( function ( name, value ) {
		var input = document.querySelector('input[name="' + name + '"]');
		if ( input != null ) {
		    input.value = value;
		    input.click();
		    return "reussi";
		} else {
		    return "input nommer " + name + " n'existe pas";
		}

	    }, name, session.get(value)));
	    
	    
	})



    /** 
	\brief rempli un champ dans un iframe ( Namespace )
	\param elem l'identifiant de l'element a remplir (Namespace)
	\param frame l'identifiant de l'iframe (Namespace)
	\param value la valeur a inserer dans le champ
    */ 
	.when('dans le sous document {$FRAME} je remplis le champ {$ELEM} avec {$VALUE}', function(frame, elem, value) {
	    var id_elem = namespace.get(session.get('type_user') + "::" + elem);
	    var id_frame = namespace.get(session.get('type_user') + "::" + frame);
	    casper.echo(id_frame + " " + id_elem);
	    casper.echo( casper.evaluate( function(elem, frame, value) {
		var doc = document.querySelector(frame);
		if ( doc != null ) {
		    doc = doc.contentDocument;
		    if ( doc != null ) {
			var champ = doc.querySelector(elem);
			if ( champ != null) {
			    champ.value = value;
			    return champ.value;
			} else {
			    return 'champ inexistant';
			}
		    } else {
			return 'le document est vide';
		    }
		} else {
		    return "le document n'existe pas";
		}
	    }, id_elem, id_frame, value));
	    
	})


    /** 
	\brief Remplis un element avec un bout de chaine
	\param id l identifiant de l element a remplir
	\param value la valeur a inserer 
	\param beg la borne de debut
	\param fin la borne de fin
    */ 
	.when('je remplis de {$BEG} a {$END} le champ {$ID} avec {$VALUE}', function(beg, end, id, value) {
	    id = namespace.get ( session.get ('type_user') + "::" + id );
	    value = namespace.get ( session.get ('type_deb') + "::" + value );
	    if ( value != null ) {
		value = value.substr ( beg , end - beg + 1 );
		casper.echo ( value );
		var result = casper.evaluate ( function( id , value , under_doc ) {
		    var doc = under_doc == "" ? document : document.querySelector( under_doc ).contentDocument;
		    var elem = doc.querySelector ( id );
		    if ( elem != null ) {
			elem.value = value;
			return [ true , elem.value ];
		    } else {
			return [ false, "pas de champ" ];
		    }
		}, id , value , session.get( 'under_doc' ) );
		if ( result != null ) {
		    casper.echo ( result[1] );
		    casper.test.assert( result[0] );
		} else {
		    casper.echo ( "pas de doc je presume" );
		    casper.test.assert( false );
		}
	    } else {
		casper.echo ( value + " substr impossible" );
		casper.test.assert( false );
	    }
	});






    return library; 
};
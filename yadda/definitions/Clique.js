module.exports.init = function() {
    var dictionary = new Dictionary() 
	.define('LOCALE', /(fr|es|ie)/)
	.define('NUM', /(\d+)/);


    var library = English.library(dictionary)

    /** 
	\brief clique sur le dossier de developpement correspondant au nom
	\param nom
    */ 
	.when('je clique sur le dossier de DEV de nom {$NOM}', function(nom) {
	    var value = namespace.get(session.get('type_deb') + "::" + nom);
	    casper.echo(casper.evaluate(function(value) {
		var list = document.querySelector('#div_vignetteListDossiersDev');
		if ( list != false ) {
		    var i = 0, find = false;
		    var found = -1;
		    while ( i < list.children.length && !find ) {
			if ( list.children[i].children[0].children[1].children[1].innerHTML == value ) {
			    found = i;
			    find = true;
			}
			i++;
		    }
		    if ( find ) {
			var event = document.createEvent('MouseEvent');
			event.initMouseEvent('click', true, true, window, 1,0,0);
			list.children[found].dispatchEvent(event);
			return 'reussi';
		    } else {
			return 'element pas dans la liste';
		    }
		} else {
		    return "la liste n'est pas presente";
		}
	    }, value)); 
	    
	})



    /**
       \brief Va cliquer sur le lien dont l'identifiant est link
       \param link l'identifiant du lien sur lequel cliquer
    */
	.when('je clique lienjs {$LINK}', function(link) {
	    casper.clickLabel(link, 'a');
	})



    /** 
	\brief clique sur un dossier de dev de nom 
	\param SAVE l identifiant ou est stocke le nom
    */ 
	.when('je clique sur le dossier de DEV de nom save {$SAVE}', function(save) {
	    var value = namespace.get('GLOBAL::' + save);
	    casper.echo(value);
	    casper.echo(casper.evaluate(function(value) {
		var list = document.querySelector('#div_vignetteListDossiersDev');
		if ( list != false ) {
		    var i = 0, find = false;
		    var found = -1;
		    while ( i < list.children.length && !find ) {
			if ( list.children[i].children[0].children[1].children[1].innerHTML == value ) {
			    found = i;
			    find = true;
			}
			i++;
		    }
		    if ( find ) {
			var event = document.createEvent('MouseEvent');
			event.initMouseEvent('click', true, true, window, 1,0,0);
			list.children[found].dispatchEvent(event);
			return 'reussi';
		    } else {
			return 'element pas dans la liste';
		    }
		} else {
		    return "la liste n'est pas presente";
		}
	    }, value)); 
	})



    /**
       \brief Va cliquer sur un element dans le menu (Agenda, Gestion... , ...)
       \param menu le nom du menu sur lequel il va cliquer
    */
	.when('je clique sur menu {$MENU}', function(menu) {
	    var url = casper.getCurrentUrl();
	    casper.sqliClickMenu(menu);
	    casper.sqliWaitUrlChange(url, 30000);
	}) 





    /**
       \brief Va cliquer sur le bouton dont a valeur est bouton
       \param bouton la valeur du bouton
    */
	.when('je clique sur {$BOUTON}', function(bouton) {
	    var id = namespace.get(session.get('type_user') + "::" + bouton);
	    casper.echo(id);
	    var url = casper.getCurrentUrl();
	    if ( id != null ) {
		var result = casper.evaluate ( function( id , under_doc ) {
		    var doc = document;
		    if ( under_doc != "" ) {
			doc = document.querySelector(under_doc).contentDocument;
		    }
		    var elem = doc.querySelector(id);
		    if ( elem != null ) {
			var event = document.createEvent('MouseEvent');
			event.initMouseEvent('click', true, true, window, 1,0,0);
			elem.dispatchEvent( event );
			return [true, "reussi", elem.getAttribute('href')];
		    } else {
			return [false, 'element inexistant', null];
		    }
		}, id, session.get('under_doc'));
		casper.echo(result[1]);
		casper.test.assert(result[0]);
		casper.displayTab ( result[2] );
		casper.sqliWaitUrlChange(url, session.get('long_delay'));
		
	    } else {
		casper.sqliClickButton(bouton);
		casper.sqliWaitUrlChange(url, session.get('long_delay'));
	    }
	})



    /** 
	\brief clique sur la ligne d'un tableau contenant un variable stocker dans une variable de sauvegarde
	\param Tab l identifiiant du tableau ( Namespace )
	\param Value l identifiant de la valeur ( Namespace )
    */ 
	.when('je clique la ligne du tableau {$TAB} contenant save {$VALUE}', function(tab, value) {
	    var real_value = namespace.get("GLOBAL::" + value);
	    var real_tab = namespace.get(session.get('type_user') + '::' + tab);
	    casper.echo(real_tab + " " + real_value);
	    casper.echo ( casper.evaluate( function ( value , id , under_doc) {
		var doc = document;
		if ( under_doc != '' ) {
		    doc = document.querySelector(under_doc).contentDocument;
		}
		var tab = doc.querySelector(id);
		if ( tab != null ) {
		    var i = 0, find = false, line_res = -1, col_res = -1;
		    while ( i < tab.children.length && ! find ) {
			var j = 0;
			while ( j < tab.children[i].children.length && !find ) {
			    if ( tab.children[i].children[j].innerHTML == value ) {
				find = true;
				line_res = i;
				col_res = j;
			    } else if ( tab.children[i].children[j].children.length > 0 ) {	
				if ( tab.children[i].children[j].children[0].innerHTML == value ) {
				    find = true;
				    line_res = i;
				    col_res = j;				    
				}
			    }
			    j++;
			}
			i++;
		    }
		    if ( find ) { 
			var event = doc.createEvent('MouseEvent');
			event.initMouseEvent('click', true, true, window, 1,0,0);
			tab.children[line_res].children[col_res].dispatchEvent(event);
			return line_res;
		    } else {
			return 'ligne non trouve';
		    }
		} else {
		    return 'tableau inexistant';
		}
		
	    }, real_value, real_tab, session.get('under_doc')));
	})


    /** 
	\brief clique sur la ligne d'un tableau contenant un variable stocker dans une variable de sauvegarde
	\param Tab l identifiiant du tableau ( Namespace )
	\param Value l identifiant de la valeur ( Namespace )
    */ 
	.when('je clique la ligne du tableau {$TAB} contenant {$VALUE}', function(tab, value) {
	    var real_value = namespace.get(session.get('type_deb') + "::" + value);
	    var real_tab = namespace.get(session.get('type_user') + '::' + tab);
	    casper.echo(real_tab + " " + real_value);
	    casper.echo ( casper.evaluate( function ( value , id , under_doc) {
		var doc = document;
		if ( under_doc != '' ) {
		    doc = document.querySelector(under_doc).contentDocument;
		}
		var tab = doc.querySelector(id);
		if ( tab != null ) {
		    var i = 0, find = false, line_res = -1, col_res = -1;
		    while ( i < tab.children.length && ! find ) {
			var j = 0;
			while ( j < tab.children[i].children.length && !find ) {
			    if ( tab.children[i].children[j].innerHTML == value ) {
				find = true;
				line_res = i;
				col_res = j;
			    } else if ( tab.children[i].children[j].children.length > 0 ) {	
				if ( tab.children[i].children[j].children[0].innerHTML == value ) {
				    find = true;
				    line_res = i;
				    col_res = j;				    
				}
			    }
			    j++;
			}
			i++;
		    }
		    if ( find ) { 
			var event = doc.createEvent('MouseEvent');
			event.initMouseEvent('click', true, true, window, 1,0,0);
			tab.children[line_res].children[col_res].dispatchEvent(event);
			return line_res;
		    } else {
			return 'ligne non trouve';
		    }
		} else {
		    return 'tableau inexistant';
		}
		
	    }, real_value, real_tab, session.get('under_doc')));
	})



    /** 
	\brief Clique sur un input sans attendre de redirection
	\param elem l'identifiant de l'input (Namespace)
    */ 
	.when('je clique sans attendre sur {$ELEM}', function(elem) {
	    var id_elem = namespace.get(session.get('type_user') + "::" + elem);
	    casper.echo(id_elem);
	    var result = casper.evaluate( function(id, under_doc) {
		var doc = document;
		if ( under_doc != "" ) {
		    doc = document.querySelector(under_doc).contentDocument;
		}
		var elem = doc.querySelector(id);
		if ( elem != null ) {
		    var event = document.createEvent('MouseEvent');
		    event.initMouseEvent('click', true, true, window, 1, 0, 0);
		    elem.dispatchEvent(event);
		    return [true , "reussi"];
		} else {
		    return [false,'element inexistant'];
		}
	    }, id_elem, session.get('under_doc'));
	    casper.echo(result[1]);
	    casper.test.assert(result[0]);
	    
	})



    /** 
	\brief clique sur un label dont l'attribut for est attr
	\param attr la valeur de l'attribut for
    */ 
	.when('je clique sur le label for {$ATTR}', function(attr) {
	    casper.click('label[for="' + attr + '"]');
	})


    /** 
	\brief clique sur un span 
	\param content le contenu du span
    */ 
	.when('je clique sur span contenant {$CONTENT}', function(content) {
	    var url = casper.getCurrentUrl();
	    casper.clickLabel(content, 'span');
	    casper.sqliWaitUrlChange(url, 10000);
	})


    /** 
	\brief clique sur un span sans attendre de redirection
	\param content le contenu du span
    */ 
	.when('je clique sans attendre sur span contenant {$CONTENT}', function(content) {
	    casper.clickLabel(content, 'span');
	})


    /**
       \brief clique sur un lien 
       \param id l'identifiant du lien
    */
	.when('je clique sur le lien d identifiant {$ID}', function(id) {
	    
	    casper.click('a[id="' + id + '"]');
	})



    /** 
	\brief Clique sur un input dont le nom est arg1
	\param name le nom de l 'input
    */ 
	.when('je clique sur l input de nom {$NAME}', function(name) {
	    casper.click('input[name="' + name + '"]');
	})


    /**
       \brief clique sur un bouton dans un iFrame
       \param doc l'identifiant de l'iFrame
       \bouton l'identifiant du bouton
    */
	.when('je clique dans le sous document {$DOC} sur bouton {$BOUTON}', function(doc, bouton) {
	    casper.echo(doc);
	    casper.echo(casper.evaluate( function(doc, bouton) {
		var aux = document.querySelector(doc);
		if ( aux != null ) {
		    aux = aux.contentDocument;
		    if ( aux != null ) {
			bouton = aux.querySelector('input[value="' + bouton + '"]');
			if ( bouton != null ) {
			    bouton.click();
			    return true;
			} else {
			    return 'bouton inexistant';
			} 
		    } else {
			return "document vide";
		    }
		} else { 
		    return "document non trouve";
		}
	    }, doc, bouton));
	})





    /** 
	\brief Clique sur une ligne dans le tableau de tache 
	\param value la valeur a trouver 
	\param elem l'element a trouver dans le tableau
    */ 
	.when('je clique sur la tache contenant save {$SAVE} pour {$ELEM}', function(save, elem) {
	    var url = casper.getCurrentUrl();
	    var real_value = namespace.get("GLOBAL::" + save);
	    casper.echo(save + " -> " + real_value + ";" + elem);
	    var tab = namespace.get(session.get('type_user') + "::Agenda::Tache::Body");
	    var res = task_reader.find(elem, real_value, tab);
	    casper.echo(res);
	    if ( res != -1 ) {
		var result = casper.evaluate( function ( num, tab ) {
		    var elem = document.querySelector(tab);
		    if ( elem != null ) {
			var event = document.createEvent('MouseEvent');
			event.initMouseEvent( 'click' , true, true, window, 1, 0 , 0);
			elem.children[num].children[2].dispatchEvent( event );
			return [true, 'reussi'];
		    } else {
			return [false, 'rate'];
		    }
		}, res , tab );
		casper.echo(result[1]);
		casper.test.assert(result[0]);
	    }
	    casper.sqliWaitUrlChange(url, session.get('long_delay'));
	})



    /** 
	\brief Clique sur une ligne dans le tableau de tache 
	\param value la valeur a trouver 
	\param elem l'element a trouver dans le tableau
    */ 
	.when('je clique sur la tache contenant {$VALUE} pour {$ELEM}', function(value, elem) {
	    var url = casper.getCurrentUrl();
	    var real_value = namespace.get(session.get('type_deb') + "::" + value);
	    casper.echo(value + " -> " + real_value + ";" + elem);
	    var tab = namespace.get(session.get('type_user') + "::Agenda::Tache::Body");
	    var res = task_reader.find(elem, real_value, tab);
	    casper.echo(res);
	    if ( res != -1 ) {
		var result = casper.evaluate( function ( num, tab ) {
		    var elem = document.querySelector(tab);
		    if ( elem != null ) {
			var event = document.createEvent('MouseEvent');
			event.initMouseEvent( 'click' , true, true, window, 1, 0 , 0);
			elem.children[num].children[2].dispatchEvent( event );
			return [true, 'reussi'];
		    } else {
			return [false, 'rate'];
		    }
		}, res , tab );
		casper.echo(result[1]);
		casper.test.assert(result[0]);
	    }
	    casper.sqliWaitUrlChange(url, session.get('long_delay'));
	})




    /**
       \brief Clique sur un lien en fonction de sa reference
       \param ref le href du lien
    */
	.when('je clique sur le lien de href {$REF}', function(ref) {
	    casper.click('a[href="' + ref + '"]');
	})

    /**
       \brief Clique sur un lien en fonction de son identifiant 
       \param id l'identifiant du lien
    */
	.when('je clique sur lien {$ID}', function(id) {
	    casper.click('a[id="' + id + '"]');
	})
    


    /** 
	\brief la ligne d'un tableau d'un sous document est clique ( en javascript )
	\param doc le sous document
	\param text le texte de la ligne
	\param tab l'identifiant du tableau des valeur (ex : table tbody )
    */ 
	.when('dans le sous document {$DOC} la ligne contenant {$TEXT} du tableau {$TAB} est clique', function(doc, text, tab) {
	    casper.echo(tab);
	    casper.echo( casper.evaluate( function(doc, text, table) {
		var aux = document.querySelector(doc);
		if ( aux != null ) {
		    aux = aux.contentDocument;
		    if ( aux != null ) {
			var tab = aux.querySelector(table);
			if ( tab != null ) {
			    var i = 0, find = false, col = -1, line = -1;
			    while ( i < tab.children.length && !find ) { //ligne
				for ( var j = 0 ; j < tab.children[i].children.length ; j++ ) { //colonne
				    if ( tab.children[i].children[j].innerHTML == text ) {
					col = j;
					line = i;
					find = true;
				    }
				}
			    }
			    if ( col < 0 || line < 0 ) {
				return 'element absent du tableau';
			    } else {
				var event = document.createEvent('MouseEvent');
				event.initMouseEvent( 'click', true, true, window, 1, 0, 0);
				tab.children[line].dispatchEvent( event );
				return "reussi";
			    }
			} else {
			    return 'tableau inexistant';
			}
		    }
		} else {
		    return  "document inexistant";
		}
		
		
	    }, doc, text, tab));
	    casper.sqliSleep(1000);
	    casper.sqliScreenshot('shot');
	    
	})




    /**
       \brief Clique sur un lien dans un iframe
       \param doc le document dans lequel cliquer
       \param elem le contenu du lien a clique
    */
	.when('je clique dans le sous document {$DOC} sur {$ELEM}', function(doc,elem) {

	    var id_doc = namespace.get(session.get('type_user') + "::" + doc);
	    var id_elem = namespace.get(session.get('type_user') + "::" + elem);
	    casper.echo(id_doc + " " + id_elem);
	    casper.echo(casper.evaluate( function(doc, id) {
		var aux = document.querySelector(doc);
		if ( aux != null ) {
		    aux = aux.contentDocument;
		    if ( aux != null ) {
			var elem = aux.querySelector(id);
			if ( elem != null ) {
			    var event = document.createEvent('MouseEvent');
			    event.initMouseEvent('click', true, true, window, 1, 0, 0);
			    elem.dispatchEvent( event );
			    return "reussi";
			} else {
			    return 'element non trouver';
			}
		    } else {
			return "document vide";
		    }
		} else {
		    return "document inexistant";
		}
	    }, id_doc, id_elem));
	})

    /**
       \brief clique sur la ligne num de la table table
       \param num le numero de la ligne a cliquer
       \param table la table dans laquelle cliquer
    */
	.when("la ligne {$NUM} col {$COL} de {$TABLE} est cliqué", function(num, col, table) {
	    var url = casper.getCurrentUrl();
	    table = namespace.get( session.get('type_user') + "::" + table );
	    casper.sqliScreenshot("table");
	    casper.echo(table);
	    var lab = casper.evaluate(function(table, num, col) {
		var elem =  document.querySelector(table);
		if ( elem != null ) {
		    var line = elem.childNodes[num - 1];
		    if ( line != null ) {
			return [ true, line.childNodes[col].innerHTML ];
		    } else {
			return [ false , "ligne absente" ];
		    }
		} else {
		    return [ false, "tab non trouve" ];
		}
	    }, table, num, col);
	    casper.echo( lab[1] );
	    casper.test.assert( lab[0] );
	    if ( lab[0] ) {
		casper.clickLabel( lab[1] , 'td' );
		casper.sqliWaitUrlChange(url, 10000);
	    }
	})


    /** 
	\brief Clique sur la ligne d'un tableau contenant la valeur attendu
	\param value la valeur attendu
	\param id l identifiant du tableau
    */ 
	.when('la ligne contenant {$VALUE} du tableau {$ID} est clique', function(value, id) {
	    var id_tab = namespace.get(session.get('type_user') + "::" + id);
	    var url = casper.getCurrentUrl();
	    casper.echo(id_tab);
	    casper.echo(casper.evaluate( function( value, id ) {
		var tab = document.querySelector(id);
		if ( tab != null ) {
		    var i = 0, find = false, line_res = -1, col_res = -1;
		    while ( i < tab.children.length && !find ) {
			for ( var j = 0 ; j < tab.children[i].children.length ; j++ ) {
			    if ( tab.children[i].children[j].innerHTML == value ) {
				find = true;
				line_res = i;
				col_res = j;
			    }
			}
			i++;
		    }
		    if ( find )  {
			var event = document.createEvent('MouseEvent');
			event.initMouseEvent('click', true, true, window, 1, 0, 0);
			tab.children[line_res].children[col_res].dispatchEvent(event);
			return i;
		    } else {
			return 'element introuvable';
		    }
		} else {
		    return 'pas de tableau';
		}
	    }, value, id_tab ));
	    casper.sqliWaitUrlChange(url, 10000);
	})

    /** 
	\brief la ligne colonne du tableau est clique sans attendre de redirection URL
	\param lin le numero de ligne
	\param col le numero de colonne
	\param table le tableau
    */ 
	.when('la ligne {$ARG1} col {$ARG2} de {$ARG3} est clique', function(lin, col, table) {
	    var id = namespace.get(session.get('type_user') + "::" + table);
	    casper.echo(id);
	    var url = casper.getCurrentUrl();
	    if ( id != null ) {
		casper.evaluate( function(table, li, col) {
		    var event = document.createEvent('MouseEvent');
		    event.initMouseEvent( 'click' , true, true, window, 1, 0 , 0);
		    document.querySelector(table).children[li - 1].children[col - 1].dispatchEvent( event );
		    return 'reussi';
		}, id, lin, col);
	    } else {
		casper.clickLabel(casper.evaluate( function(table, li, col) {
		    return document.querySelector(table).childNodes[li - 1].childNodes[col - 1].innerHTML;
		}, table, lin, col), 'td');
	    }
	    casper.sqliWaitUrlChange(url, session.get('long_delay'));
	})


    /** 
	\brief la ligne colonne du tableau est clique sans attendre de redirection URL
	\param lin le numero de ligne
	\param col le numero de colonne
	\param table le tableau
    */ 
	.when('sans attendre la ligne {$ARG1} col {$ARG2} de {$ARG3} est cliqué', function(lin, col, table) {
	    var id = namespace.get(session.get('type_user') + "::" + table);
	    casper.echo(id);
	    if ( id != null ) {
		casper.echo (casper.evaluate( function(table, li, col) {
		    var event = document.createEvent('MouseEvent');
		    event.initMouseEvent( 'click' , true, true, window, 1, 0 , 0);
		    document.querySelector(table).children[li - 1].children[col - 1].dispatchEvent( event );
		    return "reussi";
		}, id, lin, col));
		
	    } else {
		casper.clickLabel(casper.evaluate( function(table, li, col) {
		    return document.querySelector(table).childNodes[li - 1].childNodes[col - 1].innerHTML;
		}, table, lin, col), 'td');
	    }
	})



    /** 
	\brief la ligne contient un <p> avec le texte text
	\param text le texte contenu dans le tableau
	\param table le tableau
    */ 
	.when('la ligne contenant le texte {$TEXT} du tableau {$TABLE} est clique', function(text, table) {
	    var url = casper.getCurrentUrl();
	    casper.clickLabel(text, 'p');
	    casper.sqliWaitUrlChange(url, session.get('long_delay'));
	    
	})


    /** 
	\brief clique sur la demande de validation de geste commerciale
	\param value la valeur a trouver
	\param elem l'element contenant la valeur
    */ 
    
	.when('je clique sans attendre sur la demande contenant {$VALUE} pour {$ELEM}', function(value, elem) {
	    value = namespace.get( session.get('type_deb') + "::" + value);
	    casper.echo( value );
	    var find = false, end = false, i = 1;
	    while ( !find && !end ) {
		var result = ident_reader.analyse( '#fileListDemandesJuristes :nth-child(' + i + ')' );
		casper.displayTab( result );
		casper.echo ( i );
		if ( result == false ) {
		    end = true;
		} else if ( result[elem] != null ) {
		    find = result[elem] == value;
		}
		if ( !find ) {
		    i++;
		}
	    }
	    if ( find ) {
		var id = '#fileListDemandesJuristes :nth-child(' + i + ')';
		casper.evaluate( function ( id ) {
		    var elem = document.querySelector( id );
		    if ( elem != null ) {
			var event = document.createEvent ( "MouseEvent" );
			event.initMouseEvent ( 'click', true, true, window, 1, 0, 0);
			elem.dispatchEvent( event );
		    } else {
			return [ false , 'Je sais pas la franchement' ];
		    }
		}, id);
	    }
	})


    /** 
	\brief clique sur l'input de la ligne ( la premiere colonne )
	\param value le contenu de la ligne
	\param tab le tableau
    */ 

	.when('je clique sur l input de la ligne contenant {$VALUE} du tableau {$TAB}', function(value, tab) {
	    tab = namespace.get( session.get('type_user') + "::" + tab );
	    value = namespace.get( session.get('type_deb') + "::" + value );
	    casper.echo ( tab + " " + value );
	    var result = casper.evaluate ( function ( value, table , under_doc ) { 
	
		
		var doc = under_doc == "" ? document : document.querySelector( under_doc ).contentDocument;
		var tab = doc.querySelector( table );
		if ( tab != null ) {
		    var lines = tab.children;
		    var find = false, i = 0, line = -1;
		    while ( i < lines.length && !find ) {
			var j = 0;
			while ( j < lines[i].children.length && !find ) {
			    if ( lines[i].children[j].innerHTML == value ) {
				find = true;
				line = i;
			    }
			    j++;
			}
			i++;
		    }
		    if ( find ) { 
			var input =  lines[line].getElementsByTagName('input');
			if ( input != null ) {
			    var event = document.createEvent( "MouseEvent" );
			    event.initMouseEvent ( 'click' , true, true, window, 1, 0, 0);
			    for ( var k = 0 ; k < input.length ; k++ ) {
				if ( input[k] != null ) {
				    input[k].dispatchEvent ( event );
				}
			    }
			    return [ true, input.length ];
			} else {
			    return [ false, "pas d'input sur cette ligne" ];
			}
		    } else {
			return [ false, "ligne non trouve" ];
		    }
		} else {
		    return [ false, 'tableau non trouve' ];
		}
	    }, value, tab, session.get('under_doc'));
	    casper.echo (result);
	    if ( result != null ) {
		casper.echo( result[1] );
		casper.test.assert( result[0] );
	    } else {
		casper.echo ( "surement que le sous doc n'existe pas" );
		casper.test.assert ( false );
	    }
	    
	})

  /** 
	\brief clique sur l'input de la ligne ( la premiere colonne )
	\param value le contenu de la ligne
	\param tab le tableau
    */ 

	.when('je clique sur l input de toutes les lignes contenant {$VALUE} du tableau {$TAB}', function(value, tab) {
	    tab = namespace.get( session.get('type_user') + "::" + tab );
	    value = namespace.get( session.get('type_deb') + "::" + value );
	    casper.echo ( tab + " " + value );
	    var result = casper.evaluate ( function ( value, table , under_doc ) { 
	

		function get_input ( elem ) {
		    var i = 0 , find = false;
		    var input = null; 
		    while ( i < elem.children.length && !find ) {
			if ( elem.children[i].tagName == "INPUT" ) {
			    find = true;
			    input = elem.children[i];
			    return input;
			} else {
			    
			    input = get_input ( elem.children[i] );
			    if ( input != null ) {
				find = true;
			    }
			    i++;
			}
		    }
		    return input;
		}
		
		var doc = under_doc == "" ? document : document.querySelector( under_doc ).contentDocument;
		var tab = document.querySelector( table );
		if ( tab != null ) {
		    var lines = tab.children;
		    var i = 0, line = -1, nb = 0;
		    while ( i < lines.length ) {
			var j = 0, find = false;
			while ( j < lines[i].children.length && !find ) {
			    if ( lines[i].children[j].innerHTML == value ) {
				var input = get_input ( lines[i] );
				if ( input != null ) { 
				    var event = document.createEvent ( 'MouseEvent' ) ;
				    event.initMouseEvent ( 'click' , true, true, window, 1,0,0);
				    input.dispatchEvent ( event );
				    find = true;
				    nb++;
				}

			    }
			    j++;
			}
			i++;
		    }
		    if ( nb != 0 ) { 
			return [ true, nb ];
		    } else {
			return [ false, "ligne non trouve" ];
		    }
		} else {
		    return [ false, 'tableau non trouve' ];
		}
	    }, value, tab, session.get('under_doc'));
	    casper.echo (result);
	    if ( result != null ) {
		casper.echo( result[1] );
		casper.test.assert( result[0] );
	    } else {
		casper.echo ( "surement que le sous doc n'existe pas" );
		casper.test.assert ( false );
	    }
	    
	})




    /** 
	\brief clique sur l'input de la ligne ( la premiere colonne )
	\param value le contenu de la ligne
	\param tab le tableau
    */ 
    
	.when('je clique sur l input de la ligne contenant save {$VALUE} du tableau {$TAB}', function(value, tab) {
	    tab = namespace.get( session.get('type_user') + "::" + tab );
	    value = namespace.get( "GLOBAL::" + value );
	    casper.echo ( tab + " " + value );
	    var result = casper.evaluate ( function ( value, table , under_doc ) { 
		var doc = under_doc == "" ? document : document.querySelector( under_doc ).contentDocument;
		var tab = document.querySelector( table );
		if ( tab != null ) {
		    var find = false, i = 0, line = -1;
		    while ( i < tab.children.length && !find ) {
			var j = 0;
			var td = tab.children[i].getElementsByTagName('td');
			while ( j < td.length && !find ) {
			    if ( td[j].innerHTML == value ) {
				find = true;
				line = i;
			    }
			    j++;
			}
			i++;
		    }
		    if ( find ) { 
			var event = document.createEvent( "MouseEvent" );
			event.initMouseEvent ( 'click' , true, true, window, 1, 0, 0);
			var input = tab.children[line].getElementsByTagName('input');
			if ( input.length != 0 ) {
			    for ( var k = 0 ; k < input.length ; k++ ) {
				input[k].dispatchEvent( event );
			    }
			    return [ true, "reussi" ];
			} else {
			    return [ false, "pas d'input sur cette ligne" ];
			}
		    } else {
			return [ false, "ligne non trouve" ];
		    }
		} else {
		    return [ false, 'tableau non trouve' ];
		}
	    }, value, tab, session.get('under_doc'));
	    casper.echo( result );
	    if ( result != null ) {
		casper.echo( result[1] );
		casper.test.assert( result[0] );
	    } else {
		casper.echo ( "surement que le sous doc n'existe pas" );
		casper.test.assert ( false );
	    }
	    
	})


    /** 
	\brief clique sur l'input de la ligne ( la premiere colonne )
	\param value le contenu de la ligne
	\param tab le tableau
    */

	.when('je clique sur l input de la ligne contenant session {$VALUE} du tableau {$TAB}', function(value, tab) {
	    tab = namespace.get( session.get('type_user') + "::" + tab );
	    value = session.get ( value );
	    casper.echo ( tab + " " + value );
	    var result = casper.evaluate ( function ( value, table , under_doc ) { 
		var doc = under_doc == "" ? document : document.querySelector( under_doc ).contentDocument;
		var tab = document.querySelector( table );
		if ( tab != null ) {
		    var find = false, i = 0, line = -1;
		    while ( i < tab.children.length && !find ) {
			var j = 0;
			var td = tab.children[i].getElementsByTagName('td');
			while ( j < td.length && !find ) {
			    if ( td[j].innerHTML == value ) {
				find = true;
				line = i;
			    }
			    j++;
			}
			i++;
		    }
		    if ( find ) { 
			var event = document.createEvent( "MouseEvent" );
			event.initMouseEvent ( 'click' , true, true, window, 1, 0, 0);
			var input = tab.children[line].getElementsByTagName('input');
			if ( input.length != 0 ) {
			    for ( var k = 0 ; k < input.length ; k++ ) {
				input[k].dispatchEvent( event );
			    }
			    return [ true, "reussi" ];
			} else {
			    return [ false, "pas d'input sur cette ligne" ];
			}
		    } else {
			return [ false, "ligne non trouve" ];
		    }
		} else {
		    return [ false, 'tableau non trouve' ];
		}
	    }, value, tab, session.get('under_doc'));
	    casper.echo( result );
	    if ( result != null ) {
		casper.echo( result[1] );
		casper.test.assert( result[0] );
	    } else {
		casper.echo ( "surement que le sous doc n'existe pas" );
		casper.test.assert ( false );
	    }
	    
	})




    /** 
	\brief Clique sur une colonne dont l'indentifiant est un template
	\param Id l'identifiant de la colonne
	\param value la valeur a mettre dans le template
    */ 

    
	.when('je clique la colonne template {$ID} sur session {$VALUE}', function(id, value) {
	    
	    id = namespace.get ( session.get("type_user") + "::" + id + "!(" + session.get(value) + ")" );
	    casper.echo ( id );
	    var result = casper.evaluate( function(id, under_doc) {
		var doc = document;
		if ( under_doc != "" ) {
		    doc = document.querySelector(under_doc).contentDocument;
		}
		var elem = doc.querySelector(id);
		if ( elem != null ) {
		    var event = document.createEvent('MouseEvent');
		    event.initMouseEvent('click', true, true, window, 1, 0, 0);
		    elem.dispatchEvent(event);
		    return [true , "reussi"];
		} else {
		    return [false,'element inexistant'];
		}
	    }, id , session.get('under_doc'));

	    casper.echo(result[1]);
	    casper.test.assert(result[0]);
	    
	})



    /** 
	\brief Clique sur un bouton contenant du texte
	\param text le texte contenu dans le bouton
    */ 
	.when('je clique sans attendre sur le bouton contenant {$TEXT}', function(text) {
	    var result = casper.evaluate ( function ( text , under_doc ) {


		function mini( text ) {
		    var i = text.indexOf ( "&nbsp;" ) ;
		    if ( i != -1 ) {
			text = text.substr ( 0 , i ) + text.substr ( i + 6 , text.length );
		    }
		    i = 0;
		    while ( i != -1 ) {
			i = text.indexOf ( "<" );
			if ( i != -1 ) {
			    var j = i;
			    while ( text[j] != ">" ) {
				j++;
			    }
			    text = text.substr(0, i) + text.substr ( j+1 ,text.length );
			}
		    }
		    return text;
		}


		var doc = under_doc == "" ? document : document.querySelector( under_doc ).contentDocument;
		var coll = doc.getElementsByTagName( "button" );
		if ( coll != null ) {
		    var find = false, i = 0;
		    while ( i < coll.length && !find ) {
			if ( mini(coll[i].innerHTML) == text ) {
			    find = true;
			} else {
			    i++;
			}
		    }
		    if ( find ) {
			var event = document.createEvent( "MouseEvent" );
			event.initMouseEvent( "click" , true, true, window, 1,0,0);
			coll[i].dispatchEvent ( event );
			return [ true , "reussi" ];
		    } else {
			return [ false , "aucun bouton contenant " + text ];
		    }
		} else {
		    return [ false , "aucun bouton" ];
		}
	    }, text , session.get('under_doc') );

	    casper.echo(result);
	    if ( result != null ) {
		casper.echo ( result[1] );
		casper.test.assert ( result[0] );
	    } else {
		casper.echo( 'pas de document j imagine' );
		casper.test.assert( false );
	    }

	    
	});






    return library; 
};
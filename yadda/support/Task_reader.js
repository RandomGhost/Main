require('./TaskAnalyser.js');
/**
   ========================================================================================================
   Cette classe va creer, analyser des taches de de l'agenda
   Il renverra l'identifiant dossier DEV, ...

   Le contenu est renvoyer sous la forme d'un tableau

   Array : 
        ['USER'] : string;
        ['TASK'] : 
                  ['TYPE'] : string;
                  ['STATE'] : string;
        ['COMM'] : 
                  ['CONTRAT'] : 
                               ['nom'] : string;
                               ['num'] : string;
                   ||
                   ( ['étude'] | ['dossier'] ) : string;
        ['END'] : string;
        ['BEGIN'] : string;
        ['OBJECT'] : string[string];
        ['STATE'] : string;
        ['DELAY'] : int;

   ========================================================================================================
*/




window.TaskReader = function () {

    this.Current = null;
    this.func = [];
   
    
    /**
       \brief Creer la variable current, grace a un <tr> d'un ligne
       \param num le numero de la ligne
       \param tab l identifiant du tableau
       \return string[string[]]
    */
    TaskReader.prototype.analyse = function ( line, tab ) {
	this.Current = [];
	var All_text = this.getText(line, tab);
	this.Current['USER'] = this.getUser(All_text);
	this.Current['TASK'] = this.getTask(All_text);
	this.Current['OBJECT'] = this.getObject(All_text);
	this.Current['BEGIN'] = this.getBegin(All_text);
	this.Current['END'] = this.getEnd(All_text);
	this.Current['COMM'] = this.getComm(All_text);
	this.Current['STATE'] = this.getState(All_text);
	this.Current['DELAY'] = this.getDelay(All_text);
	return this.Current;
    };


    /**
       \brief Lis le status de la tache
       \param string[int] la ligne
       \return string
    */
    this.getState = function ( line ) {
	if ( line.length == 13 ) {
	    return line[8];
	} else {
	    return null;
	}
    };


    /**
       \brief Renvoi le delai
       \param string[int] la ligne
       \return int le delai restant
     */
    this.getDelay = function ( line ) {
	if ( line.length == 13 ) {
	    var i = line[9];
	    return parseInt(i,10);
	} else {
	    return null;
	}
    };

    /**
       \brief Lis le commentaire qui commence par "Nom" 
       \brief un Nom est sous la forme "(Nom du dossier | Nom de l'etude) : blalbla"
       \param string le texte du commentaire
       \return string[string] (ex: ["dossier"] : "Machin" || ["étude"] : "Machin")
     */
    this.getCommNom = function ( text ) {
	var read_def = false, read_title = false;
	var word = "", def = "", title = '', nb_space = 0;
	for ( var i = 0 ; i < text.length ; i++ ) {
	    if ( text[i] == ":" ) {
		read_def = true;
		read_title = false;
	    } else if ( text[i] == ' ' || text[i] == '\'' ) {
		if ( !read_def && (word == "du" || word == "l" )) {
		    read_title = true;
		} else if ( !read_def ) {
		    word = "";
		} else if ( def != "" ) {
		    def = def.concat(text[i]);
		}
	    } else {
		if ( read_title ) {
		    title = title.concat(text[i]);
		} else if ( read_def ) { 
		    def = def.concat(text[i]);
		} else {
		    word = word.concat(text[i]);
		}
	    }
	}
	var tmp = [];
	tmp[title] = def;
	return tmp;
    };

    /**
       \brief Lis un Commentaire qui commence par Contrat
       \brief Un Contrat est sous la forme "Contrat n° 00000... / Nom"
       \param string le texte contenu dans la case commentaire
       \return string[string] ce tableau contient un tableau de deux case (ex: ["CONTRAT"] : [["nom"] : "machin" , ["num"] : "127892"])
     */
    this.getCommContrat = function ( text ) {
	var read_name = false, read_num = false;
	var name = "" , num = "", word = "";
	for ( var i = 0 ; i < text.length ; i++ ) {
	    if ( text[i] == ' ' ) {
		if ( word == "n°" ) {
		    read_num = true;
		    word = "";
		} else if ( read_num ) { 
		    num = num.concat(text[i]);
		} else if ( read_name ) { 
		    name = name.concat(text[i]);
		} else {
		    word = "";
		}
	    } else if ( text[i] == '/' ) { 
		if ( read_num ) {
		    read_num = false;
		    read_name = true;
		}
	    } else {
		if ( read_num ) { 
		    num = num.concat(text[i]);
		} else if ( read_name ) {
		    name = name.concat(text[i]);
		} else {
		    word = word.concat(text[i]);
		}
	    }
	}
	var tmp = [];
	tmp['CONTRAT'] = [];
	tmp['CONTRAT']['nom'] = name.substr(1, name.length);
	tmp['CONTRAT']['num'] = num.substr(0, num.length - 1);
	return tmp;
    };


    /**
       \brief Recupere le commentaire de la tache
       \param string[int] le commentaire
       \return string[string] les informations du commentaire
    */
    this.getComm = function ( line ) {
	if ( line.length == 13 ) {
	    var tab = [];
	    tab['Nom'] = this.getCommNom;
	    tab['Contrat'] = this.getCommContrat;
	    var word = "", find = false, i = 0, text = line[7];
	    while ( i < text.length && !find ) {
		if ( text[i] == ' ' ) {
		    find = true;
		} else {
		    word = word.concat(text[i]);
		}
		i++;
	    }
	    if ( word != "" ) {
		if ( tab[word] != undefined ) {
		    var result = tab[word](text);
		    return result;
		} else {
		    return text;
		}
	    } else {
		return null;
	    }
	} else {
	    return null;
	}
    };


    /**
       \brief Recupere la date de creation de la tache
       \param string[int] un tableau de texte
       \return string
    */
    this.getBegin = function( line ) {
	if ( line.length == 13 ) {
	    return line[5];
	} else {
	    return null;
	}
    };



    /**
       \brief Recupere la date d echeance de la tache
       \param string[int] la ligne
       \return string
     */
    this.getEnd = function( line ) {
	if ( line.length == 13 ) {
	    return line[6];
	} else {
	    return null;
	}
    };



    /**
       \brief Recupere le contenu d'un ligne dans un tableau pour ne pas avoir a utiliser casper.evaluate
       \param int le numero de la ligne 
       \param string l identifiant du tableau
       \return string[int] un tableau de texte
     */
    this.getText = function ( num, tab ) {
	var elem = casper.evaluate( function( num, tab ) {
	    var table = [];
	    
	    var element = document.querySelector(tab);
	    if ( element != null ) {
		element = element.children[num].children;
		for ( var i = 0 ; i < element.length ; i++ ) {
		    if ( i == 4 ) {
			table[i] = element[i].children[0].innerHTML;
		    } else if ( i == 7 ) {
			table[i] = element[i].children[0].innerHTML;
		    } else {
			table[i] = element[i].innerHTML;
		    }
		}
		return table;
	    } else {
		return null;
	    }
	}, num, tab);
	return elem;
    };


    /**
       \brief lis la ligne et renvoi l'utilisateur
       \param line un <tr>
       \return string l'utilisateur
    */
    this.getUser = function ( line ) {
	if ( line.length == 13 ) {
	    return line[2];
	} else {
	    return null;
	}
    };

    /**
       \brief lis la ligne et renvoi le type de tache ainsi que son etat (valide, accepte, ...)
       \param line un <tr>
       \return string[string] TYPE, STATE
    */
    this.getTask = function ( line ) {
	if ( line.length == 13 ) {
	    return task_analyser.get(line[3]);
	} else {
	    return null;
	}
    };

    /**
       \brief Creer un tableau d'element avec leurs numero
       \param line la ligne
       \return string[string]
     */
    this.getObject = function( line ) {
	if ( line.length == 13 ) {
	    var chaine = line[4];
	    var nb_space = 0, word = '', tab = [];
	    var def = "", read_def = false, all = "";
	    for ( var i = 0 ; i < chaine.length ; i++ ) {
		if ( chaine[i] == " " ) {
		    nb_space++;
		} else if (chaine.charCodeAt(i) == 10 ) {
		    if ( def != "" && all != "" ) {
			nb_space = 0;
			tab[all.substr(0, all.length - 1)] = def;
			all = def = "";
			read_def = false;
		    }
		} else if ( i == chaine.length - 1 ) {
		    if ( def != "" && all != "" ) {
			nb_space = 0;
			tab[all.substr(0, all.length - 1)] = def.concat(chaine[i]);
			all = def = "";
			read_def = false;
		    }
		} else {
		    if ( nb_space != 0 ) {
			if ( read_def ) {
			    def = def.concat(chaine[i]);
			} else if ( word == "n°" ) {
			    word = "";
			    nb_space = 1;
			    def = chaine[i];
			    read_def = true;
			} else {
			    all = all.concat(word);
			    for ( var j = 0 ; j < nb_space ; j++ ) { all = all.concat(" "); }
			    nb_space = 0;
			    word = chaine[i];
			}
		    } else {
			word = word.concat(chaine[i]);
		    }
		}
	    }
	    return tab;
	} else {
	    return null;
	}
    };
    

    /**
       \brief Retourne tout les attribut de la variable tache charger precedement
       \param void
       \return Array() contient tout type de donne a l'interieur voir l entete du fichier
    */
    TaskReader.prototype.get = function() {
	return this.Current;
    };


    /**
       \brief Renvoi un element de la tache lu
       \brief l'avantage de cette methode est que la classe ne charge pas toute la ligne juste l'element voulu;
       \elem le nom de l element (OBJECT, COMM ...)
       \num le numero de la ligne 
       \tab l identifiant du tableau
       \return value la valeur sous forme de texte
    */
    TaskReader.prototype.getElem = function( elem , num , tab){
	var All_text = this.getText(num, tab);
	if ( All_text != null ) {
	    this.func['USER'] = this.getUser;
	    this.func['TASK'] = this.getTask;
	    this.func['OBJECT'] = this.getObject;
	    this.func['BEGIN'] = this.getBegin;
	    this.func['END'] = this.getEnd;
	    this.func['COMM'] = this.getComm;
	    this.func['STATE'] = this.getState;
	    this.func['DELAY'] = this.getDelay;
	    if ( this.func[elem] != undefined ) {
		return this.func[elem](All_text);
	    } else {
		return null;
	    }
	} else {
	    return null;
	}
    };


    /**
       \brief Recherche un element dans un tableau en fonction de son chemin
       \param element un Namespace decouper
       \param result le resultat d'un recherche
       \return la valeur 
     */
    this.getElemFromNamespace = function ( elem , res ) {
	var find = false, found = true;
	for ( var i = 1 ; i < elem.length ; i++ ) {
	    find = false;
	    for ( var j in res ) {
		if ( j == elem[i] ) {
		    res = res[j];
		    find = true;
		}
	    }
	    if ( !find ) {
		found = false;
	    }
	}
	if ( found ) {
	    return res;
	} else {
	    return null;
	}
    };
    



    /**
       \brief Parcours tout les noeud du tableau a la recherche d'un resultat
       \param elem l element rechercher (Namespace)
       \param value la valeur que doit avoir l element
       \param tab l identifiant du tableau
       \return le numero de la ligne ou -1 si introuvable
     */
    TaskReader.prototype.find = function ( elem ,  value , tab ) {
	var i = 0, find = false, end = false;
	var element = this.decoupe(elem);
	while ( !find && !end ) {
	    var result = this.getElem(element[0], i, tab);
	    if ( result != null ) {
		find = (this.getElemFromNamespace(element, result) == value);
		if ( !find ) {
		    i++;
		}
	    } else {
		end = true;
		i = -1;
	    }
	    
	}
	return i;
    };



    /**
       \brief va decoupe la chaine en suivant les "::" 
       \param string la chaine a decouper
       \return un tableau de chaine
    */
    this.decoupe = function( chaine ) {
	var elements = [];
	var j = 0;
	elements[j] = "";
	for ( var i = 0 ; i < chaine.length ; i++ ) {
	    if ( chaine[i] == ':' ) {
		if ( i < chaine.length - 1 && chaine[i+1] == ':' ) {
		    j++;
		    elements[j] = "";
		    i++;
		}
	    } else {
		elements[j] = elements[j].concat(chaine[i]);
	    }
	}
	return elements;
    };


};					


window.task_reader = new TaskReader();

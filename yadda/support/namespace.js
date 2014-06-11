/**
   ====================================================================
   Classe qui va permettre de nommer les identiifiant de par namespace 
   ====================================================================


   Exemple: le get('Dossier::Nom') renverra '#identifiantDuNomDossier"
   le get('FicheIJ::Nom') renverra '#identifiantDeLaFicheIJ"
   ...
   J'appelle un espace de nommage Dossier, ou FicheIJ


   Information: Les donnes seront stocker dans des fichiers dans le 
   repertoire 'informations' celui ci est a la racine 
   du projet
   
*/





window.Namespace = function( ) {
    
    this.Index = []; // Permet de stocker les fichiers deja lu pour ne pas les relire
    this.Data = []; // va stocker les different espace de nommage ainsi que leurs descendants.
    this.Save = null; // stocke les variables a enregistrer
    this.tmp_chaine = "";
    this.Static = [];
    this.line = 0;
    this.col = 0;

    /**
       \brief Cette methode va examiner une variable pour dore si elle est au format Namespace ou non
       \brief un element qui n'est pas au format commence par not!
       \param what element a tester
       \return boolean true si il est au bien format
    */
    Namespace.prototype.isReal = function ( what ) {
	var word = "", i = 0;
	while ( i < 4 && i < what.length ) {
	    word = word.concat(what[i]);
	    i++;
	}
	return word != "not!";
    };


    /**
       \brief Cette methode va examiner une variable pour dore si elle est au format Namespace ou non
       \brief un element qui n'est pas au format commence par not!
       \param what element a tester
       \return boolean true si il est au bien format
    */
    Namespace.prototype.isStatic = function ( what ) {
	var i = what.indexOf ( "static!" );
	return i == 0;
    };



    /**
       \brief Cette methode va charger le fichier correspondant a l'espace de nommage.
       \brief il va ensuite renvoyer un Node correspondant a l'element demande.
       \param string le nom de l'element demande. ex: "Dossier::Nom"
       \return Node | null / si l'element n'existe pas il sera renvoyer null
    */
    Namespace.prototype.get = function ( what ) {
	var elements = this.decoupe(what);
	if ( this.isReal( elements[1] ) ) {
	    var result = null;
	    if ( elements.length > 0 ) {
		if ( typeof(this.Index[elements[0]]) == 'undefined' ) {
		    // On ne connait pas cette element on doit lire le fichier
		    this.Data[elements[0] + "::" + elements[1]] = this.readFile('informations/' + elements[0] + "/" + elements[1] + ".info");  
		    this.Index[elements[0] + "::" + elements[1]] = true;
		}

		if ( this.isStatic( elements[1] ) ) {
		    elements[1] = elements[1].substr( ("static!").length , elements[1].length );
		    result = this.Search_in_Static(elements);
		} else {
		    result = this.Search(elements);
		}
		if ( result != null ) {
		    if ( result[0] ) {
			return result[1];
		    } else {
			return result[1].getId();
		    }
		} else {
		    return null;
		}
	    } else {
		return null;
	    }
	} else {
	    return elements[1].substr(4, elements[1].length);
	}

    };
    
    /**
       \brief Cherche l'identifiant d'un element 
       \param string[] un chemin vers l'element a trouver
       \return Node le noeud correspondant
    */
    this.Search = function( tab ) {
	var cur_node = this.Data[tab[0] + "::" + tab[1]];
	var found = cur_node;
	var value = null;
	if ( typeof(cur_node) != 'undefined' ) {
	    for ( var i = 1 ; i < tab.length ; i++ ) {
		var j = 0, find = false;
		while ( j < cur_node.children.length && !find ) {
		    var tab_title = this.is_title_template ( tab[i] ), title = tab[i];
		    if ( tab_title != false ) {
			title = tab_title[0];
			value = tab_title[1];
		    }
		    if ( cur_node.children[j].getTitle() == title ) {
			cur_node = cur_node.children[j];
			find = true;
		    }
		    j++;
		}
		if ( find && i == tab.length - 1 ) {
		    found = cur_node;
		} else {
		    found = null;
		}
	    }
	}
	if ( found != null ) {
	    if ( found.is_template ) {
		return [ true , this.Parse ( found , value ) ];
	    } else {
		return [ false, found ];
	    }
	} else {
	    return this.Search_in_Static( tab );
	}

    };

    /**
       \brief Cherche dans les elements Static si la valeur n'y est pas stocker
       \param string[] le chemin
       \return Node
    */
    this.Search_in_Static = function ( tab ) {
	var cur_node = this.Static[ tab[1] ];
	var found = cur_node;
	if ( cur_node != undefined ) {
	    for ( var i = 1 ; i < tab.length ; i++ ) {
		var j = 0, find = false;
		while ( j < cur_node.children.length && !find ) {
		    var tab_title = this.is_title_template ( tab[i] ), title = tab[i];
		    if ( tab_title != false ) {
			title = tab_title[0];
			value = tab_title[1];
		    }
		    if ( cur_node.children[j].getTitle() == title ) {
			cur_node = cur_node.children[j];
			find = true;
		    }
		    j++;
		}
		if ( (find && i == tab.length - 1 ) || tab.length == 2 ) {
		    found = cur_node;
		} else {
		    found = null;
		}
	    }
	}
	if ( found != null ) {
	    if ( found.is_template ) {
		return [ true , this.Parse ( found , value ) ];
	    } else {
		return [ false, found ];
	    }
	} else {
	    return null;
	}	
    };



    /**
       \brief Verifie que le noeud rechercher est un template
       \param string la chaine a tester
       \return bool | [ string , string ]
     */
    this.is_title_template = function ( string ) {
	var i = string.indexOf ( '!(' ) ;
	var j = string.indexOf ( ")" );
	if ( i != -1 && j != -1 ) {
	    var value = string.substr ( i + 2 , j - ( i+2 ) );
	    string = string.substr ( 0 , i );
	    return [ string , value ];
	}
	return false;
    };


    /**
       \brief Lis le fichier de namespace
       \param string le nom du fichier
       \return Node un Node contenant toute les donner lu dans le fichier
    */
    this.readFile = function( filename ) {
	var fs = require('fs');
	if ( fs.existsSync( filename ) ) {
	    this.line = 1;
	    this.col = 0;
	    var string = fs.read(filename);
	    var elem = this.read_node(string, 0);
	    var i = 0;
	    elem = elem[0];
	    return elem;
	} else {
	    return undefined;
	}
    };



    /**
       \brief lis un noeud ( fonction recursive indirecte ( read_children -> read_node -> read_children ) )
       \param string le texte a lire
       \param int l index ou commencer la lecture
       \return [Node, int] un noeud, l'index ou continuer
    */
    this.read_node = function ( chaine , i ) {
	var title = this.read_title( chaine , i );
	if ( title[0] != null && title[0] != false) {
	    var definition = this.read_definition ( chaine, title[1] );
	    var template = this.is_template ( definition [0] );
	    var node;
	    if ( template != false ) {
		node = this.read_tmp_children ( chaine , definition[1], title[0], definition[0], definition[2], template );
	    } else {
	    	node = this.read_children ( chaine , definition[1] , title[0] , definition[0] , definition[2] );
	    }
	    if ( title[2] ) {
		this.Static[title[0]] = node[0];
	    }
	    return node;
	} else if ( title[0] == false ) {
	    return [ null , title[1] ];
	} else {
	    casper.echo ( 'Noeud corrompu ( Noeud et enfant ignore ) ligne:' + this.line + ' col:' + this.col );
	    return [ null , title[1] ];
	}
    }

    /**
       \brief Lis les noeuds fils 
       \param string le texte a lire
       \param int l'index ou commence la lecture
       \param string le titre du noeud courant
       \param string la definition du noeud courant
       \param boolean l'element a des enfant
       \return [Node, int] le noeud fils , l index
    */
    this.read_tmp_children = function ( chaine , i , title , definition , hasChild , template ) {
	if ( title == null || definition == null ) {
	    casper.echo ( 'Erreur survenu ( Noeud et enfant ignore ) ligne:' + this.line + ' col:' + this.col );
	    return [ null , i ];
	} else {
	    var elem = new Node ( title, definition );
	    if ( hasChild ) {
		while ( hasChild ) {
		    this.col++;
		    var child = this.read_node(chaine, i ); // On enclenche la recursivite
		    if ( child[0] != null ) {
			elem.addChild(child[0]);
			i = child[1];
		    } else {
			i = child[1];
			hasChild = false;
		    }
		}
	    } 
	    
	    var end = false, default_ = null, par_open = false;
	    var anc_i = i;
	    while ( !end && i < chaine.length ) {
		if ( chaine[i] == "\n" ) {
		    casper.echo ( chaine[i-1] );
		    this.line++;
		    this.col = 0;
		}
		if ( chaine[i] != "(" && chaine[i] != '\n' && chaine[i] != "	" && chaine[i] != " " && default_ == null ) {
		    i = anc_i;
		    end = true;
		} else if ( chaine[i] == "(" ) {
		    default_ = "";
		} else if ( chaine[i] == ")" ) {
		    end = true;
		} else if ( default_ != null ) {
		    if ( chaine[i] == "~" ) {
			par_open = !par_open;
		    } else if ( par_open ) {
			default_ = default_.concat( chaine[i] );
		    } else {
			if ( chaine[i] != " " && chaine[i] != '\n' && chaine[i] != "	" ) {
			    default_ = default_.concat( chaine[i] );
			}
		    }
		}
		i++;
		this.col++;
	    }
	    if ( template != null ) {
		elem.tmp_min_size = -1 , elem.tmp_max_size = -1;
		if ( template[1] != "" ) { elem.tmp_min_size = parseInt( template[1], 10 ); }
		if ( template[2] != null ) { elem.tmp_max_size = parseInt( template[2], 10 ); } 
		if ( template[1] != "" && ( template[2] == null || elem.tmp_max_size < elem.tmp_min_size )) { elem.tmp_max_size = parseInt ( template[1] , 10 ); }
		elem.is_template = true;
		elem.tmp_type = template[0];
		elem.default_tmp = default_;
	    }
	    return [ elem , i ];
	}
    }

    /**
       \brief Verifie si un noeud lu dans un .info est un template
       \param string la definition du noeud
       \return bool
     */
    this.is_template = function ( string ) {
	if ( string != null ) {
	    var i = string.indexOf ( '<' );
	    if ( i == -1 ) {
		return false;
	    } 
	    var j = string.indexOf ( '>' );
	    if ( j == -1 ) {
		return false;
	    }
	    var type = "", min = null, max = null;
	    for ( var k = i + 1 ; k < j ; k++ ) {
		if ( string[k] == "(" ) {
		    min = "";
		} else if ( string[k] == ":" ) {
		    max = "";
		} else if ( string[k] != ")" ) {
		    if ( max != null ) {
			max = max.concat(string[k]);
		    } else if ( min != null ) {
			min = min.concat( string[k] );
		    } else {
			type = type.concat ( string[k] );
		    }
		}
	    }
	    return [ type , min , max ];	
	} else {
	    return false;
	}
    };


    /**
       \brief Lis les noeuds fils 
       \param string le texte a lire
       \param int l'index ou commence la lecture
       \param string le titre du noeud courant
       \param string la definition du noeud courant
       \param boolean l'element a des enfant
       \return [Node, int] le noeud fils , l index
    */
    this.read_children = function ( chaine , i , title , definition , hasChild ) {
	if ( title == null || definition == null ) {
	    casper.echo ( 'Erreur survenu ( Noeud et enfant ignore ) ligne:' + this.line + ' col:' + this.col );
	    return [ null , i ];
	} else {
	    var elem = new Node ( title, definition );
	    if ( hasChild ) {
		while ( hasChild ) {
		    this.col++;
		    var child = this.read_node(chaine, i); // On enclenche la recursivite
		    if ( child[0] != null ) {
			elem.addChild(child[0]);
			i = child[1];
		    } else {
			i = child[1];
			hasChild = false;
		    }
		}
		return [ elem , i ];
	    } else {
		return [ elem , i ];
	    }
	}
    }


    /**
       \brief lis la definition d'un noeud
       \param string le texte a lire
       \param int l'index ou commence la lecture
       \return [string, int, bool] la definition, l'index, si il y a des enfants
    */
    this.read_definition = function ( chaine , i ) { 
	var end = false, def = "", return_ = null, space_ok = false;
	while ( !end ) {
	    if ( chaine[i] == "\n" ) {
		this.line++;
		this.col = 0;
	    }
	    var type_com = this.is_com ( chaine , i );
	    if ( type_com != false ) {
		i = this.get_end_com ( chaine , i , type_com ); 
	    }
	    if ( i < chaine.length - 1 ) {
		if ( chaine[i] == "{" ) {
		    if ( def != "" ) {
			this.col++;
			return_ = [ def , i + 1 , true ];
			end = true;
		    } else {
			casper.echo ( 'Noeud mal forme (definition manquante) ligne:' + this.line + " col:" + this.col );
			this.col++;
			return_ = [ null , i + 1 , false ];
			end = true;
		    }
		} else if ( chaine[i] == ";" ) {
		    if ( def != "" ) {
			this.col++;
			return_ = [ def , i + 1 , false ];
			end = true;
		    } else {
			casper.echo ( 'Noeud mal forme (definition manquante) ligne:' + this.line + " col:" + this.col );
			this.col++;
			return_ = [ null , i + 1 , false ];
			end = true;
		    }
		} else if ( chaine[i] == "}" || ( chaine[i] == ":" && !space_ok ) ) {
		    casper.echo ( 'Element inattendu ' + chaine[i] + ' ligne:' + this.line + " col:" + this.col );
		    this.col++;
		    return_ = [ null , i + 1 , false ];
		    end = true;
		} else if ( chaine[i] == "~" ) {
		    space_ok = !space_ok;
		} else {
		    if ( ( chaine[i] != " " && chaine[i] != "\n" && chaine[i] != "	" ) || space_ok  ) {
			def = def.concat( chaine[i] );
		    }
		}
	    } else {
		casper.echo ( 'Fin de fichier inattendu ligne:' + this.line + ' col:' + this.col );
		return_ = [ null , i , false ];
		end = true;
	    }
	    i++;
	    this.col++;
	}
	return return_;
    }




    /**
       \brief Lis un le titre d'un noeud
       \param le texte a lire
       \return [string, int] le titre du noeud, l'index du texte
    */
    this.read_title = function ( chaine , i ) { 
	var end = false, title = "", return_ = null, static_ = false;
	while ( !end ) {
	    if ( chaine[i] == "\n" ) {
		this.line++;
		this.col = 0;
	    }
	    var type_com = this.is_com ( chaine , i );
	    if ( type_com != false ) {
		i = this.get_end_com ( chaine , i , type_com ); 
	    }
	    if ( title == "static" ) {
		title = "";
		static_ = true;
	    }
	    if ( i < chaine.length - 1 ) {
		if ( chaine[i] == ":" ) {
		    if ( title != "" ) {
			end = true;
			this.col++;
			return_ = [ title , i + 1 , static_];
		    } else {
			casper.echo ( 'Noeud mal forme (Titre vide) ligne:' + this.line + " col:" +  this.col );
			this.col++;
			return_ = [ null , i + 1 ];
			end = true;
		    }
		} else if ( chaine[i] == "{" || chaine[i] == ";" || ( chaine[i] == "}" && title != "" ) ) {
		    casper.echo ( 'Noeud mal forme (Definition manquante) ligne:' + this.line + " col:" + this.col );
		    this.col++;
		    return_ = [ null , i + 1 ];
		    end = true;
		} else if ( chaine[i] == "}" ) {
		    if ( title == "" ) {
			this.col++;
			return_ = [ false , i + 1 ];
			end = true;
		    }
		} else {
		    if ( chaine[i] != " " && chaine[i] != '\n' && chaine[i] != "	" ) {
			title = title.concat( chaine[i] );
		    } 
		}
	    } else {
		casper.echo ( title );
		if ( title != "" ) {
		    casper.echo ( 'Fin de fichier inattendu ligne:' + this.line + " col:" + this.col );
		    return_ = [null, i];
		} else {
		    return_ = [false, i];
		}
		end = true;
	    }
	    i++;
	    this.col++;
	}
	return return_;
    }



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
		} else {
		    elements[j] = elements[j].concat(chaine[i]);
		}
	    } else {
		elements[j] = elements[j].concat(chaine[i]);
	    }
	}
	return elements;
    };


    /**
       \brief Enregistre l'element dans le tableau de Sauvegarde et ecris le tableau dans le fichier
       \param elem le nom de l'element 
       \param value la valeur de l'element 
    */
    Namespace.prototype.save = function ( elem, value ) {
	var elements = this.decoupe( elem );
	if ( this.Save == null ) { this.Save = this.readFile('informations/GLOBAL/Save.info'); }
	this.insert( elements, value );
	this.tmp_chaine = "";
	this.write(this.Save, '');
	var fs = require('fs');
	fs.write('informations/GLOBAL/Save.info', this.tmp_chaine, 0, this.tmp_chaine.length, null);
	this.tmp_chaine = "";
    };


    Namespace.prototype.eraseSave = function ( ) {
	this.Save = new Node( 'GLOBAL', '#' );
	this.Save.addChild(new Node('Save', '#'));
	this.write(this.Save, '');
	var fs = require('fs');
	fs.write('informations/GLOBAL/Save.info', this.tmp_chaine, 0, this.tmp_chaine.length, null);
	this.tmp_chaine = "";
    };



    this.insert = function ( elements, value ) {
	var current = this.Save.children[0];
	var find = false, j = 0, i = 0, finish = false;
	while ( i < elements.length && !finish ) {
	    j = 0;
	    find = false;
	    while ( j < current.children.length && !find ) {
		if ( current.children[j].getTitle() == elements[i] ) {
		    
		    current = current.children[j];
		    find = true;
		}
		j++;
	    }
	    if ( !find ) {
		finish = true;
		for ( var e = i ; e < elements.length ; e++ ) {
		    var tmp;
		    if ( e < elements.length - 1 ) {
			tmp = new Node(elements[e], "# ");
		    } else {
			tmp = new Node(elements[e], value);
		    }
		    current.addChild(tmp);
		    current = current.children[current.children.length - 1];
		}
	    } else if ( find && i == elements.length - 1 ) {
		current.m_Id = value;
	    }
	    i++;
	}
    };


    this.write = function ( node, tab ) {
	if ( node.getTitle() == "Save" ) {
	    this.tmp_chaine = this.tmp_chaine.concat('\n' + tab + "static " + node.getTitle() + " : ~" + node.getId() + "~" );
	} else {
	    this.tmp_chaine = this.tmp_chaine.concat('\n' + tab + node.getTitle() + " : ~" + node.getId() + "~" );
	}
	if ( node.children.length != 0 ) {
	    this.tmp_chaine = this.tmp_chaine.concat(' {\n');
	    for ( var i = 0 ; i < node.children.length ; i++ ) {
		this.write(node.children[i], tab.concat('    '));
	    } 
	    this.tmp_chaine = this.tmp_chaine.concat('\n' + tab + '}');
	} else {
	    this.tmp_chaine = this.tmp_chaine + ";\n";
	}
    };

    /**
       \brief Verifie si l'on est devant un commentaire
       \param string le texte a lire
       \param int l endroit a analyser
       \return type | false le type du commentaire 'multiline' , 'line' | faux si il n'y as pas de commentaire
     */
    this.is_com = function ( file , index ) {
	if ( file[index] == '/' ) {
	    if ( index < file.length - 1 ) {
		if ( file[index + 1] == '/' ) {
		    return 'line';
		} else if ( file[index + 1] == '*' ) {
		    return 'multiline';
		} else {
		    return false;
		}
	    } else {
		return false;
	    }
	} else {
	    return false;
	}
    };

    /**
       \brief Cherche la fin d'un commentaire dans le fichier
       \param texte  le texte a analyser
       \param index ou commence la lecture
       \param type le type de commentaire : 'mutliline' , 'line'
       \return int l'index de la fin du commentaire 
     */
    this.get_end_com = function ( texte , index , type ) {
	var find = false;
	if ( type == 'line' ) {
	    index += 2;

	    while ( index < texte.length && !find ) {
		if ( texte[index] == '\n' ) {
		    this.line ++;
		    this.col = 0;
		    find = true;
		}
		index++;
		this.col++;
	    }
	    if ( find ) { return index + 1; }
	    else { return texte.length; }
	} else if ( type == 'multiline' ) {
	    index += 2;
	    while ( index < (texte.length - 1) && !find ) {
		if ( texte[index] == '*' && texte[index + 1] == '/' ) {
		    find = true;
		}
		if ( texte[index] == "\n" ) {
		    this.line ++;
		    this.col = 0;
		}
		this.col++;
		index++;
	    }
	    if ( find ) { return index + 1; }
	    else { return texte.length; }
	} else {
	    return index;
	}
    };

    
    /**
       \brief Affiche un Noeud 
       \param node un neoud 
       \param int le nombre d'espace a mettre devant ( decalage pour faire un arbre )
       \return void 
     */
    this.displayNode = function ( node, space ) {
	if ( node != undefined ) {
	    casper.echo( space + '|-' + node.getTitle() + ' : ' + node.getId());
	    if ( node.is_template ) {
		casper.echo ( space + '    \\->' + node.tmp_type  + " => " + this.Parse(node , node.default_tmp) + " !( " + node.tmp_min_size + " : " + node.tmp_max_size + " )" );
	    }
	    if ( node.children.length != 0 ) {
		casper.echo('|');
	    }
	    for ( var i = 0 ; i < node.children.length ; i++ ) {
		this.displayNode(node.children[i], space + "    ");
	    }
	    if ( node.children.length != 0 ) {
		casper.echo('|');
	    }
	}
    };

    
    this.Parse = function( node , value ) {
	
	if ( value == null ) {
	    value = node.default_tmp;
	}
	if ( node.tmp_type == "int" ) {
	    value = parseInt( value , 10 );
	} else if ( node.tmp_type == "char" ) {
	    value = value.charAt(0);
	} 
	if ( value.length < node.tmp_min_size && node.tmp_min_size != -1 ) {
	    for ( var i = value.length ; i < node.tmp_min_size ; i++ ) { 
		value = value.concat ( "_" );
	    }
	} else if ( value.length > node.tmp_max_size && node.tmp_max_size != -1 ) {
	    value = value.substr ( 0 , node.tmp_max_size );
	} 
	var i = node.m_Id.indexOf( '<' );
	var j = node.m_Id.indexOf ( '>' );
	var result = node.m_Id.substr (0 , i ) + value +  node.m_Id.substr ( j + 1 , node.m_Id.length );
	return result;

    };

    /**
       \brief affiche toute les donnees stocker dans l'objet
       \param void
       \return void
     */
    this.display = function () {
	for ( var j in this.Data ) {
	    this.displayNode(this.Data[j], "|");
	    casper.echo('|');
	}

	for ( var j in this.Static ) {
	    this.displayNode(this.Static[j], "|");
	    casper.echo('|');
	}
    };
};



window.namespace = new Namespace();




/**

   ========================================================================
   Classe Node qui va etre les elements contennu dans l'index du Namespace 
   ========================================================================

*/


window.Node = function( title, id ) {
    
    this.children = [];//cette Array est un Array de Node fils;
    this.m_Id = id;
    this.m_Title = title;
    this.is_tmp = false;
    this.tmp_type = null;
    this.default_tmp = null;
    this.tmp_min_size = -1;
    this.tmp_max_size = -1;




    this.getId = function() {
	return this.m_Id;
    };

    this.getTitle = function() {
	return this.m_Title;
    };


    this.getChildren = function( ) {
	return this.m_children;
    };


    this.addChild = function(Node) {
	this.children[this.children.length] = Node;
    };
    
 
  
};


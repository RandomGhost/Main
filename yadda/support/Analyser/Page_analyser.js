/**
   =========================================================
   Va tenter de creer un fichier .info a partir d'une page
   =========================================================

*/


window.PageAnalyser = function ( ) {
    this.Save = null; // stocke les variables a enregistrer
    this.tmp_chaine = "";
    /**
       \brief Recopie la page dans un tableau pour donner tout les elements
       \param void
       \return {string, {}, string, []}
    */
    this.analyse = function( page ) {
	/**
	   {TAG, [ATTR] , INNER, [CHILDREN], boolean }
	*/
	var table = casper.evaluate( function ( ) {
	    function get_node ( obj ) {
		var elem = {};
		elem['TAG'] = obj.tagName;
		elem['ATTR'] = {};
		for ( var i = 0 ; i < obj.attributes.length ; i++ ) {
		    elem['ATTR'][obj.attributes[i].name] = obj.attributes[i].value;
		}
		elem['INNER'] = obj.innerHTML;
		elem['CHILDREN'] = [];
		for ( var j = 0 ; j < obj.children.length ; j++ ) {
		    elem['CHILDREN'].push(get_node(obj.children[j]));
		}
		elem['FINAL'] = obj.children.length == 0;
		return elem;
	    }
	    
	    return get_node(document.querySelector('body'));
	});
	return table;
    };

    this.displayNode = function ( node, space ) {
	casper.echo( space + '|-' + node.getTitle() + ' : ' + node.getId());
	if ( node.children.length != 0 ) {
	    casper.echo('|');
	}
	for ( var i = 0 ; i < node.children.length ; i++ ) {
	    this.displayNode(node.children[i], space + "    ");
	}
	if ( node.children.length != 0 ) {
	    casper.echo('|');
	}
    };
    
    this.interpret = function( table , page ) {
	this.Save = new Node(session.get('type_user') , "#");
	this.Save.addChild(new Node( page, '#'));
	this.interpretNode( table , page );
	this.write(this.Save, '');
	var fs = require('fs');
	fs.write('' + session.get('type_user') + "::" + page + '.info', this.tmp_chaine, 0, this.tmp_chaine.length, null);
	this.tmp_chaine = "";
    };

    this.insert = function ( elements, value ) {
	var current = this.Save;
	var find = false, j = 0, i = 0, finish = false;
	while ( i < elements.length && !finish ) {
	    j = 0;
	    find = false;
	    if ( elements[i] == "" ) {
		i++;
	    }
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

    this.Accent = function ( char_ ) { 
	if ( char_ == 'â' ) {
	    return "a";
	} else if ( char_ == "é" || char_ == "è" ) {
	    return "e";
	} else {
	    return char_;
	}
    };



    this.epur = function ( string ) {
	var word = '' , all ='';
	for ( var i = 0 ; i < string.length ; i++ ) {
	    if ( string[i] == ' ' || string [i] == '\n' || string[i] == "\'"  || string[i] == '&' || string[i] == '	' ) {
		if ( !(word == 'de' || word == 'du' || word == 'la' || word == 'le' || word == "d"  ||  word == "nbsp;:" || word == "l" ) ) {
		    all = all.concat(word);   
		}
		if ( word != "" && i != string.length - 1) {
		    all = all.concat('_');
		}
		word = "";
	    } else if ( i == string.length - 1 ) {
		if ( !(word == 'de' || word == 'du' || word == 'la' || word == 'le' || word == "nbsp;" || word == "d" ||  word == "nbsp;:" || word == "l" ) ) {
		    if ( string[i] != '	' ) {
			all = all.concat(word.concat(string[i].concat('_')));   
		    } else {
			all = all.concat(word.concat('_'));   
		    }
		} 
		   
	    } else {	
		if ( string[i] != "°" ) {
		    word = word.concat(this.Accent(string[i]));
		}
	    }
	}
	return all;
    };

    this.interpretNode = function ( node , current ) {
	if ( node['TAG'] == 'DIV' ) {
	    if ( this.isSection(node) ) {
		if ( node['CHILDREN'][0]['FINAL'] == true ) {
		    current  =  current + "::" + this.epur(this.getFinal(node));
		    this.insert( this.decoupe ( current ) , "~" + this.Class(node['ATTR']['class']) + "~" );
		}
		
	    } else  {
		var type = this.isInput(node);
		if ( type ) {
		    if ( type == "text" && node['CHILDREN'][1] != undefined ) {
			current = current + "::" + this.epur(this.getFinal(node['CHILDREN'][0]));
			this.insert( this.decoupe( current ) , "~" + this.Id(this.getInput(node)['id']) + '~' );
		    } else if ( type == "select" ) {
			current = current + "::" + this.epur(this.getFinal(node['CHILDREN'][0]));
			this.insert( this.decoupe( current ), "~" + this.Id(node['CHILDREN'][1]['CHILDREN'][0]['CHILDREN'][1]['ATTR']['id']) + "~");
		    } else if ( type == "button" ) {
			if ( node['CHILDREN'][0]['ATTR']['value'] != undefined)  {
			    current = current + "::" + this.epur(node['CHILDREN'][0]['ATTR']['value']);
			    if ( node['CHILDREN'][0]['ATTR']['id'] != undefined ) {
				this.insert( this.decoupe( current ), "~" + this.Id(node['CHILDREN'][0]['ATTR']['id']) + "~");
			    } else {
				this.insert( this.decoupe( current ), '~input[value="' + node['CHILDREN'][0]['ATTR']['value'] + '"]~');
			    }
			}
		    }
		} else if ( type ) {
		    current = current + "::" + this.epur(this.getFinal(node['CHILDREN'][0]));
		    casper.echo(this.getFinal(node['CHILDREN'][0]) );
		    casper.displayTab(node['ATTR']);
		    this.insert( this.decoupe( current ) , "~" + this.Id(node['CHILDREN'][1]['ATTR']['id']) + '~' );
		}
	    }
	}
	for ( var i = 0 ; i < node['CHILDREN'].length ; i++ ) {
	    this.interpretNode(node['CHILDREN'][i], current );
	}
    };


    this.getInput = function ( node ) {
	var i = 0, find = false, fi;
	while ( i < node['CHILDREN'].length && !find ) {
	    if ( node['CHILDREN'][i]['TAG'] == 'INPUT' ) {
		fi = node['CHILDREN'][i]['ATTR'];
		find = true;
	    } else if ( !node['CHILDREN'][i]['FINAL'] ) {
		var j = this.getInput( node['CHILDREN'][i] ) ;
		if ( j ) {
		    fi = j;
		    find  = true;
		}
	    }
	    i++;
	}
	return find ? fi : false;

    };


    this.getFinal = function ( node ) {
	var current = node;
	while ( !current['FINAL'] && current['CHILDREN'] ) {
	    for ( var i = 0 ; i < current['CHILDREN'].length ; i++ ) {
		if ( current['CHILDREN'][i]['ATTR']['style'] != "display: none; " && current['CHILDREN'][i]['TAG'] != 'INPUT' ) {
		    current = current['CHILDREN'][i];
		}
	    }
	}
	return current['INNER'];
    };



    this.Class = function( string ) {
	var all = ".";
	for ( var i = 0 ; i < string.length ; i++ ) {
	    if ( string[i] == ' ' ) {
		all = all.concat('.');
	    } else {
		all = all.concat(string[i]);
	    }
	} 
	return all;
    };

    this.Id = function ( string ) {
	return '#' + string;
    };


    this.isSection = function ( node ) {
	var find =  node['ATTR']['class'] != undefined && node['ATTR']['class'].indexOf('sectionTag') != -1 && !node['FINAL'];
	find = find && ( node['ATTR']['class'].indexOf('wrapper25') != -1 || node['ATTR']['class'].indexOf('wrapper75') != -1 || node['ATTR']['class'].indexOf('search') != -1 );
	return find;
    };

    this.isInput = function( node ) {
	if ( node['ATTR']['class'] != undefined && node['ATTR']['class'].indexOf('input') != -1 && !node['FINAL'] ) {
	    var type = false;
	    if ( node['ATTR']['class'].indexOf('select') != -1 ) {
		type = 'select';
	    } 
	    if ( node['ATTR']['class'].indexOf('text') != -1 ) {
		type = "text";
	    }
	    if ( node['ATTR']['class'].indexOf('date') != -1 ) {
		type = 'date';
	    }
	    return type;
	} else if ( node['ATTR']['class'] != undefined && node['ATTR']['class'].indexOf('Button') != -1 && !node['FINAL'] ) {
	    return 'button';
	} else {
	    return false;
	}
    }; 


    this.write = function ( node, tab ) {
	this.tmp_chaine = this.tmp_chaine.concat('\n' + tab + node.getTitle() + " : " + node.getId()  );
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



};


/**

   ========================================================================
   Classe Node qui va etre les elements contennu dans l'index du Namespace 
   ========================================================================

*/


window.Node = function( title, id ) {
    
    this.children = [];//cette Array est un Array de Node fils;
    this.m_Id = id;
    this.m_Title = title;
    
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

window.page_analyser = new PageAnalyser();









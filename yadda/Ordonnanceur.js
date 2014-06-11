/**
   ================================================================================
   Cette classe va permettre de calculer les dependances entre les differents tests
   ================================================================================
*/








window.depend = function () {
    this.line = 0;
    this.col = 0;
    this.table = [];
    this.size = 0;
    this.error = false;
    
    this.add = function(value) {
	this.table[value] = this.size++;
    };

    this.del = function(value) {
	if ( typeof(this.table[value]) != 'undefined' ) {
	    delete(this.table[value]);
	    this.size--;
	}
    };
};


window.Order = function( ) {
    
    this.Data = [];//tableau a double entrée
    this.Index = []; //tableau contenant les valeurs de identifiant
    this.Final = [];

    /**
       \brief lis le fichier de dependance est creer le tableau de dependance
       \return string[] l'ordre d'appel des fichiers de dependances
    */
    this.generate = function( ) {
	var fs = require('fs');
	var string = fs.read('dependencies.info');
	this.read_alias(string);
	this.read_depends(string);
	if ( !this.error ) {
	    this.create_depend();
	    this.rename();
	    return this.Final;
	} else {
	    return null;
	}
    };


    /**
       \brief lis le fichier de dependance est creer le tableau de dependance
       \param string le nom du fichier de dependance
       \return string[] l'ordre d'appel des fichiers de dependances
    */
    this.generate = function( dep ) {
	var fs = require('fs');
	var string = fs.read(dep);
	this.read_alias(string);
	this.read_depends(string);
	if ( !this.error ) {
	    this.create_depend();
	    this.rename();
	    return this.Final;
	} else {
	    return null;
	}
    };


    this.read_alias = function( file ) {
	var word = "", find = false, title = "", id = "";
	var acc_open = false, finish = false, i = 0, point = false;
	while ( i < file.length && !finish && i != -1) {
	    if ( !find  ) { // on cherche le bloc d'alias
		if ( file[i] == ' ' || file[i] == '\n' || file[i] == '	' ){
		    word = "";
		} else {
		    word = word.concat(file[i]);
		}
		if ( word == "alias" ) {
		    find = true;
		}
	    } else {
		var com = this.is_com ( file, i );
		if ( com != false ){
		    i = this.get_end_com( file , i , com );
		} else if ( file[i] == '{' ) {
		    acc_open = true;
		} else if ( file[i] == '}' ) {
		    finish = true;
		} else if ( file[i] == ':' ) {
		    point = true;
		} else if ( file[i] ==  ';' ) { //on a lu un alias on lis la suite
		    this.Index[id] = title;
		    this.Data[id] = new depend();
		    id = title = "";
		    point = false;
		} else if ( !(file[i] == ' ' || file[i] == '\n' || file[i] == '	') ) {
		    if ( point ) {
			id = id.concat(file[i]);
		    } else {
			title = title.concat(file[i]);
		    }
		} 
	    }
	    i++;
	}
    };


    this.read_depends = function( file ) {
	var word = "", find = false;
	var i = 0, finish = false, first_acc = false, second_acc = false;
	var title = "", value = "";
	this.line = 1;
	while ( i < file.length && !finish ) {
	    this.col++;
	    if ( !find ) {
		if ( file[i] == ' ' || file[i] == '\n' || file[i] == '	' ) {
		    word = "";
		    if ( file[i] == '\n' ) { 
			this.line++;
			this.col = 0;
		    }
		} else {
		    word = word.concat(file[i]);
		}
		if ( word == "dependencies" ) {
		    find = true;
		}
	    } else {
		var com = this.is_com ( file, i );
		if ( com != false ){
		    i = this.get_end_com( file , i , com );
		} else if ( file[i] == '{' ) {
		    if ( first_acc ) {
			second_acc = true;
		    } else {
			first_acc = true;
		    }
		} else if ( file[i] == '}' ) {
		    if ( second_acc ) {
			second_acc = false;
			if ( value != "" ) {
			    if ( this.Data[title] != undefined ) {
				this.Data[title].add(value);
			    } else {
				casper.echo ( "ERROR : " + title + " n'est pas definis ligne : " + this.line + " col : "+ this.col );
				this.error = true;
			    }
			} else if ( this.Data[title] == undefined ) {
			    casper.echo ( "ERROR : " + title + " n'est pas definis ligne : " + this.line + " col : "+ this.col );
			    this.error = true;
			}
			
			value = '';
			title = '';
		    } else {
			first_acc = false;
			finish = true;
		    }
		} else {
		    if ( second_acc ) {
			if ( file[i] == ',' ) {
			    if ( this.Data[title] != undefined ) {
				this.Data[title].add(value);
			    } else {
				casper.echo ( "ERROR : " + title + " n'est pas definie ligne : " + this.line + " col : "+ this.col );
				this.error = true;
			    }
			    value = '';
			} else {
			    if ( file[i] != ' ' && file[i] != '\n' && file[i] != '	'  ) {
				value = value.concat(file[i]);
			    } else if ( file[i] == '\n' ) { 
				this.line++;
				this.col = 0;
			    }
			}
		    } else if ( first_acc ) {
			if ( file[i] != ' ' && file[i] != '\n' && file[i] != '	'  ) {
			    title = title.concat(file[i]);
			    
			} else if ( file[i] == '\n' ) { 
			    this.line++;
			    this.col = 0;
			}
		    }
		}
	    }
	    i++;
	}
    };



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


    this.get_end_com = function ( texte , index , type ) {
	var find = false;
	if ( type == 'line' ) {
	    index += 2;

	    while ( index < texte.length && !find ) {
		if ( texte[index] == '\n' ) {
		    this.line++;
		    this.col = 0;
		    find = true;
		}
		index++;
	    }
	    if ( find ) { return index + 1; }
	    else { return -1; }
	} else if ( type == 'multiline' ) {
	    index += 2;
	    while ( index < (texte.length - 1) && !find ) {
		if ( texte[index] == '\n' ) {
		    this.line++;
		    this.col = 0;
		}
		if ( texte[index] == '*' && texte[index + 1] == '/' ) {
		    find = true;
		}
		index++;
	    }
	    if ( find ) { return index + 1; }
	    else { return -1; }
	} else {
	    return -1;
	}
    };


    this.create_depend = function() {
	var finish = false, pass = false;
	while (!finish ) {
	    pass = false;
	    for ( var i in this.Data ) {
		if ( this.Data[i].size == 0 ) {
		    pass = true;
		    delete(this.Data[i]);
		    this.Final.push(i);
		    for ( var j in this.Data ) {
			this.Data[j].del(i);
		    }
		}
	    }
	    if ( !pass) {
		finish = true;
	    }
	}
    };


    
    this.rename = function() {
	for ( var i = 0 ; i < this.Final.length ; i++ ) {
	    this.Final[i] = this.Index[this.Final[i]];
	}
    };

};


window.order = new Order();
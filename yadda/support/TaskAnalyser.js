/**
   ===============================================================================
   Cette classe va analyser une tache et renvoyer les elements de celle ci

   A ne pas confondre avec taskReader qui lis une ligne de tache alors que cette 
   classe n analyse que la  case tache
   ================================================================================
*/


window.TaskAnalyser = function (  ) {

    this.Current = null;
    
    TaskAnalyser.prototype.get = function ( chaine ) {
	var tab_chaine = this.initArray();
	var word = "", all = "", find = false , i = 0, partial = null, final_ = null;
	while ( !find && i < chaine.length ) {
	    if ( chaine[i] == " " || i == chaine.length - 1 ) {
		all = all.concat(word);
		if (  i == chaine.length - 1 ) {
		    all = all.concat(chaine[i]);
		}
		for ( var j in tab_chaine ) {
		    var result = this.equals(all, j);
		    if ( result == "partial" ) {
			partial = j;
		    } else if ( result == "total" ) {
			find = true;
			final_ = j;
		    }
		}
		if ( final_ == null && partial != null ) {
		    final_ = partial;
		    find = true;
		} else {
		    all = all.concat(' ');
		    word = "";
		}
	    } else {
		word = word.concat(chaine[i]);
	    }
	    i++;
	}
	var res = tab_chaine[final_](chaine);
	var tab = [];
	tab['TYPE'] = final_;
	tab['RES'] = res;
	return tab;
    };


    this.initArray = function ( ) {
	var tab = [];
	tab['Dossier'] = this.getDossier;
	tab['Attention:'] = this.getAlert;
	tab['Geste'] = this.getDossier;
	tab['Courrier'] = this.getClass;
	tab['Demande'] = this.getClass;
	tab['Ecart'] = this.getDossier;
	tab['Etude'] = this.getClass;
	tab['Information'] = this.getInfo;
	tab['Livrable'] = this.getLiv;
	tab['Note'] = this.getClass;
	tab['Valider *'] = this.getVal;
	tab['Traiter'] = this.getClass;
	tab['Valider écart'] = this.getClass;
	tab['Valider les'] = this.getValClass;
	tab['Valider livrable'] = this.getValLiv;
	tab['Valider qualification'] = this.getClass;
	return tab;
    };




    this.getTrait = function ( chaine ) {
	var user = "", read_user = false, word = "";
	for ( var i = 0 ; i < chaine.length ; i++ ) {
	    if ( chaine[i] == " " ) {
		if ( word == "de" ) {
		    read_user = true;
		} else if ( read_user ) {
		    user = user.concat(word);
		}
		word = "";
	    } else {
		word = word.concat(chaine[i]);
	    }
	}
	if ( user[user.length -1] == ' ' ) {
	    user = user.substr(0, user.length - 1);
	}
	var tab = [];
	tab['MAIL'] = user;
	return tab;
    };



    this.getClass = function( chaine ) {
	return chaine;
    };

    this.getInfo = function( chaine ) {
	var read_user = false, read_info = false;
	var tab = [], user = "", info = "";
	var word = '';
	for ( var i = 0 ; i < chaine.length ; i++ ) {
	    if ( chaine[i] == ' ' ) {
		if ( word == "-" && !read_user) {
		    read_info = true;
		} else if ( word == "par" ) {
		    read_info = false;
		    read_user = true;
		} else {
		    if ( read_user ) {
			user = user.concat(word + " ");
		    } else if ( read_info ) {
			info = info.concat(word + " ");
		    }
		}
		word = "";
	    } else if ( i == chaine.length - 1 ) {
		if ( read_user ) {
		    user = user.concat(word + chaine[i]);
		} else if ( read_info ) {
		    info = info.concat(word + chaine[i]);
		}
	    } else {
		word = word.concat(chaine[i]);
	    }
	}
	if ( info[info.length - 1] == ' ' ) {
	    info = info.substr(0, info.length - 1);
	} 
	if ( user[user.length - 1] == ' ' ) {
	    user = user.substr(0, user.length - 1);
	}
	tab['USER'] = user;
	tab['INFO'] = info;
	return tab;
    };

    this.getLiv = function ( chaine ) {
	var read_state = false, read_title = false;
	var title = "", state = "", tab = [];
	for ( var i = 0 ; i < chaine.length ; i++ ) {
	    if ( chaine[i] == ':' ) {
		read_title = true;
	    } else if ( chaine[i] == ' ' ) {
		if ( read_title && title != "" ) {
		    read_state = true;
		    read_title = false;
		}
	    } else {
		if ( read_title ) {
		    title = title.concat(chaine[i]);
		} else if ( read_state ) {
		    state = state.concat(chaine[i]);
		}
	    }
	}
	tab['NAME'] = title;
	tab['STATE'] = state;
	return tab;
    };

    this.getVal = function ( chaine ) {
	return chaine;
    };



    this.getValLiv = function ( chaine ) {
	var num = "", read_num = false;
	for ( var i = 0 ; i < chaine.length ; i++ ) {
	    if ( chaine[i] == ':' ) {
		read_num = true;
	    } else if ( read_num ) {
		if ( chaine[i] != " " || num != "" ) {
		    num = num.concat(chaine[i]);
		}
	    }
	}
	var tab = [];
	tab['NUM'] = num;
	return tab;
    };


    this.getDossier = function ( chaine ) {
	var type = "", state = "", nb_space = 0;
	for (var i = 0 ; i < chaine.length ; i++ ) {
	    if ( chaine[i] != " " ) {
		if ( nb_space != 0 ) {
		    type = type.concat(state);
		    for ( var j = 0 ; j < nb_space ; j++ ) { type = type.concat(' '); }
		    nb_space = 0;
		    state = chaine[i];
		} else {
		    state = state.concat(chaine[i]);
		}
	    } else {
		nb_space++;
	    }
	}
	var tmp = [];
	tmp['TYPE'] = type.substr(0, type.length - 1);
	tmp['STATE'] = state;
	return tmp;
    };

    this.getAlert = function ( chaine ) {
	var read_def = false, read_title = false;
	var tab = [], title = "", def = "";
	for ( var i = 0 ; i < chaine.length ; i++ ) {
	    if ( chaine[i] != ' ' && !read_def) {
		read_title = true;
	    }
	    if ( chaine[i] == '/' || i == chaine.length - 1) {
		if ( def[def.length -1] == ' ' ) { def = def.substr(0, def.length - 1); }
		tab[title] = def.substr(1, def.length);
		read_def = false;
		read_title = false;
		title = def = "";
	    } else if ( chaine[i] == ':' ) {
		if ( title[title.length - 1] == ' ' ){
		    title = title.substr(0, title.length - 1);
		}
		read_def = true;
		read_title = false;
	    } else {
		if ( read_title ) {
		    title = title.concat(chaine[i]);
		} else if ( read_def ){
		    def = def.concat(chaine[i]);
		}
	    }
	}
	return tab;
    };




    

    this.equals = function ( chaine, chaine2 ) {
	if ( chaine.length < chaine2.length ) {
	    return false;
	} else {
	    var result = "total", i = 0;
	    while ( result == "total" && i < chaine.length ) {
		if ( chaine[i] != chaine2[i] ) {
		    if ( chaine2[i] == '*' ) {
			result = "partial";
		    } else {
			result = "none";
		    }
		}
		i++;
	    }
	    return result;
	}
    };




};



window.Chaine = function ( chaine ) {

    this.chaine = chaine;

    /**
       \brief Examine l egalite de la chaine avec soit
       \param string la chaine de char a tester
       \return string ( total | partial | none )
     */
   


};

window.task_analyser = new TaskAnalyser();
/**
   ===================================================================
   Permet de changer des chaine de char et d'enlever les char inutile
   ===================================================================
*/



var Epurator = function ( ) {
  

    this.mini = function( text ) {
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


    this.classic = function ( text ) {
	var all = '', word = '', nb_space = 0;
	for ( var i = 0 ; i < text.length ; i++ ) {
	    if ( text[i] == ' ' || text[i] == '\n' || text[i] == '&' || text[i] == '	' ) {
		for ( var j = 0 ; j < nb_space ; j++ ) {
		    all = all.concat ( '_' );
		}
		nb_space = 0;
		if ( word != "nbsp;" ) {
		    all = all.concat( word );
		}
		if ( text[i] == ' ' ) {
		    nb_space++;
		}
		word = "";
	    } else if ( i == text.length - 1 ) { 
		for ( var k = 0 ; k < nb_space ; k++ ) {
		    all = all.concat ( '_' );
		}
		if ( word != "nbsp;" ) {
		    all = all.concat( word );
		}
		if ( text[i] == ' ' ) {
		    nb_space++;
		} else if ( !( text[i] == ' ' || text[i] == '\n' || text[i] == '&' || text[i] == '	' ) ) {
		    all = all.concat( text[i] );
		}
	    } else {
		if ( text[i] != '°' ) {
		    word = word.concat( text[i] );
		}
	    }
	}   
	return all;
    };

    this.to_upper = function ( char_ ) {
	return char_.charCodeAt(0) >= 97 && char_.charCodeAt(0) < 97 + 26 ? String.fromCharCode(char_.charCodeAt(0) + 65 - 97) : char_;
    };


    this.to_lower = function ( char_ ) {
	return char_.charCodeAt(0) >= 65 && char_.charCodeAt(0) < 65 + 26 ? String.fromCharCode(char_.charCodeAt(0) + 97 - 65) : char_;
    };



    this.upper = function ( text ) {
	var all = '', word = '', nb_space = 0;
	for ( var i = 0 ; i < text.length ; i++ ) {
	    if ( text[i] == ' ' || text[i] == '\n' || text[i] == '&' || text[i] == '	' ) {
		for ( var j = 0 ; j < nb_space ; j++ ) {
		    all = all.concat ( '_' );
		}
		nb_space = 0;
		if ( word != "NBSP;" ) {
		    all = all.concat( word );
		}
		if ( text[i] == ' ' ) {
		    nb_space++;
		}
		word = "";
	    } else if ( i == text.length - 1 ) { 
		for ( var k = 0 ; k < nb_space ; k++ ) {
		    all = all.concat ( '_' );
		}
		if ( word != "NBSP;" ) {
		    all = all.concat( word );
		}
		if ( text[i] == ' ' ) {
		    nb_space++;
		} else if ( !( text[i] == ' ' || text[i] == '\n' || text[i] == '&' || text[i] == '	' ) ) {
		    all = all.concat( this.to_upper ( text[i] ) );
		}
	    } else {
		if ( text[i] != '°' ) {
		    word = word.concat( this.to_upper( text[i] ) );
		}
	    }
	}   
	return all;
    };


    this.lower = function ( text ) {
	var all = '', word = '', nb_space = 0;
	for ( var i = 0 ; i < text.length ; i++ ) {
	    if ( text[i] == ' ' || text[i] == '\n' || text[i] == '&' || text[i] == '	' ) {
		for ( var j = 0 ; j < nb_space ; j++ ) {
		    all = all.concat ( '_' );
		}
		nb_space = 0;
		if ( word != "nbsp;" ) {
		    all = all.concat( word );
		}
		if ( text[i] == ' ' ) {
		    nb_space++;
		}
		word = "";
	    } else if ( i == text.length - 1 ) { 
		for ( var k= 0 ; k < nb_space ; k++ ) {
		    all = all.concat ( '_' );
		}
		if ( word != "nbsp;" ) {
		    all = all.concat( word );
		}
		if ( text[i] == ' ' ) {
		    nb_space++;
		} else if ( !( text[i] == ' ' || text[i] == '\n' || text[i] == '&' || text[i] == '	' ) ) {
		    all = all.concat( this.to_lower ( text[i] ) );
		}
	    } else {
		if ( text[i] != '°' ) {
		    word = word.concat( this.to_lower( text[i] ) );
		}
	    }
	}   
	return all;	
    };

};

window.epur = new Epurator();
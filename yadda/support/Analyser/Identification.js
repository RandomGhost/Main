/**
   =================================================================
   Creer un tableau associatif a partir d'un wrapperIdentification
   =================================================================

*/




window.IdentificationReader = function() {

    IdentificationReader.prototype.analyse = function( id ) {
	var result = casper.evaluate ( function ( id ) {
	    function epur ( text ) {
		var chev_open = 0, word = "", all = "", nb_space = 0;
		for ( var i = 0 ; i < text.length ; i++ ) {
		    if ( text[i] == " " || text[i] == "\n" || text[i] == "&" || i == text.length - 1 || text[i] == "	" || text[i] == ':' ) {
			for ( var j = 0 ; j < nb_space ; j++ ) { all = all.concat(' '); }
			nb_space = 0;
			if ( word != "nbsp;" && word!= "nbsp" ) {
			    all = all.concat(word);
			}
			if ( text[i] == " " && all != "" ) {
			    nb_space++;
			} 
			if ( i == text.length - 1 && !(text[i] == "	" || text[i] == " " || text[i] == "\n" || text[i] == "&" || text[i] == ">" || text[i] == ";" || text[i] == ':' ) ) {
			    all = all.concat(text[i]);
			}
			word = "";
		    } else {
			if ( text[i] == "<" ) {
			    chev_open++;
			} else if ( text[i] == ">" ) {
			    chev_open--;
			} else {
			    if ( !chev_open ) {
				word = word.concat(text[i]);
			    }
			}
		    }
		}

		var f = all.indexOf('nbsp;');
		if ( f != -1 ) {
		    var deb = all.substr(0, f);
		    var fin = all.substr(f + 5, all.length);
		    all = deb + " " + fin;
		}
		return all;
	    }


	    var elem = document.querySelector( id );
	    if ( elem != null ) {
		var result = {};
		var dl = elem.getElementsByTagName( 'dl' );
		for ( var i = 0 ; i < dl.length ; i++ ) {
		    var dt = dl[i].getElementsByTagName('dt');
		    var dd = dl[i].getElementsByTagName('dd');
		    for ( var j = 0 ; j < dt.length ; j++ ) {
			result[epur(dt[j].innerHTML)] = epur(dd[j].innerHTML);
		    }
		}
		return result;
	    } else {
		return false;
	    }
	}, id);
	return result;
    };

};

window.ident_reader = new IdentificationReader();
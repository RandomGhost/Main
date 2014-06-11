
/**
   ==============================================================
   Annalyse une ligne d'un tableau et la renvoi sous forme de {}
   ==============================================================
*/

window.TableReader = function () {
    
    TableReader.prototype.analyse = function ( line , tab , under_doc ) {
	var table = casper.evaluate ( function ( line , tab , under_doc ) {

	    function epur ( text ) {
		var chev_open = 0, word = "", all = "", nb_space = 0;
		for ( var i = 0 ; i < text.length ; i++ ) {
		    if ( text[i] == " " || text[i] == "\n" || text[i] == "&" || i == text.length - 1) {
			for ( var j = 0 ; j < nb_space ; j++ ) { all = all.concat(' '); }
			nb_space = 0;
			if ( word != "nbsp;" && word!= "nbsp" ) {
			    all = all.concat(word);
			}
			if ( text[i] == " " ) {
			    nb_space++;
			} 
			if ( i == text.length - 1 && !(text[i] == " " || text[i] == "\n" || text[i] == "&" || text[i] == ">" || text[i] == ";") ) {
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
		return all;
	    }

	    function lastElem ( elem ) {
		if ( elem.children.length == 0 ) {
		    return epur(elem.innerHTML);
		} else {
		    var result = lastElem(elem.children[0]);
		    if ( result == "" ) {
			return epur(elem.innerHTML);
		    } else {
			return result;
		    }
		}
	    }


	    var doc = document;
	    if ( under_doc != "" ) { doc = document.querySelector(under_doc).contentDocument; }
	    var head = doc.querySelector(tab + " thead");
	    var table = doc.querySelector(tab + " tbody");
	    if ( head != null && table != null ) {
		head = head.children[0].children; 
		var result = {};
		if ( line >= table.children.length ) {
		    return [false, "le tableau ne contient pas cette ligne"];
		} else {
		    var tr = table.children[line];
		    for ( var i = 0 ; i < tr.children.length ; i++ ) {
			result[lastElem(head[i])] = lastElem(tr.children[i]);
		    }
		    return [true, result];
		}
	    } else {
		return [false, "tableau manquant"];
	    }
	}, line, tab, under_doc );
	if ( table[0] ) {
	    return table[1];
	} else {
	    casper.echo(table[1]);
	    return null;
	}
    };

};



window.table_reader = new TableReader();
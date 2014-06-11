/**
   ========================================================
   Lis deux page est definis une difference entre les deux
   ========================================================
*/


window.PageDiff = function() {
    
    /**
       \brief Verifie la difference entre la page courante et celle entree en param
       \param page la page {TAG, [ATTR] , INNER, [CHILDREN], boolean }
     */
    this.diff = function( page ) {

	return casper.evaluate ( function (page)   {
	    var elem = document.querySelector('body');
	    
	    function diff_node ( obj , page ) {
		if ( page['TAG'] != obj.tagName ) {
		    return true;
		} else {
		    var find = false, i = 0;
		    while ( i < obj.attributes.length && ! find ) {
			if ( page['ATTR'][obj.attributes[i].name] == undefined || page['ATTR'][obj.attributes[i].name] != obj.attributes[i].value ) {
			    find = true;
			}
			i++;
		    }
		    
		    if ( find ) {
			return true;
		    } else if ( obj.innerHTML != page['INNER'] || (page['FINAL'] != ( obj.children.length == 0 )) ) {
			return true;
		    } else {
			i = 0;
			while ( i < obj.children.length && !find ) {
			    if ( page['CHILDREN'][i] == undefined || diff_node( obj.children[i] , page['CHILDREN'][i] )) {
				find = true;
			    }
			    i++;
			}
			return find;
		    }
		}
		
	    }
	    
	    return diff_node ( elem , page );

	    
	}, page);
    };


    this.diffText = function ( page_text ) {
	return casper.evaluate( function( page ) {
	    return page != document.querySelector('body').innerHTML;
	}, page_text);
    };


};


window.page_diff = new PageDiff();
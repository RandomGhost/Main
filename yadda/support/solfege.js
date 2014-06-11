
/**
   \brief Cette fonction va faire attendre un changement de page a casper
   \brief Au dela du delai le test est considerer comme fail
   \param url la page d'origine 
   \param time le delai d'attente
   \return  null 
*/
casper.sqliWaitUrlChange = function (url, time) {
    casper.waitFor(function() { return casper.getCurrentUrl() != url;
			      },
                   function() {casper.echo(casper.getCurrentUrl() + " <- " + url);
			      },
                   function() {casper.test.fail(casper.getCurrentUrl() + " <- " + url);
			      }
		   , time);
};










casper.displaySimpleTab = function ( tab , begin , end ) {
    if ( begin == null ) { begin = 0; }
    if ( end == null ) { end = tab.length; }
    var chaine = "[ ";
    for ( var i = begin ; i < end && i < tab.length ; i++ ) {
	chaine = chaine.concat(i + ' : ' + tab[i] + "\n" );
	if ( i != (end - 1) ) {
	    chaine = chaine.concat(' , ');
	}
    }
    chaine = chaine.concat ( " ]" );
    casper.echo ( chaine );
    
};


casper.displayTab = function ( tab, space ) {
    if ( space == null ) { space = "|"; }
    if ( typeof( tab ) == 'object' ) {
	for ( var j in tab ) {
	    casper.echo( space + '|- ' + j + ' :');
	    casper.displayTab( tab[j] , space + "    ");
	}  
    } else {
	casper.echo(space + '|- [' + tab + ']');
    }
};


casper.displayInlineTab = function ( tab ) {
    casper.echo( casper.displayInlineTabR ( tab ) );
};


casper.displayInlineTabR = function ( tab ) {
    if ( typeof ( tab ) == 'object' ) {
	var result = '{';
	for ( var j in tab ) {
             result = result.concat(' ' + j + ': ' + casper.displayInlineTabR(tab[j]) + ",");
	}
	return  result.concat('}');
    } else {
	return tab + ' ';
    }
};

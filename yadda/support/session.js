/**
   =====================================================
   Classe contenant les attribut de la session en cours
   =====================================================
*/



window.Session = function() {
    
    this.table = [];
    
    Session.prototype.get = function(elem) {
	if ( typeof(elem) == 'string' ) {
	    return this.table[elem];
	} else {
	    return null;
	}
    };

    Session.prototype.set = function( elem , value ) {
	if ( typeof(elem) == 'string' ) {
	    this.table[elem] = value;
	    return true;
	} else {
	    return false;
	}
    };
    
    Session.prototype.reset = function() {
	this.table = [];
    };

};


window.session = new Session();
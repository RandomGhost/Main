/**
   ==========================
   Lis les bandeau de message 
   ==========================
  
   {"ERROR" : [], "INFO" : []}
*/




window.MessageReader = function () {
    
    this.get_all = function () {
	var result = casper.evaluate ( function ( ) {
	    var result = {};
	    var error = document.querySelector('ul[class="errorMessage"]');
	    var all = document.querySelector('ul[class="formError"]');
	    result['ERROR'] = [];
	    var info = document.querySelector('ul[class="actionMessage"]');
	    result['INFO'] = [];
	    if ( error != null ) {
		for ( var i = 0 ; i < error.children.length ; i++ ) {
		    result['ERROR'].push( error.children[i].children[0].innerHTML );
		}
	    }
	    if ( all != null ) {
		for ( var k = 0 ; k < all.children.length ; k++ ) {
		   
		    if ( all.children[k].className == "good" ) {
			result['INFO'].push( all.children[k].innerHTML );
		    } else {
			if ( all.children[k].className != "actionMessage" ) {
			    result['ERROR'].push( all.children[k].innerHTML );
			}
		    }
		}
	    }
	    if ( info != null ) {
		for ( var j = 0 ; j < info.children.length ; j++ ) {
		    result['INFO'].push( info.children[j].children[0].innerHTML );
		}
	    }
	    return result;	    
	});
	return result;
    };
};


window.msg_reader = new MessageReader();
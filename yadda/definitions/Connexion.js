module.exports.init = function() {
    var dictionary = new Dictionary() 
	.define('LOCALE', /(fr|es|ie)/)
	.define('NUM', /(\d+)/);


    var library = English.library(dictionary)

    /** 
	\brief Utilise les identifiants d'un utilisateur
	\param Nom_utilisateur
    */ 
	.given('je suis un utilisateur {$NAME}', function(name) {
	    var url = casper.getCurrentUrl();
	    casper.open ( 'https://github.com' );
	    session.set( 'type_user' , name );
	    session.set ( 'type_deb' , name );
	    session.set( 'long_delay' , 30 );
	    session.set( 'under_doc' , "" );
	    casper.sqliWaitUrlChange(url , session.get( 'long_delay' ));
	})


	.when('je fais un Screen {$ARG1}', function(arg1) {
	    casper.sqliScreenshot(arg1);
	});


    return library; 
}
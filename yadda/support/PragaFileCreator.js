/**
   ==============================================================
   Genere un fichier praga pour faire une insertion du fichier
   ==============================================================
*/





/**
   ===========================================================
   Genere aleatoirement des Nom ( pas forcement logique ^^ )
   ===========================================================
*/

var Name_gen = function ( ) {
    
    this.first = function ( ) {
	var i = parseInt( Math.random() * 100 ) % 10 + 5;
	var fir = maj ( );
	for ( var j = 0 ; j < i - 1 ; j++ ) {
	    if ( voyelle ( fir[fir.length - 1] ) ) {
		fir = fir.concat(get_cons ());
	    } else {
		fir = fir.concat ( get_voy() );
	    }
	}
	return fir;
    };


    this.last = function ( ) {
	var i = parseInt( Math.random() * 100 ) % 10 + 5;
	var fir = maj ( );
	for ( var j = 0 ; j < i - 1 ; j++ ) {
	    if ( voyelle ( fir[fir.length - 1] ) ) {
		fir = fir.concat(get_cons ());
	    } else {
		fir = fir.concat ( get_voy() );
	    }
	}
	return fir;
    };

    var to_upper = function ( char_ ) {
	return char_.charCodeAt(0) >= 97 && char_.charCodeAt(0) < 97 + 26 ? String.fromCharCode(char_.charCodeAt(0) + 65 - 97) : char_;
    };

    var voyelle = function ( char_ ) {
	char_ = to_upper ( char_ );
	if ( char_ == "A" || char_ == 'E' || char_ == 'I' || char_ == 'O' || char_ == 'U' || char_ == 'Y' ) {
	    return true;
	} else {
	    return false;
	}
    };
    
    var get_voy = function ( ) {
	var a = maj();
	while ( !voyelle  ( a ) ) {
	    a = maj();
	}
	return a;
    };

    var get_cons = function ( ) {
	var a = maj();
	while ( voyelle  ( a ) ) {
	    a = maj();
	}
	return a;
    };

    var lettre = function ( ) {
	var i = parseInt(Math.random() * 100,10) % 26;
	return String.fromCharCode ( 97 + i );
    };


    var maj = function ( ) {
	var i = parseInt(Math.random() * 100 ,10) % 26;
	return String.fromCharCode ( 65 + i );
    };

    
};


var name_gen = new Name_gen();



window.PragaFile = function ( ) {

    this.total = 0;

    
    /**
       \brief Genere un fichier de type praga
       \param string le nom du fichier dans lequel enregistrer
       \return le nom du fichier
    */
    PragaFile.prototype.generate = function ( ) {
	var Content = this.createContent(2);
	var filename = 'praga/CT' + parseInt( Math.random() * 100000 ) + '.txt';
	var fs = require('fs');
	fs.write ( filename , Content , 0 , Content.length , null );
	return filename;
    };

    /**
       \brief Creer le contenu du fichier praga
       \param int le nombre de ligne a generer dans le fichier
       \return string la chaine a ecrire dans le fichier
    */
    this.createContent = function ( nb_detail ) {
	var content = this.createHeader();
	for ( var i = 0 ; i < nb_detail ; i++ ) {
	    content = content.concat ( '\n' + this.createDescription() );
	}
	content = content.concat ( '\n' + this.createFooter(nb_detail) );
	return content;
    };
    

    /**
       \brief Genere le header d'un fichier praga
       \param void
       \param string un header genere de facon aleatoire
     */
    this.createHeader = function ( ) {
	var where = add ( "E" , 1 , "" );
	where = add ( "0323" , 4 , where );
	where = add ( "CAVAMAC PRAGA" , 30 , where );
	var date = new Date();
	where = add ( date.getFullYear() , 4 , where );
	where = add ( date.getFullYear() , 4 , where );
	where = add ( this.dateFormat(date) , 8 , where );
	where = add ( 'A' , 1 , where );
	var rand = parseInt(Math.random() * 1000000, 10);
	where = add_fill0 ( rand , 6 , where );
	rand = parseInt(Math.random() * 100000, 10);
	where = add_fill0( rand , 5 , where );
	return add ( "" , 105 , where );
    };


    /**
       \brief Generation d'une ligne d'information
       \param void
       \return string un ligne d'info
     */
    this.createDescription = function ( ) {
	var content = add ( "D" , 1 , "" );
	content = add ( "0323" , 4 , content );
	var rand = parseInt( Math.random() * 100000 , 10 );
	content = add_fill0 ( "111" , 6 , content );
	content = add ( 'D' , 1 , content );
	var prenom = "";
	var nom = "pasteque";
	content = add ( prenom + " " + nom , 30 , content );
	var insee = parseInt( Math.random() * 1000000000000000 , 10 );
	content = add_fill0 ( insee+"" , 15 , content );
	content = add ( '7' , 25 , content );
	content = add ( 'RCO' , 5 , content );
	content = add ( 'CC' , 5 , content );
	content = add ( '' , 1 , content );
	var montant = parseInt ( Math.random() * 1000000000 , 10 );
	this.total += montant;
	var montant2 = montant * 2;
	montant = montant + "";
	content = add_fill0 ( montant , 10 , content );
	content = add_fill0 ( montant , 10 , content );
	content = add_fill0 ( montant , 10 , content );
	content = add ( 'A' , 1 , content );
	content = add_fill0 ( montant , 10 , content );
	content = add ( 'A' , 1 , content );
	content = add_fill0 ( montant2 + "" , 10 , content );
	content = add ( 'A' , 1 , content );
	content = add_fill0 ( montant , 10 , content );
	content = add ( 'A' , 1 , content );
	content = add_fill0 ( montant , 10 , content );
	content = add ( 'A' , 1 , content );
	return content;
    };


    /**
       \brief Creation du footer de la page
       \param int le nombre de ligne du detail
       \return string la ligne de footer
     */
    this.createFooter = function ( nb_detail ) {
	var content = add ( "T" , 1 , "" );
	content = add ( "0323" , 4 , content );
	content = add_fill0 ( nb_detail + "" , 7 , content );
	content = add_fill0 ( this.total + "" , 15 , content );
	content = add ( 'A' , 1 , content );
	content = add_fill0 ( this.total + "" , 15 , content );
	content = add ( 'A' , 1 , content );
	content = add_fill0 ( this.total + "" , 15 , content );
	content = add ( 'A' , 1 , content );
	content = add_fill0 ( this.total + "" , 15 , content );
	content = add ( 'A' , 1 , content );
	content = add_fill0 ( this.total + "" , 15 , content );
	content = add ( 'A' , 1 , content );
	content = add ( '' , 76 , content );
	return content;
    };



    


    /**
       \brief Ajoute a la fin d'une chaine, une autre chaine en completant avec des " " si necessaire
       \param string l element a rajouter
       \param int la longueur que doit prendre la chaine
       \param string la chaine d'origine
       \return la chaine de fin
    */
    window.add = function ( what , length , where ) {
	where = where.concat ( what );
	for ( var i = 0 ; i < length - what.length ; i++ ) {
	    where = where.concat ( " " );
	}
	return where;
    };

    /**
       \brief Ajoute des 0 en debut d'ajout de la chaine
       \param string la chaine a ajouter
       \param int la longueur de la chaine a ajouter ( ajoute des 0 au debut si plus long que la chaine )
       \param string la chaine d'origine 
       \return string la chaine de fin
    */
    window.add_fill0 = function ( what , length , where ) {
	for ( var i = 0 ; i < length - what.length ; i++ ) {
	    where = where.concat ( "0" );
	}
	return where.concat( what );
    }


    /**
       \brief Ajoute des 0 en fin d'ajout de la chaine
       \param string la chaine a ajouter
       \param int la longueur de la chaine a ajouter ( ajoute des 0 a la fin si plus long que la chaine )
       \param string la chaine d'origine 
       \return string la chaine de fin
    */
    window.add_comp0 = function ( what , length , where ) {
	where = where.concat( what );
	for ( var i = 0 ; i < length - what.length ; i++ ) {
	    where = where.concat ( "0" );
	}
	return where;
    }





    this.dateFormat = function( date ) {
	
	var day = date.getDate();
	if (day < 10 ) {
	    day = '0' + day;
	}
	
	var month = date.getMonth() + 1;
	if ( month < 10 ) {
	    month = '0' + month;
	}
	var year = date.getFullYear();
	return year + month + day;

    };



};



window.praga_gen = new PragaFile();
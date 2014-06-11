// The following code requires casper 1.1 after the following commit
// https://github.com/n1k0/casperjs/commit/2378537a716a492533a279b8e3bc560ae3deca5a

/* exported Dictionary, English */

require('./Ordonnanceur.js');


var fs = require('fs');
var async = require('async');
var Yadda = require('yadda');
var feature = casper.cli.get('feature');
var dep = casper.cli.get('dependance');
var restart = casper.cli.get('restart');

var Dictionary = Yadda.Dictionary;
var English = Yadda.localisation.English;

function requireLibrary(libraries, library) {
    return libraries.concat(require('./definitions/' + library).init());
}

function requireLibraries() {
    return fs.readdirSync('./definitions/').reduce(requireLibrary, []);
}

var parser = new Yadda.parsers.FeatureParser();
var yadda = new Yadda.Yadda(requireLibraries());
Yadda.plugins.casper(yadda, casper);



var i = 1;

var size ;
function casperTest(file) {
    

    var feature = parser.parse(fs.read(file));
    casper.test.begin(i + "/" + size + " " + file, function suite() {
        async.eachSeries(feature.scenarios, function (scenario, next) {
            casper.start();
            casper.echo('-- Scenario: ' + scenario.title + ' --', 'INFO_BAR');
            casper.yadda(scenario.steps);
            casper.run(function () {
                next();
            });
        }, function (err) {

            if (err) {
		if ( session.get('deco') != true) {
		    casper.echo(session.get('type_user'));
		    casper.click('a[href="/GPJ-Solfege/logout.action"]');
		    casper.sqliSleep(1000);
		}
                console.log(err);
            }
            casper.test.done();
	    
        });
    });
}

/**
   \brief lis un fichier de sauvegarde d'element et cherche le premier test a lancer
   \param files le nom des fichier a lancer dans l'ordre
   \param text le nom des fichier dans la sauvegarde dans l'ordre d'execution precedant
   \return int
 */
function find_deb ( files , text ) {
    var deb = 0, j = 0, current = "", i = 0, error = false;
    while ( i < text.length && !error ) {
	if ( text[i] == "\n" ) {
	    if ( files[j] == current ) {
		j++;
		current = "";
	    } else {
		j = 0;
		error = true;
	    }
	} else {
	    current = current.concat( text[i] );
	}
	i++;
    }
    return j;
}




if ( dep ) {
    files = order.generate ( dep );
    var begin = 0;
    if ( restart ) {
	sauve = fs.read('test.save');
	begin = find_deb( files , sauve );
	casper.echo ( begin );
    }
    
    casper.displaySimpleTab( files, begin );
    if ( files != null ) {
	size = files.length;
	for ( var i = begin ; i < files.length ; i++ ) {
	    casperTest('features/'+files[i]);
	}
    } else {
	casper.echo ( "Des erreurs sont survenue veuillez les corriger" );
	casper.test.done();
    }
} else if (feature) {
    casperTest(feature);
} else {
    files = order.generate();
    if ( files != null ) {
	casper.displayTab( files );
	all = files.length;
	for ( var i = 0 ; i < files.length ; i++ ) {
	    casperTest('features/'+files[i]);
	}
    } else {
	casper.echo ( "Des erreurs sont survenue veuillez les corriger" );
	casper.test.done();
    }
}

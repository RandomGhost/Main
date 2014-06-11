require('support/solfege.js');
require('support/session.js');
require('support/namespace.js');
require('support/Task_reader.js');
require('support/Table_reader.js');
require('support/Analyser/Identification.js');
require('support/Analyser/Page_analyser.js');
require('support/Analyser/Page_diff.js');
require('support/Epurator.js');
require('support/Message_reader.js');
require('support/PragaFileCreator.js');

/*
require('support/simulate/jquery-2.1.1.js');
require('support/simulate/bililiteRange.js');
require('support/simulate/jquery.simulate.js');
require('support/simulate/jquery.simulate.ext.js');
require('support/simulate/jquery.simulate.drag-n-drop.js');
*/
//require('support/ficheIJ.js');
//require('support/consultation.js');

var WORKSPACE = casper.cli.get('workspace');

var FEATURE = casper.cli.get('feature');

var BASE_URL = casper.cli.get('baseurl');


//Ajout d'une fonction de padding sur les entiers
Number.prototype.padLeft = function (n, str) {

    return Array(n - String(this).length + 1).join(str || '0') + this;

};

//Implémentation de sqliRemoveTree pour palier à un bug de removeTree sur slimerjs

var fs = require('fs');

fs.makeTree(WORKSPACE);
fs.sqliRemoveTree = function (path) {

    if (!fs.exists(path)) {

	return;
    }

    return fs.removeTree(path);

};






//Implémentation de sqliScreenshot
//par fichier faire un casper.sqliScreenshotInit('nom-du-test');

//puis au moment voulu, faire un screenshot avec casper.sqliScreenshot('nom-du-screenshot');
casper.sqliScreenshotCount = {};
casper.sqliScreenshotCurrentTestName = '_nothing_';

casper.sqliScreenshotInit = function(testName){

    //testName = testName.replace(/[^a-z0-9\s]/gi, '-');
    this.sqliScreenshotCurrentTestName = testName;

    this.sqliScreenshotCount[testName] = 0;

    fs.sqliRemoveTree(WORKSPACE + '/screenshots/' + testName);

    fs.makeTree(WORKSPACE + '/screenshots/' + testName);

};
casper.sqliScreenshot = function (name){

    /*this.evaluate(function(){
      $('window.location.href') ? $('window.location.href').remove() : null;

      $$('body').first().insert({top: '<div style="width:100%; border:0; border-bottom:solid 1px black; padding:5px 30px;background:#c6bbb9;font:12px monospace;color:black;font-weight:bold;text-align:center" id="window.location.href"><div style="overflow:hidden;text-overflow:ellipsis;height:15px;width:90%;border:solid 1px black;background:white; text-align:left;padding:2px 5px">' + window.location.href + '</div></div>'});

      });*/
    this.sqliScreenshotCount[this.sqliScreenshotCurrentTestName] = this.sqliScreenshotCount[this.sqliScreenshotCurrentTestName] + 1;

    var screenshotPath = WORKSPACE + '/screenshots/' + this.sqliScreenshotCurrentTestName + '/'

	+ (1 * this.sqliScreenshotCount[this.sqliScreenshotCurrentTestName]).padLeft(3) + '-' + name.replace(/[^a-z0-9\s]/gi, '-') + '.png';

    var screenshotUrl = screenshotPath
	.replace('/var/lib/jenkins/jobs', 'http://tools-projectname.sqli.com:8080/job')

	.replace('workspace', 'ws');

    this.capture(screenshotPath);

    this.echo('Screenshot: ' + screenshotUrl, 'COMMENT');

};
casper.sqliScreenshotInit('_nothing_');





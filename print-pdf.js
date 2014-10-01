/**
 * phantomjs script for printing presentations to PDF.
 *
 * Example, running local server in the present directory, defaulting to writing to slides.pdf
 * phantomjs print-pdf.js
 *
 * Example, pulling from any URL
 * phantomjs print-pdf.js "http://lab.hakim.se/reveal-js?print-pdf" reveal-demo.pdf
 *
 * By Manuel Bieh (https://github.com/manuelbieh) - https://github.com/hakimel/reveal.js/blob/master/plugin/print-pdf/print-pdf.js
 * modified by shearer12345 (https://github.com/shearer12345) to delay rendering to allow pages that load content after on_load still work (usually). Also modified to run a simple web server to serve the content.
 */
 
var childProcess = require('child_process');
console.log( 'Starting pythonHttpServer' );
var pythonHttpServer = childProcess.spawn(
     'python',
     // second argument is array of parameters, e.g.:
     ["-m"
     , "http.server"]
     );
    
// html2pdf.js
var page = new WebPage();
var system = require( 'system' );

// example .\phantomjs.exe .\print-pdf.js 'http://shearer12345.github.io/talkLincolnOpenDayGamesComputing/?print-pdf/'

page.paperSize = {
        format: 'A4',
        orientation: 'landscape',
        margin: {
                left: '0',
                right: '0',
                top: '0',
                bottom: '0'
        }
};
page.zoomFactor = 1.0;

var revealFile = system.args[1] || 'http://localhost:8000/?print-pdf/#/';
var slideFile = system.args[2] || 'slides.pdf';

if( slideFile.match( /\.pdf$/gi ) === null ) {
        slideFile += '.pdf';
}

console.log( 'Printing PDF...' );

loadDelaySeconds = 10;
page.open( revealFile, function( status ) {
        console.log( 'Opened succesfully. Waiting ', loadDelaySeconds, ' seconds for page to fully load.' );
        
        window.setTimeout(function () {
            console.log( 'Finished waiting - now rendering' );
            page.render( slideFile );
            console.log( 'Finished rendering. Stopping pythonHttpServer.' );
            pythonHttpServer.kill();
            console.log( 'Done' );
            phantom.exit();
        }, loadDelaySeconds * 1000);
        
} );


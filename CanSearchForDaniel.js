var casper = require("casper").create({
    verbose: true
});

casper.start( "https://www.hellowork.go.jp/", function() {
	this.evaluate( function(){
		document.querySelector('form').submit();
	});
});

casper.then(function(){
	this.fill('#ID_multiForm1', {
		kiboShokushu : "B",
		todofuken1 : "10",
		kiboSangyo : "G"
	}, false);
	this.evaluate( function(){
		document.querySelector('#ID_commonSearch').click();
	});
});

casper.then(function(){
	this.capture('submit.png');
});

casper.run();

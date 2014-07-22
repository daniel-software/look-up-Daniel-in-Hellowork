var casper = require("casper").create({
    verbose: true
});

var count = 0;

var openUrl = function() {
	this.thenOpen( "https://www.hellowork.go.jp/servicef/" + this.getElementsAttribute('table.sole-small #ID_link', 'href')[count], function() {
		this.echo( this.getTitle());
		this.capture('submit' + count + '.png');
		this.back();
		count++;
	});
};

var repeatOpenUrl = function() {
	if ( count < 10) {
		openUrl.call( this);
		casper.run( repeatOpenUrl);
	} else {
		this.echo( 'All done');
		this.exit();
	}
};

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

casper.waitFor( function check() {
	return this.evaluate( function(){
		return 'ハローワークインターネットサービス - 求人情報一覧' == document.title;
	});
}, function then(){
	this.capture('submit.png');
});

casper.run(repeatOpenUrl);

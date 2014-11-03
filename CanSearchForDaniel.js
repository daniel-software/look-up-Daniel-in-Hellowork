//var casper = require("casper").create({
//    verbose: true
//});

casper.test.begin('asd', 5, function suite(test) {
var count = 0;
var countInPage = 0;
var totalCount = 0;
var foundUrls = [];

var openUrl = function() {
	this.thenOpen( "https://www.hellowork.go.jp/servicef/" + this.getElementsAttribute('table.sole-small #ID_link', 'href')[count], function() {
		var name = this.getHTML( 'div.wordBreak');
		this.echo( name);
		if ( 0 < name.indexOf('ダニエル')) {
			this.echo(' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Contains Daniel !!!');
			foundUrls.push( { No : totalCount + count + 1, Url : encodeURI( this.getCurrentUrl()) });
		}
		this.back();
		count++;
	});
};

// 頁内の求人リンクへ遷移し続ける. なければ次頁へ.
var repeatOpenUrl = function() {
	this.echo( 'start repeatOpenUrl : ' + ( totalCount + count));
	if ( count < countInPage) {
		openUrl.call( this);
		casper.run( repeatOpenUrl);
	} else {
		this.echo( 'repeat done');
		casper.run( moveToNext);
	}
	this.echo( 'end repeatOpenUrl : ' + ( totalCount + count));
};

// 頁内の初期設定をして、求人リンクへ遷移する
var InitializeInPageAndOpenUrl = function() {
	this.echo( 'start InitializeInPageAndOpenUrl : ' + count);
	count = 0;
	countInPage = this.getElementsAttribute('table.sole-small #ID_link', 'href').length;
	//countInPage = 15;
	repeatOpenUrl.call( this);
	this.echo( 'end InitializeInPageAndOpenUrl : ' + count + ' / ' + countInPage);
};

// 次頁へ遷移する. なければ終了する.
var moveToNext = function() {
	this.echo( 'start moveToNext : ' + count);

	var fu = this.evaluate( function() {
		return document.querySelector('div.number-link-top p').innerText;
	});
	if ( this.exists('input[name=fwListNaviBtnNext]')) {
	//if ( false) {
		this.click('input[name=fwListNaviBtnNext]');
		this.echo('next>> ' + fu);
		totalCount += countInPage;

		casper.run( InitializeInPageAndOpenUrl);
	} else {
		require('utils').dump( foundUrls);
		this.echo( 'All done');
		test.assert(0 < foundUrls.length, 'ダニエルが存在しない！');
		test.pass("hogehoge");
		test.renderResults(true, 0, 'test-results.xml');
		test.done();
		//this.exit();
	}

	this.echo( 'end moveToNext : ' + count);
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
	this.echo('search form submit');
});

casper.waitFor( function check() {
	return this.evaluate( function(){
		return 'ハローワークインターネットサービス - 求人情報一覧' == document.title;
	});
}, function then(){
	this.echo('submit done');
	//this.capture('submit.png');
});

casper.run(InitializeInPageAndOpenUrl);
});

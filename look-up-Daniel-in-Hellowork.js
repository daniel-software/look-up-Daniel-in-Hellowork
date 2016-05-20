//var casper = require("casper").create({
//    verbose: true
//});

casper.test.begin('look up Daniel!', 6, function suite(test) {
var count = 0;
var countInPage = 0;
var totalCount = 0;
var foundUrls = [];
var nameArea = '';

var openUrl = function() {
	this.thenOpen( "https://www.hellowork.go.jp/servicef/" + this.getElementsAttribute('table.sole-small #ID_link', 'href')[count], function() {
		var startOfOne = totalCount + count + 1;
		var encodedUrl = encodeURI( this.getCurrentUrl());
		if ( this.exists( 'div.wordBreak')) {
			var name = this.getHTML( 'div.wordBreak');
			nameArea = nameArea + '<a href="' + encodedUrl + '">' + startOfOne + ':' + name + '</a><br/>\r\n';
			this.echo( name);
			if ( 0 < name.indexOf('ダニエル')) {
				this.echo(' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Contains Daniel !!!');
				foundUrls.push( { No : startOfOne, Url : encodedUrl });
				this.capture( startOfOne + '.Daniel.png');
			}
		} else {
			this.echo( 'unexists div.wordBreak');
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
		require('fs').write('list.html', nameArea, 'w');
		test.assert(0 < foundUrls.length, '4. ダニエルが存在ある');
		test.done();
		//test.renderResults(true, 0, 'test-results.xml');
		//this.exit();
	}

	this.echo( 'end moveToNext : ' + count);
};

casper.start( "https://www.hellowork.go.jp/", function() {
	test.assertExists('form', '1. 求人情報検索へ');
	this.evaluate( function(){	
		document.querySelector('form').submit();
	});
});

casper.then(function(){
	test.assertExists('#ID_multiForm1', '2. 求人情報検索フォームがある');
	this.fill('#ID_multiForm1', {
		todofuken : "10" /* 都道府県／市区町村名 : 群馬県 */
	}, false);
	test.assertExists('#ID_commonSearch', '3. 検索ボタンがある');
	this.evaluate( function(){
		document.querySelector('#ID_commonSearch').click();
	});
	this.echo('search form submit');
});

casper.then(function(){
	this.waitForSelector('#ID_mainForm', function() {
		test.assertExists('#ID_mainForm', '4. 求人情報詳細検索フォームがある');
		this.fill('#ID_mainForm', {
			kiboShokushu1 : "B", /* 希望する職種 : 専門的・技術的職業 */
			kiboSangyo1 : "G" /* 希望する産業 : 情報通信業 */
		}, false);
		test.assertExists('#ID_commonSearch', '5. 検索ボタンがある');
		this.evaluate( function(){
			document.querySelector('#ID_commonSearch').click();
		});
		this.echo('search form detail submit');
	});
});

casper.then(function(){
	// Submit後の同期とれなくて、↓という文言で無理やり同期してる
	this.waitForText('専門的・技術的職業', function() {
		this.echo('submit done');
	});
});

casper.run(InitializeInPageAndOpenUrl);
});

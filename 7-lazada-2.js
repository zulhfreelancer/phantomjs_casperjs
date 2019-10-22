/****************************************************************
 * Modified from:
 * https://github.com/casperjs/casperjs/blob/master/samples/googlepagination.js
 *
 * Capture first 3 page of reviews from Lazada
 *****************************************************************/

var casper = require("casper").create({
	verbose: true,
	logLevel: "debug", // debug, info, warning, error
	pageSettings: {
		loadImages: false,
		loadPlugins: false,
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4"
	}
});

var url =
	"https://www.lazada.com.my/products/choetech-05m-1m-2m-24a-fast-charging-data-transfer-micro-usb-cable-for-andriod-phone-samsung-huawei-xiaomi-others-i435815406-s1152558390.html?spm=a2o4k.searchlist.list.1.24c3e26fWowqCr&search=1";

var currentPage = 1;
var startPage = "";

function terminate() {
	this.echo("All done");
	this.exit();
}

function startPageFn() {
	var startPage = document.querySelector(
		"button.next-btn.next-btn-normal.next-btn-medium.next-pagination-item.current"
	);
	return Array.prototype.map.call(startPage, function(e) {
		return e.innerText;
	});
}

var processPage = function() {
	casper.wait(1000, function() {
		console.log("waited 1 second");
	});
	this.echo("capturing page " + currentPage);
	this.capture("screenshots/reviews-page-" + currentPage + ".png");

	if (currentPage > 2 || !this.exists(".mod-rating")) {
		return terminate.call(casper);
	}

	currentPage++;
	this.echo("Requesting next page: " + currentPage);
	this.thenClick("button.next-pagination-item.next").then(function() {
		this.waitFor(
			function() {
				return startPage != 1;
			},
			processPage,
			terminate
		);
	});
};

casper.start(url, function() {
	this.echo(this.getTitle());
});

casper.wait(3000, function() {
	this.echo("I've waited for 3 seconds");
});

casper.then(function() {
	this.click("a.pdp-review-summary__link");
	console.log("clicked reviews tab");
});

casper.then(function() {
	startPage = this.evaluate(startPageFn);
});

casper.waitForSelector(".mod-rating", processPage, terminate);

casper.run();

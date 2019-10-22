/****************************************************************
 * Wait for page load, click review tab, scrape contents
 * Print reviews and dates of review from bestbuy
 * Unable to use jQuery
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

var ratings = [];
var dates = [];

function getRatings() {
	var ratings = document.querySelectorAll("div.item-content > div.content");
	return Array.prototype.map.call(ratings, function(e) {
		return e.innerText;
	});
}

function getDates() {
	var dates = document.querySelectorAll("div.top > span");
	return Array.prototype.map.call(dates, function(e) {
		return e.innerText;
	});
}

casper.start(url, function() {
	this.echo(this.getTitle());
});

casper.wait(3000, function() {
	this.echo("I've waited for 3 seconds");
});

casper.then(function() {
	this.click("a.pdp-review-summary__link");
	console.log("clicked reviews tab");
	// casper.capture("screenshots/after-clicking-reviews-summary.png");
});

casper.waitForSelector(".mod-rating", function() {
	console.log("ratings loaded");
});

casper.then(function() {
	ratings = this.evaluate(getRatings);
	dates = this.evaluate(getDates);
});

casper.then(function() {
	this.echo(ratings.length + " ratings found: ");
	this.echo(" - " + ratings.join("\n - "));
	this.echo(" - " + dates.join("\n - "));
});

casper.run();

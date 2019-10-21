var casper = require("casper").create({
	verbose: true,
	logLevel: "error",
	clientScripts: ["vendor/jquery.js", "vendor/lodash.js"]
});

var links = [];

function getLinks() {
	links = $(".b_algo a");
	return _.map(links, function(e) {
		return e.getAttribute("href");
	});
}

casper.start("https://www.bing.com", function() {
	this.fill(
		'form[action="/search"]',
		{
			q: "casperjs"
		},
		true
	);
});

casper.then(function() {
	links = this.evaluate(getLinks);
});

casper.run(function() {
	this.echo(links.length + " links found");
	this.echo(" - " + links.join("\n - ")).exit();
});

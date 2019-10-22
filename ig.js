var target = "https://www.instagram.com/zulhilmizainudin/?hl=en"; // Our target URL

var casper = require("casper").create({
	verbose: true,
	logLevel: "info",
	pageSettings: {
		webSecurityEnabled: false, // (http://casperjs.readthedocs.org/en/latest/faq.html#i-m-having-hard-times-downloading-files-using-download)
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11" // Spoof being Chrome on a Mac (https://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx)
	}
});

casper.start(target); // Start casper

var scrolled = 0; // A variable to keep track of how much we have scrolled
var scrollDelta = null; // Keep track of how much our new scroll position differs from our last

var getContent = function() {
	casper.wait(3000, function() {
		// Wait and then (http://casperjs.readthedocs.org/en/latest/modules/casper.html#wait)
		casper.scrollToBottom(); // scroll to the bottom (http://casperjs.readthedocs.org/en/latest/modules/casper.html#scrolltobottom)
		var newScrolled = casper.evaluate(function() {
			return window.scrollY; // grab how far the window is scrolled (https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY)
		});
		scrollDelta = newScrolled - scrolled; // update scrollDelta
		scrolled = newScrolled; // and scrolled
		console.log("Now scrolled: " + scrolled);
	});
	casper.then(function() {
		// After we scroll to the bottom (http://casperjs.readthedocs.org/en/latest/modules/casper.html#then)
		if (scrollDelta != 0) {
			// Check whether scrollDelta is zero, which means that we haven't scrolled any further
			getContent(); // If scrollDelta _has_ changed, recursively call getContent
		} else {
			casper.then(function() {
				// Scraping finish
				console.log("Saving...");
				var html = String(casper.getHTML()); // grab our HTML (http://casperjs.readthedocs.org/en/latest/modules/casper.html#gethtml)
				var filename = "ig.html";
				require("fs").write(filename, html, "w"); // and save it to a file (https://docs.nodejitsu.com/articles/file-system/how-to-write-files-in-nodejs)
				console.log("...wrote HTML to", filename);
			});
		}
	});
};

getContent(); // run our recursive function

casper.run(); // and start casper

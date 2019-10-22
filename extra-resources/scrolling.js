// Trigger Scrolling infinite scroll
casper.start(url, function() {
	this.wait(10000, function() {
		this.page.scrollPosition = {
			top: this.page.scrollPosition["top"] + document.body.scrollHeight,
			left: 0
		};

		// see this
		if (this.visible("div.load-more")) {
			this.echo("I am here");
		}
	});
});

// ------------------------------------------------------------------------

// For really long static website
casper.start("http://boingboing.net", function() {
	this.scrollToBottom(); // see this
	this.wait(1000);
});

casper.then(function() {
	this.capture("boingboing.png");
});

/* ::
::::: File 			: about.js
::::: Description	: Scripts for About Us page
:: */

var About = {

	init: function() {

		this.timeline();

	},
	timeline : function () {
		$(document).ready(function() {
			var timeline =$(".timeline");
			if (timeline.length) {
				$("li", timeline).not(".year").each(function(i){
					$(this).addClass((i % 2 === 0) ? "even" : "odd");
				});
			}
		});
	}
};

About.init();
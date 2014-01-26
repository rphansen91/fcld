/* ::
::::: File 			: about.js
::::: Description	: Scripts for Home page
:: */

var Home = {

	init: function() {

		this._slider();

	},
	_slider : function () {
		$(window).load(function() {
			var revolutionSlider = $("#page-slider");
			var pageSlider,
			startwidth = (revolutionSlider.parents("body.w970").length) ? 960 : 1170;

			pageSlider = revolutionSlider.revolution({
				delay 			: 9000,
				startheight 	: 750,
				hideThumbs 		: 10,

				touchenabled 	: "on",
				onHoverStop 	: "on",
				startwidth 		: startwidth,

				navOffsetHorizontal : 0,
				navOffsetVertical 	: 0,

				stopAtSlide 	: -1,
				stopAfterLoops 	: -1,

				fullWidth 		: "on"
			});

			pageSlider.bind("revolution.slide.onloaded",function (e,data) {
				$(this).parent().css({
					background 	: "transparent",
					height 		: "auto",
					overflow 	: "visible"
				}).children().animate({'opacity':1},500);
			});

		});
	}
};

Home.init();
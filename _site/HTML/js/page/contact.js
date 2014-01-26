/* ::
::::: File 			: about.js
::::: Description	: Scripts for Contact page
:: */

var Contact = {

	init: function() {

		this._switcher();

	},
	_switcher : function () {
		$(document).ready(function(){
			$(".to-form, .to-contact").click(function(){

				var formSwitch = ($(this).is(".to-form")) ?
				["#content .form", "#content .address" ] :
				["#content .address", "#content .form" ];

				$(formSwitch[0]).addClass("current");
				$(formSwitch[1]).removeClass("current");

				return false;
			});
		});
	}
};

Contact.init();
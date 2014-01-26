/* ::
::::: File 			: theme.js
::::: Description	: Main js file
:: */

$.fn.resizeComplete = function(func, ms){
	var timer = null;
	this.resize(function(){
		if (timer)clearTimeout(timer);
		timer = setTimeout(func,ms);
	});
}

$.fn.resizeFromMobile = function(func, width){
	if ($(this).width() <= width) {
		var mobileView = true;
		$(this).resize(function(){
			if ($(this).width() > width && mobileView) {
				func();
				mobileView = false;
			}
		});
	}
}

$.isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

/* :::::::: */
/* : CORE : */
/* :::::::: */
var Jets = {

	init: function() {

		this._general.detectMobile();

		/* Header */
		this._header();

		/* Navigation */
		this._nav.carret();
		this._nav.smartMenu();
		this._nav.onePage();
		this._nav.customMenu();
		this._nav.search();
		this._nav.mobile();

		/* Page header */
		this._page_header.animation();

		/* Container */
		this._container.fullWidth();

		/* Features */
		this._features.lightbox();
		this._features.tooltip();
		this._features.formField();
		this._features.grid();
		this._features.comments();
		this._features.form();

		/* Shortcodes */
		this._shortcodes.teaser();
		this._shortcodes.alertsMessages();
		this._shortcodes.testimonial();
		this._shortcodes.tab(window, jQuery);
		this._shortcodes.accordion(window, jQuery);
		this._shortcodes.slider();
		this._shortcodes.carousel();

		/* Other */
		this._other.filter();
		this._other.project();
		this._other.smoothScroll();
		this._other.twitter();
		this._other.flickr();
		this._other.animation();
		this._other.counter();
		this._other.skill();

	},
	_general: {
		detectMobile : function () {
			if ($.isMobile) $("body").addClass("mobile");
		}
	},
	_header : function() {

		var nav 	= "#main-menu > li",
		navBottom 	= parseInt($(nav).css("padding-bottom"), 10),

		navbar 		= ".desktop-navbar",
		navbarTop	= parseInt($(navbar).css("margin-top"), 10),

		topbar 		= ".topbar",
		topbarHeight= ($(topbar).length) ? parseInt($(topbar).css("height"), 10) : 0,

		logo		= ".desktop-navbar .logo",
		logoHeight 	= $(logo).height();

		var items = [{
			target 	: topbar,
			start	: 0,
			css 	: "margin-top",
			max 	: 0,
			min 	: -1 * topbarHeight,
			ratio 	: 1
		},{
			target 	: navbar,
			start	: topbarHeight,
			css 	: "margin-top",
			max 	: navbarTop,
			min 	: navbarTop/2,
			ratio 	: 2
		},{
			target 	: nav,
			start	: topbarHeight,
			css 	: "padding-bottom",
			max 	: navBottom,
			min 	: navBottom/2,
			ratio 	: 2
		},{
			target 	: logo,
			start	: topbarHeight,
			css 	: "height",
			max 	: logoHeight,
			min 	: logoHeight/1.2,
			ratio 	: 2
		}];

		var space 		= $("#header-space"),
			header 		= $("#header").addClass("sticky").height();

			space.height(header);

		$(window).resizeFromMobile(function(){
			$(window).scrollTop(0);
			setTimeout (function(){
				space.height(header);
			},10)
		},992);

		function sticky() {
			var t = $(window).scrollTop();
			$.each(items,function(key,obj){
				if (obj.max !== obj.min) {
					if ( t - obj.start <= 0  ) {
						parallax = obj.max;
					} else if (t - obj.start >= ( obj.max - obj.min ) * obj.ratio) {
						parallax = obj.min;
					} else {
						parallax = obj.max - (t - obj.start)  / obj.ratio;
					}
					$(obj.target).css(obj.css, parallax);
				}
			});
			if (t == 0) {
				$("html").removeClass("scroll");
			} else {
				if (!$("html").is(".scroll"))
					$("html").addClass("scroll");
			}
		}
		$(window).load(sticky).scroll(sticky).scroll();
	},
	_nav: {
		carret: function () {
			$("#main-menu.carret li").each(function(){
				if ($(this).children("ul").length) $(this).children("a").addClass("carret");
			});
		},
		onePage: function () {
			var onePageMenu = $('body[data-spy="scroll"]');
			if(onePageMenu.length) {

				// edit scrollspy
				$.fn.scrollspy.Constructor.prototype.activate = function (target) {
					this.activeTarget = target

					$(this.selector).parents('li').removeClass('current')

					var selector = this.selector
					+ '[data-target="' + target + '"],'
					+ this.selector + '[href="' + target + '"]'

					var active = $(selector)
					.parents('li')
					.addClass('current')

					if (active.parent('.dropdown-menu').length)  {
						active = active
						.closest('li.dropdown')
						.addClass('current')
					}

					active.trigger('activate.bs.scrollspy')
				}
				$('body[data-spy="scroll"] .nav, #mobile-menu').on("click", " a", function(e) {

					var $that 	= $(this),
						blockID = $that.attr("href");

					if (blockID.substring(0, 1) == '#') {

						e.preventDefault();

						var headerH = ($that.parents("#mobile-menu")) ? 0 : $("#header").height(),
							toBlock = (blockID == "#home") ? 0 : $(blockID).offset().top - headerH + "px";

						$that.parent("li").addClass("current").siblings().removeClass("current");
						$("html,body").animate({
							scrollTop: toBlock
						}, 600, "easeOutQuad");

						return false;
					}
				});
			}
		},
		smartMenu: function () {
			$("#main-menu > li").hover(function(){

				if ($(this).children("ul").length == 0) return false;

				var depth = 0;
				$("li:not(:has(ul))", $(this)).each(function() {
					var cur = $(this).parents("ul").length - 1;
					if (cur > depth) depth = cur
				});

				var maxLeft = $(".navbar").offset().left + $(".navbar").outerWidth(),
				curLeft = $(this).offset().left + $(this).children("ul").outerWidth();

				if (curLeft > maxLeft)
					$(this).addClass('rtl');
				else
					$(this).removeClass('rtl');

				if (depth > 1) {
					curLeft += depth + $("ul ul", this).outerWidth();

					if (curLeft > maxLeft)
						$("ul", this).eq(0).addClass('rtl');
					else
						$("ul", this).eq(0).removeClass('rtl');
				}
			},function(){});
		},
		customMenu: function () {
			if ($("#main-menu.custom").length) {
				$("#header").append('<div id="custom-nav-bg"></div>')
			}

			function customMenu($that) {
				var visibleUl = $('#main-menu ul').filter(function() {
						return $(this).css('visibility') == 'visible';
					}).add($that.children("ul")), h = 0;

				if (visibleUl.length) {
					var f = $(visibleUl[0]).offset().top,				// get first children offset top
						b = [];											// prepare array for all height's
						for (var i = 0; i < visibleUl.length; i++) {
							b.push($(visibleUl[i]).offset().top + $(visibleUl[i]).outerHeight(true) - f);
						}
					h = Math.max.apply(Math, b);						// get MAX height
				}
				$("#custom-nav-bg").height(h + "px");
			}

			$("#main-menu.custom li").hover(function(){
				 customMenu($(this));
			}, function(){});

			$('#main-menu.custom').hover(function(){},function(){
				$("#custom-nav-bg").removeAttr("style");
			});

			if ($.isMobile) {
				$("#main-menu a").click(function(event){
					if (!$(this).is(".clicked")) {
						$(this).addClass("clicked");
						event.preventDefault();
					}
				});
				$("#main-menu.custom li").bind('click touchstart',function (event) {
	 				customMenu($(this));
				});
				$(document).bind('click touchstart',function (event) {
					if (!$(event.target).parents("#main-menu").length) {
						$("#custom-nav-bg").height(0);
						$("#main-menu a").removeClass("clicked");

					}
				});
			}
		},
		search: function () {
			var searchWrap = $("#main-search");
			$(".btn-search").click(function() {
				searchWrap.slideDown(200, 'easeOutQuad',function(){
					$("form", this).animate({opacity: 1, left: 0}, 200, "easeOutCubic");
				});
				return false;
			});
			$(".close", searchWrap).click(function() {
				$("form", searchWrap).animate({opacity: 0, left: "20px"}, 200, "easeOutCubic", function(){
					searchWrap.slideUp(200, 'easeOutQuad');
					$(this).removeAttr("style");
				}).find("input[name=query]").val("");
				return false;
			});
		},
		mobile: function () {
			var mobileMenu = $("#mobile-menu");

			// create menu
			mobileMenu.append('<div class="container" />');
			$(".container", mobileMenu).append($("#main-menu").clone().removeAttr("style id class"));

			// clear
			$("ul,li", mobileMenu).removeAttr("style id");
			$(".btn-search", mobileMenu).parent("li").remove();
			$("i, span", mobileMenu).remove();

			// add Carret
			$("li", mobileMenu).each(function(){
				if ($(this).children("ul").length) $(this).children("a").prepend('<span class="carret"></span>');
			});

			$(".btn-navbar").click(function() {
				$(mobileMenu).slideToggle(200, 'easeOutQuad');
				return false;
			});

			$(mobileMenu).on("click", "span", function(){
				var parent = $(this).parents("li").eq(0);
				if (parent.is(".active"))
					parent.removeClass("active");
				else
					parent.addClass("active");
				parent.children("ul").slideToggle(400, 'easeOutCubic');
				return false;
			});
			$(mobileMenu).on("click", "a", function(){
				if ($(this).attr("href") == "#" || $(this).attr("href") == "") {
					$(this).children('span').click();
					return false;
				}
			});

			$(window).resize(function(){
				if ($(window).width() > 992) {
					mobileMenu.removeAttr("style");
					$("ul", mobileMenu).removeAttr("style");
					$("li", mobileMenu).removeClass("active");
				}
			})
		}
	},
	_page_header : {
		animation: function() {

			var parallaxItem = $('#page-header *[class*="hide-to-"]');
			if (parallaxItem.length) {
				function parallax() {

					var windowPosition = $(window).scrollTop();
					parallaxItem.each(function(){

						var $that 			= $(this).css("position","relative"),
							parallaxStart 	= 0,
							parallaxStep 	= 300;


							if ($that.is('.hide-to-left')) {
								css = { "opacity" : [1,0], "right" : [0,"100px"] }
							} else if ($that.is('.hide-to-right')) {
								css = { "opacity" : [1,0], "left" : [0,"100px"] }
							} else if ($that.is('.hide-to-top')) {
								css = { "opacity" : [1,0], "bottom" : [0,"100px"] }
							} else if ($that.is('.hide-to-bottom')) {
								css = { "opacity" : [1,0], "top" : [0,"100px"] }
							}

							$.each(css,function(parameter,value){

									var type = NaN;
									for (var i = 0; i < value.length; i++) {
										if (!$.isNumeric(value[i])) {
											type = value[i].replace(/\d+/g, '').replace('-', '');
										}
									};

									start 	= parseInt(value[0], 10);
									end  	= parseInt(value[1], 10);

									if ($.isNumeric(start) && $.isNumeric(end)) {
										if (windowPosition - parallaxStart <= 0) {
											parallax = start;
										} else if (windowPosition - parallaxStart >= parallaxStep) {
											parallax = end;
										} else {
											parallax = start + (end - start)*((windowPosition - parallaxStart)  / parallaxStep);
										}
										$that.css(parameter, type ? parallax + type : parallax);
									}
							});
					});

				}
				$(window).load(parallax).scroll(parallax).resizeComplete(parallax,50);
			}
		}
	},
	_container : {
		fullWidth : function() {
			var containerFullWidth = $(".container-out.container-full-width");
			if (containerFullWidth.parents("#boxed").length == 0 && containerFullWidth.length >= 1) {
				function call_containerFullWidth (){
					containerFullWidth.width($(window).width()).css("margin-left",$("#content").offset().left * -1 + "px");
				}
				call_containerFullWidth();
				$(window).resizeComplete(call_containerFullWidth);
			}
		}
	},
	_features : {
		lightbox : function() {

			$('.lightbox').fancybox({
				padding : 0,
				helpers : {
					title : {
						type 	: 'over'
					}
				},
				tpl : {
					closeBtn 	: '<a title="Close" class="btn btn-icon-close close" href="javascript:;"></a>',
					prev 		: '<a title="Previous" class="btn btn-icon-prev prev" href="javascript:;"></a>',
					next 		: '<a title="Next" class="btn btn-icon-next next" href="javascript:;"></a>'
				},
				closeSpeed : 150
			});

		},
		tooltip : function() {
			$(document).ready(function(){
				$("a[data-toggle=tooltip]").tooltip();
			});
		},
		formField : function() {
			$(document).ready(function(){
				var formField = $("input,textarea",".form-field");
				formField.focus(function(){
					$(this).parent().addClass("focus");
				}).focusout(function(){
					$(this).parent().removeClass("focus");
				}).bind("change keyup input",function () {
					if ($(this).val() !== "")
						$(this).parent().find("label").hide();
					else {
						$(this).parent().find("label").show();
					}
				});
			});
		},
		grid : function () {
			var grid = $(".grid");
			if (grid.length) {
				$(window).load(function(){

					grid.each(function(){

						var	$that 	= $(this),
							box 	= $that.children(),
							col 	= parseFloat($that.data("columns"), 10), col = (col) ? col : 5,margin;

						$(window).smartresize(function() {

							margin 	= parseInt(box.css("margin-left").replace("px",""));

							// get grid width
							var gridWidth = $that.width()-margin, newCol;

							if (gridWidth < 1201 && gridWidth >= 900 && col > 4) // bigger that content
								newCol = 4;
							else if (gridWidth < 900 && gridWidth >= 728 && col > 3) // iPad horizontal full width
								newCol = 3;
							else if (gridWidth < 728 && gridWidth >= 480 && col > 2) // iPhone horizontal full width
								newCol = 2;
							else if (gridWidth < 480 && col > 1) // other phones horizontal full width
								newCol = 1;
							else newCol = col;

							// set new width to item
							box.css("width", Math.floor(($that.width()-margin*newCol)/newCol) + "px");

							imagesLoaded($that, function() {

								if ($that.is(".isotope")) {

									$that.isotope('reLayout')
										$(".slider", $that).trigger("updateSizes");

								} else {
									setTimeout(function(){

										var gridLayoutMode = $that.is(".posts") ? "masonry" : "fitRows";

										$that.isotope({
											layoutMode 	: gridLayoutMode,
											itemSelector: box,
											resizable	: false
										}).animate({"opacity":1},500);

									}, 1000);
								}
							});

						}).smartresize();

					});

				});
			}
		},
		comments : function () {
			var comments 	= $(".comments"),
			replyBlock 	= $("#reply");
			if (comments.length) {
				$(".reply a", comments).click(function(){
					var $that = $(this);
					replyBlock.animate({opacity:0},100,function(){
						$(this).appendTo($that.closest(".comment")).animate({opacity:1},200);
					});
					return false;
				});
				$(".close", replyBlock).click(function(){
					replyBlock.animate({opacity:0},100,function(){
						$(this).appendTo($("li",comments).last()).animate({opacity:1},200);
					});
					return false;
				});
				$(".comments a.post-comment").click(function(){
					$("html, body").animate({
						scrollTop: replyBlock.offset().top-500
					}, 500);
					$("input#name ").focus();
					return false;
				});
			}
		},
		form : function () {
			var formValidate = $("form.form-validate");
			if (formValidate.length) {
				formValidate.each(function(){
					$(this).validate({
						submitHandler: function(form) {

							if ($(form).is("#contact-form")) $(form).parent(".form-inner").addClass("sending");

							$.ajax({
								type 	: $(form).attr("method"),
								url		: $(form).attr("action"),
								data 	: $(form).serialize(),
								dataType: "json",
								success : function (data) {

									if ($(form).is("#contact-form")) $(form).parent(".form-inner").removeClass("sending");

									/* Show response */
									$(form).append('<div class="response '+data.response+'">'+data.text+'</div>');

									/* Revert to normal */
									if (data.response == "success") {
										$(".form-field label", $(form)).show();
										$("input[type=text], input[type=email], textarea", $(form)).val("").text("");
									}

									/* Hide response */
									setTimeout(function(){
										$(".response", $(form)).animate({left:"-15px", opacity:0}, 300, 'easeInOutExpo',function(){
											$(this).slideUp(400, 'easeInOutExpo',function(){
												$(this).remove();
											})
										});
									},5000);
								}
							});
						},
						highlight: function (e) {
							$(e).parent(".form-field").addClass("error");
						},
						success: function (label, e) {
							$(e).parent(".form-field").removeClass("error").next("span.error").remove();
						},
						errorPlacement: function(error, e){

							var eField = $(e).parent(".form-field");

							eField.next("span.error").remove();
							eField.after('<span class="error text-error">'+error.text()+'</span>');
						}
					});
				});
			}
		}
	},
	_shortcodes : {
		teaser : function() {
			var teaser = $('.teaser');
			if (teaser.length) {
				$(window).resize(function(){
					teaser.each(function(){
						var $that = $(".teaser-info", $(this));
						$that.css({marginTop: $that.height()/-2 + "px"});
					});
				}).resize();
			}
		},
		alertsMessages : function() {
			$(document).ready(function(){
				$(".alert .close").click(function(){

					$(this).closest('.alert').animate({left:"-50px", opacity:0}, 300, 'easeInOutExpo',function(){
						$(this).slideUp(400, 'easeInOutExpo',function(){
							$(this).remove();
						})
					});
					return false;
				});
			});
		},
		testimonial : function() {
			var testimonial = $(".testimonial");
			if (testimonial.length) {
				$(window).load(function() {

					// Init testimonials
					testimonial.carouFredSel({
						auto 		: function() {
							return $(this).attr("data-auto")== "true" ? true : false;
						},
						pagination	: {
							anchorBuilder: function(nr, item) {
								return '<a href="#'+nr+'">'+nr+'</a>';
							}
						},
						scroll : {
							fx 			: "crossfade",
							duration 	: 800,
							onBefore: function (data) {

								var $that			= $(this),
									testWrap 		= $that.closest(".testimonial-wrap"),
									testHeadingCur	= $(".testimonial-heading.current", testWrap),
									testHeadingNew	= $(".testimonial-heading", data.items.visible);

								testHeadingCur.animate({
									left: (data.scroll.direction == "next") ? "20px" : "-20px",
									opacity: 0,
								}, 400, "easeInOutBack");

								testHeadingNew.clone().appendTo(testWrap).css({
									left: (data.scroll.direction == "next") ? "-20px" : "20px"
								}).delay(250).animate({
									left: 0,
									opacity: 1,
								}, 400, "easeOutCirc",function(){
									testHeadingCur.remove();
									$(this).addClass("current").removeAttr("style");
								});
							}
						},
						width   	: "100%",
						height 		: "variable",
						responsive	: true,
						items 		: {
							width : 100,
							height: "variable"
						},
						onCreate  	: function (data) {

							// Variables
							var $that	= $(this),
							testWrap 	= $that.parents(".testimonial-wrap");

							// Process
							testWrap.append($(".testimonial-heading", data.items[0]).clone().addClass("current")).css({
								overflow 	: "visible",
								height 		: "auto"
							}).animate({
								opacity		: 1
							}, 500);
						},
					},{
						debug : false,
						wrapper 	: {
							classname :"testimonial-inner"
						}
					});

					// Create Nav or Pagination
					$(".testimonial").each(function(){

						var $that		= $(this),
							testWrap 	= $that.parents(".testimonial-wrap");

						if ($(".testimonial-pagi", testWrap).length) {
							$that.trigger("configuration", ["pagination.container", $(".testimonial-pagi", testWrap)])
						} else if ($(".testimonial-nav", testWrap).length) {
								$that.trigger("configuration", {
								prev 		: {
									button 	: function() {
										return $("a.prev", testWrap);
									}
								},
								next		: {
									button	: function() {
										return $("a.next", testWrap);
									}
								}
							});
						}
					});
				});
			}
		},
		tab : function ( window, $, undefined ) {

			"use strict"; // jshint ;_;

			var Tab = function (element, options) {
				this.init('tab', element, options);
			};

			Tab.prototype = {
				constructor:Tab,
				init: function (type, element, options) {

					var new_options = {};
					$(this).each(function() {
						$.each(element.attributes, function() {
							if(this.specified) {
								if(this.name.indexOf('data-') != -1) {
									var type;

									if (this.value == 'true') {
										type = true;
									} else if (this.value == 'false') {
										type = false;
									} else {
										type = this.value;
									}
									new_options[this.name.replace('data-','')] = type;
								}
							}
						});
					});

					var opt		= $.extend({}, $.fn[type].defaults, new_options),
						navs	= $(".tab-heading > li", element),
						current = $(".tab-heading > li.current", element),
						tab		= $(".tab-content > div", element),
						isVertical = $(element).is('.tab-vertical');

					var $this = this;

					$(document).ready(function() {

						var active;
						if (current.length > 1) {
							current.each(function(i){
								if (i == 0) {
									active = $(current.get(0)).index();
								} else {
									$(this).removeClass('current');
								}
							});
						} else if (current.length == 1) {
							active = $(current.get(0)).index();
						} else {
							active = 0;
							navs.eq(active).addClass('current');
						}

						tab.each(function(i){
							if (i == active) {
								$(this).addClass('current');
							} else {
								$(this).removeClass('current');
							}
						});

					});

					$("a", navs).click(function(e){
						e.preventDefault();
					});
					$(navs).click(function(){

						// multiple click protection
						if ($(element).is('.active')) return false;

						// multiple click protection
						if ($(this).is('.current')) return false;

						$(this).addClass('current').siblings().removeClass('current');

						var next = $(this).index(),
						prev = $(".tab-content > div:visible", element).index();

						if (opt.animation == 'fade' || opt.animation == 'slide') {

							var to,from;
							if (opt.animation == 'fade') {
								to = {opacity:0},from = {opacity:0};
							} else {
								if (prev > next) {
									to		= isVertical ? {opacity:0,top:'30px'} : {opacity:0,left:'30px'},
									from	= isVertical ? {opacity:0,top:'-30px'} : {opacity:0,left:'-30px'};
								} else {
									to		= isVertical ? {opacity:0,top:'-30px'} : {opacity:0,left:'-30px'},
									from	= isVertical ? {opacity:0,top:'30px'} : {opacity:0,left:'30px'};
								}
							}

							$(element).addClass('active');
							$(".tab-content > div:visible",element).animate(to,opt.speed,"easeInOutBack",function(){
								$(this).hide().removeClass('current');
								tab.eq(next).show().css(from).animate({opacity:1,left:0,top:0},opt.speed,"easeOutCirc",function(){
									$(element).removeClass('active');
								}).addClass('current');
							});

						} else {
							tab.eq(next).css({'display':'block','opacity':1}).siblings().css({'display':'none','opacity':0});
						}
					});
				}
			}

			$.fn.tab = function ( option ) {
				return this.each(function () {
					var $this = $(this),
					data = $this.data('tab'),
					options = typeof option == 'object' && option;
					if (!data) $this.data('tab', (data = new Tab(this, options)));
					if (typeof option == 'string') data[option]();
				});
			};

			$.fn.tab.Constructor = Tab;

			$.fn.tab.defaults = {
				fwnavs: false,
				animation: 'fade',
				speed: 250
			};

			$(window).load(function() {
				$(".tab").tab();
			});
		},
		accordion : function( window, $, undefined ) {

			"use strict"; // jshint ;_;

			var Accordion = function (element, options) {
				this.init('accordion', element, options);
			};

			Accordion.prototype = {
				constructor:Accordion,
				init: function (type, element, options) {

					var new_options = {};
					$(this).each(function() {
						$.each(element.attributes, function() {
							if(this.specified) {
								if(this.name.indexOf('data-') != -1) {
									var type;

									if (this.value == 'true') {
										type = true;
									} else if (this.value == 'false') {
										type = false;
									} else {
										type = this.value;
									}
									new_options[this.name.replace('data-','')] = type;
								}
							}
						});
					});

					var opt		= $.extend({}, $.fn[type].defaults, new_options),
					heading	= $('div > .accordion-heading', element);

					$(heading).click(function(){

						var block 	= $(this).parent(),
						content = $('.accordion-content', block);

						if (opt.toggle === true) {
							if (block.is('.active'))
								content.slideUp(opt.speed, 'easeInOutExpo').parent().removeClass('active');
							else
								content.slideDown(opt.speed, 'easeInOutExpo').parent().addClass('active').siblings().removeClass('active').children('.accordion-content').slideUp(opt.speed, 'easeInOutExpo')
						} else
						content.slideToggle(opt.speed,'easeInOutExpo').parent().toggleClass('active');
					});
					$("a", heading).click(function(e){
						e.preventDefault();
					});
				}
			};

			$.fn.accordion = function ( option ) {
				return this.each(function () {
					var $this = $(this),
					data = $this.data('accordion'),
					options = typeof option == 'object' && option;
					if (!data) $this.data('accordion', (data = new Accordion(this, options)));
					if (typeof option == 'string') data[option]();
				});
			};

			$.fn.accordion.Constructor = Accordion;

			$.fn.accordion.defaults = {
				toggle: false,
				speed: 400
			};

			$(window).load(function() {
				$(".accordion").accordion();
			});
		},
		slider : function() {
			var slider = $('.slider');
			if (slider.length) {
				$(window).load(function(){

					slider.wrap('<div class="slider-wrap"></div>').closest(".slider-wrap").prepend('<ul class="slider-nav"><li><a href="#" class="btn btn-icon-prev prev"></a></li><li><a href="#" class="btn btn-icon-next next"></a></li></ul>');
					slider.each(function(){

						$(this).carouFredSel({
							auto 		: {
								play 			: $(this).attr("data-auto") == "true" ? true : false,
								timeoutDuration : $(this).attr("data-duration") !== "" ? parseInt($(this).attr("data-duration"))  : 1000
							},
							scroll : {
								fx 		: $(this).attr("data-animation") == "scroll" ? "scroll" : "crossfade"
							},
							prev 		: {
								button 	: function() {
									return $(this).closest(".slider-wrap").find("a.prev");
								}
							},
							next		: {
								button	: function() {
									return $(this).closest(".slider-wrap").find("a.next");
								}
							},
							width   	: "100%",
							height 		: "variable",
							responsive	: true,
							items 		: {
								width : 100,
								height: "variable"
							},
							onCreate  	: function (data) {
								$(this).trigger("updateSizes").animate({'opacity':1},500);
							},
							pagination	: {
								anchorBuilder: function(nr, item) {
									return '<a href="#'+nr+'">'+nr+'</a>';
								}
							}
						},{
							debug : false
						});
					});

				});
				slider.swipe({
					swipeLeft:function(event, direction, distance, duration, fingerCount) {
						$(this).trigger("next");
					},
					swipeRight:function(event, direction, distance, duration, fingerCount) {
						$(this).trigger("prev");
					}
				});
			}
		},
		carousel : function() {

			var carousel = $(".carousel");
			if (carousel.length) {

				function carousel_visible (carousel) {
					var	carouselWidth 	= carousel.parents(".carousel-wrap").eq(0).width(),
						visible 		= parseFloat(carousel.data("visible"), 10), visible = (visible) ? visible : 5;

						var newCol;
						if (carouselWidth < 1201 && carouselWidth >= 984 && visible > 4) // bigger that content
							newCol = 4;
						else if (carouselWidth < 984 && carouselWidth >= 751 && visible > 3) // iPad horizontal full width
							newCol = 3;
						else if (carouselWidth < 751 && carouselWidth >= 480 && visible > 2) // iPhone horizontal full width
							newCol = 2;
						else if (carouselWidth < 488 && visible > 1) // other phones horizontal full width
							newCol = 1;
						else newCol = visible;
					return newCol;
				}

				$(window).load(function(){

					// Wrap carousel
					carousel.wrap('<div class="carousel-outer"><div class="carousel-inner"></div></div>');

					// Init carousel
					carousel.carouFredSel({
						auto 		: false,
						prev 		: {
							button 	: function() {
								var btn = $("a.prev[href=" + $(this).attr("id") + "]");
								return  (btn.length) ? btn : $(this).closest(".carousel-wrap").find(".carousel-nav a.prev");
							}
						},
						next		: {
							button	: function() {
								var btn = $("a.next[href=" + $(this).attr("id") + "]");
								return  (btn.length) ? btn : $(this).closest(".carousel-wrap").find(".carousel-nav a.next");
							}
						},
						width   	: "100%",
						height 		: "variable",
						responsive	: true,
						items 		: {
							width : 100,
							height: "variable",
							visible : function(){
								return carousel_visible ($(this));
							}
						},
						onCreate  	: function (data) {
							var $that = $(this);
							setTimeout(function() {


								$that.trigger("updateSizes").find(".slider").trigger("updateSizes");
								$that.closest(".carousel-wrap").addClass("created")


							}, 100)

						}
					},{
						debug : false
					});


					carousel.each(function(){

						var $that 		= $(this),
							carouselWrap= $that.closest(".carousel-wrap"),
							carouselPagi= $(".carousel-pagi", carouselWrap);

						// Set Pagination
						if (carouselPagi.length)
							$that.trigger("configuration", ["pagination.container", carouselPagi])

						// Set mouse swipe
						if ($that.parents(".container-out.container-full-width").length)
							$that.trigger("configuration", ["swipe.onMouse", true]);

					});

					$(".container-out.container-full-width .carousel").swipe({
						swipeLeft:function(event, direction, distance, duration, fingerCount) {
							$(this).trigger("next");
						},
						swipeRight:function(event, direction, distance, duration, fingerCount) {
							$(this).trigger("prev");
						}
					});

				});

				// on Resize actions
				$(window).resizeComplete(function(){
					carousel.each(function(){
						$(this).trigger("configuration", ["items.visible", carousel_visible ($(this))]).trigger("updateSizes").find(".slider").trigger("updateSizes");
					});
				},100);

				//carousel grabbing class
				$('body').on('mousedown','.container-full-width .caroufredsel_wrapper',function(){
					$(this).addClass('active');
				});
				$('body').on('mouseup','.container-full-width .caroufredsel_wrapper',function(){
					$(this).removeClass('active');
				});

			}
		}
	},
	_other : {
		project : function () {
			var project = $(".project.project-animated");
			if (project.length) {

				$(document).ready(function(){

					project.hover(function(){
						$(".project-content", this).css("bottom", $(".project-content", this).stop().height() * -1).animate({"bottom": 0},200);
					}, function(){
						$(".project-content", this).stop().animate({"bottom": $(".project-content", this).outerHeight(true) * -1},200,function(){
							$(this).removeAttr("style");
						});
					});

				});
			}
		},
		filter : function () {
			var filter = $(".project-filter");
			if (filter.length) {

				if (filter.is(".animated")) {
					// slideToggleHor setUp
					$("a", filter).hide();
					// $("a", filter).not(".active").hide();

					$.fn.slideHorShow = function( speed, easing, callback ) {
						this.animate( {
							marginLeft 		: "show",
							marginRight 	: "show",
							paddingLeft 	: "show",
							paddingRight 	: "show",
							width 			: "show"
						}, speed, easing, callback);
					};
					$.fn.slideHorHide = function( speed, easing, callback ) {
						this.animate( {
							marginLeft 		: "hide",
							marginRight 	: "hide",
							paddingLeft 	: "hide",
							paddingRight 	: "hide",
							width 			: "hide"
						}, speed, easing, callback);
					};

					// show/hide/click filter
					var filterTimeout;
					$("ul" ,filter).hover(function() {
						var $that = this;
						filterTimeout = setTimeout(function(){
							$("a", $that).stop(true, true).slideHorShow(200, "easeOutQuad");
						}, 100);
					}, function() {
						clearTimeout(filterTimeout);
						$("a", this).stop(true, true).slideHorHide(200, "easeOutQuad");
					});
				}

				filter.on("click", "a", function() {

					if ($(this).is(".active")) return false;

					var o = $(this).attr("data-categories");
					$(".project-filter-current").text((o == "*") ? "All" : o);
					$(this).addClass("active").parent("li").siblings().find("a").removeClass("active");
					if (o) {
						o = (o == "*") ? "*" : "." + o;
						$(".projects.isotope").isotope({ filter : o });
					}
					return false;
				});
			}
		},
		smoothScroll : function() {
			if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {

				// SmoothScroll for websites v1.2.1
				// Licensed under the terms of the MIT license.

				// People involved
				//  - Balazs Galambosi (maintainer)
				//  - Michael Herf     (Pulse Algorithm)

				// Scroll Variables (tweakable)
				var defaultOptions = {

					// Scrolling Core
					frameRate        : 150, // [Hz]
					animationTime    : 700, // [px]
					stepSize         : 80, // [px]

					// Pulse (less tweakable)
					// ratio of "tail" to "acceleration"
					pulseAlgorithm   : true,
					pulseScale       : 8,
					pulseNormalize   : 1,

					// Acceleration
					accelerationDelta : 20,  // 20
					accelerationMax   : 1,   // 1

					// Keyboard Settings
					keyboardSupport   : true,  // option
					arrowScroll       : 50,     // [px]

					// Other
					touchpadSupport   : true,
					fixedBackground   : true,
					excluded          : ""
				};

				var options = defaultOptions;

				// Other Variables
				var isExcluded = false;
				var isFrame = false;
				var direction = { x: 0, y: 0 };
				var initDone  = false;
				var root = document.documentElement;
				var activeElement;
				var observer;
				var deltaBuffer = [ 120, 120, 120 ];

				var key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32,
							pageup: 33, pagedown: 34, end: 35, home: 36 };


				/***********************************************
				 * INITIALIZE
				 ***********************************************/

				/**
				 * Tests if smooth scrolling is allowed. Shuts down everything if not.
				 */
				function initTest() {

					var disableKeyboard = false;

					// disable keys for google reader (spacebar conflict)
					if (document.URL.indexOf("google.com/reader/view") > -1) {
						disableKeyboard = true;
					}

					// disable everything if the page is blacklisted
					if (options.excluded) {
						var domains = options.excluded.split(/[,\n] ?/);
						domains.push("mail.google.com"); // exclude Gmail for now
						for (var i = domains.length; i--;) {
							if (document.URL.indexOf(domains[i]) > -1) {
								observer && observer.disconnect();
								removeEvent("mousewheel", wheel);
								disableKeyboard = true;
								isExcluded = true;
								break;
							}
						}
					}

					// disable keyboard support if anything above requested it
					if (disableKeyboard) {
						removeEvent("keydown", keydown);
					}

					if (options.keyboardSupport && !disableKeyboard) {
						addEvent("keydown", keydown);
					}
				}

				/**
				 * Sets up scrolls array, determines if frames are involved.
				 */
				function init() {

					if (!document.body) return;

					var body = document.body;
					var html = document.documentElement;
					var windowHeight = window.innerHeight;
					var scrollHeight = body.scrollHeight;

					// check compat mode for root element
					root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
					activeElement = body;

					initTest();
					initDone = true;

					// Checks if this script is running in a frame
					if (top != self) {
						isFrame = true;
					}

					/**
					 * This fixes a bug where the areas left and right to
					 * the content does not trigger the onmousewheel event
					 * on some pages. e.g.: html, body { height: 100% }
					 */
					else if (scrollHeight > windowHeight &&
							(body.offsetHeight <= windowHeight ||
							 html.offsetHeight <= windowHeight)) {

						// DOMChange (throttle): fix height
						var pending = false;
						var refresh = function () {
							if (!pending && html.scrollHeight != document.height) {
								pending = true; // add a new pending action
								setTimeout(function () {
									html.style.height = document.height + 'px';
									pending = false;
								}, 500); // act rarely to stay fast
							}
						};
						html.style.height = 'auto';
						setTimeout(refresh, 10);

						var config = {
							attributes: true,
							childList: true,
							characterData: false
						};

						observer = new MutationObserver(refresh);
						observer.observe(body, config);

						// clearfix
						if (root.offsetHeight <= windowHeight) {
							var underlay = document.createElement("div");
							underlay.style.clear = "both";
							body.appendChild(underlay);
						}
					}

					// gmail performance fix
					if (document.URL.indexOf("mail.google.com") > -1) {
						var s = document.createElement("style");
						s.innerHTML = ".iu { visibility: hidden }";
						(document.getElementsByTagName("head")[0] || html).appendChild(s);
					}
					// facebook better home timeline performance
					// all the HTML resized images make rendering CPU intensive
					else if (document.URL.indexOf("www.facebook.com") > -1) {
						var home_stream = document.getElementById("home_stream");
						home_stream && (home_stream.style.webkitTransform = "translateZ(0)");
					}
					// disable fixed background
					if (!options.fixedBackground && !isExcluded) {
						body.style.backgroundAttachment = "scroll";
						html.style.backgroundAttachment = "scroll";
					}
				}


				/************************************************
				 * SCROLLING
				 ************************************************/

				var que = [];
				var pending = false;
				var lastScroll = +new Date;

				/**
				 * Pushes scroll actions to the scrolling queue.
				 */
				function scrollArray(elem, left, top, delay) {

					delay || (delay = 1000);
					directionCheck(left, top);

					if (options.accelerationMax != 1) {
						var now = +new Date;
						var elapsed = now - lastScroll;
						if (elapsed < options.accelerationDelta) {
							var factor = (1 + (30 / elapsed)) / 2;
							if (factor > 1) {
								factor = Math.min(factor, options.accelerationMax);
								left *= factor;
								top  *= factor;
							}
						}
						lastScroll = +new Date;
					}

					// push a scroll command
					que.push({
						x: left,
						y: top,
						lastX: (left < 0) ? 0.99 : -0.99,
						lastY: (top  < 0) ? 0.99 : -0.99,
						start: +new Date
					});

					// don't act if there's a pending queue
					if (pending) {
						return;
					}

					var scrollWindow = (elem === document.body);

					var step = function (time) {

						var now = +new Date;
						var scrollX = 0;
						var scrollY = 0;

						for (var i = 0; i < que.length; i++) {

							var item = que[i];
							var elapsed  = now - item.start;
							var finished = (elapsed >= options.animationTime);

							// scroll position: [0, 1]
							var position = (finished) ? 1 : elapsed / options.animationTime;

							// easing [optional]
							if (options.pulseAlgorithm) {
								position = pulse(position);
							}

							// only need the difference
							var x = (item.x * position - item.lastX) >> 0;
							var y = (item.y * position - item.lastY) >> 0;

							// add this to the total scrolling
							scrollX += x;
							scrollY += y;

							// update last values
							item.lastX += x;
							item.lastY += y;

							// delete and step back if it's over
							if (finished) {
								que.splice(i, 1); i--;
							}
						}

						// scroll left and top
						if (scrollWindow) {
							window.scrollBy(scrollX, scrollY);
						}
						else {
							if (scrollX) elem.scrollLeft += scrollX;
							if (scrollY) elem.scrollTop  += scrollY;
						}

						// clean up if there's nothing left to do
						if (!left && !top) {
							que = [];
						}

						if (que.length) {
							requestFrame(step, elem, (delay / options.frameRate + 1));
						} else {
							pending = false;
						}
					};

					// start a new queue of actions
					requestFrame(step, elem, 0);
					pending = true;
				}


				/***********************************************
				 * EVENTS
				 ***********************************************/

				/**
				 * Mouse wheel handler.
				 * @param {Object} event
				 */
				function wheel(event) {

					if (!initDone) {
						init();
					}

					var target = event.target;
					var overflowing = overflowingAncestor(target);

					// use default if there's no overflowing
					// element or default action is prevented
					if (!overflowing || event.defaultPrevented ||
						isNodeName(activeElement, "embed") ||
					   (isNodeName(target, "embed") && /\.pdf/i.test(target.src))) {
						return true;
					}

					var deltaX = event.wheelDeltaX || 0;
					var deltaY = event.wheelDeltaY || 0;

					// use wheelDelta if deltaX/Y is not available
					if (!deltaX && !deltaY) {
						deltaY = event.wheelDelta || 0;
					}

					// check if it's a touchpad scroll that should be ignored
					if (!options.touchpadSupport && isTouchpad(deltaY)) {
						return true;
					}

					// scale by step size
					// delta is 120 most of the time
					// synaptics seems to send 1 sometimes
					if (Math.abs(deltaX) > 1.2) {
						deltaX *= options.stepSize / 120;
					}
					if (Math.abs(deltaY) > 1.2) {
						deltaY *= options.stepSize / 120;
					}

					scrollArray(overflowing, -deltaX, -deltaY);
					event.preventDefault();
				}

				/**
				 * Keydown event handler.
				 * @param {Object} event
				 */
				function keydown(event) {

					var target   = event.target;
					var modifier = event.ctrlKey || event.altKey || event.metaKey ||
								  (event.shiftKey && event.keyCode !== key.spacebar);

					// do nothing if user is editing text
					// or using a modifier key (except shift)
					// or in a dropdown
					if ( /input|textarea|select|embed/i.test(target.nodeName) ||
						 target.isContentEditable ||
						 event.defaultPrevented   ||
						 modifier ) {
					  return true;
					}
					// spacebar should trigger button press
					if (isNodeName(target, "button") &&
						event.keyCode === key.spacebar) {
					  return true;
					}

					var shift, x = 0, y = 0;
					var elem = overflowingAncestor(activeElement);
					var clientHeight = elem.clientHeight;

					if (elem == document.body) {
						clientHeight = window.innerHeight;
					}

					switch (event.keyCode) {
						case key.up:
							y = -options.arrowScroll;
							break;
						case key.down:
							y = options.arrowScroll;
							break;
						case key.spacebar: // (+ shift)
							shift = event.shiftKey ? 1 : -1;
							y = -shift * clientHeight * 0.9;
							break;
						case key.pageup:
							y = -clientHeight * 0.9;
							break;
						case key.pagedown:
							y = clientHeight * 0.9;
							break;
						case key.home:
							y = -elem.scrollTop;
							break;
						case key.end:
							var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
							y = (damt > 0) ? damt+10 : 0;
							break;
						case key.left:
							x = -options.arrowScroll;
							break;
						case key.right:
							x = options.arrowScroll;
							break;
						default:
							return true; // a key we don't care about
					}

					scrollArray(elem, x, y);
					event.preventDefault();
				}

				/**
				 * Mousedown event only for updating activeElement
				 */
				function mousedown(event) {
					activeElement = event.target;
				}


				/***********************************************
				 * OVERFLOW
				 ***********************************************/

				var cache = {}; // cleared out every once in while
				setInterval(function () { cache = {}; }, 10 * 1000);

				var uniqueID = (function () {
					var i = 0;
					return function (el) {
						return el.uniqueID || (el.uniqueID = i++);
					};
				})();

				function setCache(elems, overflowing) {
					for (var i = elems.length; i--;)
						cache[uniqueID(elems[i])] = overflowing;
					return overflowing;
				}

				function overflowingAncestor(el) {
					var elems = [];
					var rootScrollHeight = root.scrollHeight;
					do {
						var cached = cache[uniqueID(el)];
						if (cached) {
							return setCache(elems, cached);
						}
						elems.push(el);
						if (rootScrollHeight === el.scrollHeight) {
							if (!isFrame || root.clientHeight + 10 < rootScrollHeight) {
								return setCache(elems, document.body); // scrolling root in WebKit
							}
						} else if (el.clientHeight + 10 < el.scrollHeight) {
							overflow = getComputedStyle(el, "").getPropertyValue("overflow-y");
							if (overflow === "scroll" || overflow === "auto") {
								return setCache(elems, el);
							}
						}
					} while (el = el.parentNode);
				}


				/***********************************************
				 * HELPERS
				 ***********************************************/

				function addEvent(type, fn, bubble) {
					window.addEventListener(type, fn, (bubble||false));
				}

				function removeEvent(type, fn, bubble) {
					window.removeEventListener(type, fn, (bubble||false));
				}

				function isNodeName(el, tag) {
					return (el.nodeName||"").toLowerCase() === tag.toLowerCase();
				}

				function directionCheck(x, y) {
					x = (x > 0) ? 1 : -1;
					y = (y > 0) ? 1 : -1;
					if (direction.x !== x || direction.y !== y) {
						direction.x = x;
						direction.y = y;
						que = [];
						lastScroll = 0;
					}
				}

				var deltaBufferTimer;

				function isTouchpad(deltaY) {
					if (!deltaY) return;
					deltaY = Math.abs(deltaY)
					deltaBuffer.push(deltaY);
					deltaBuffer.shift();
					clearTimeout(deltaBufferTimer);
					var allEquals    = (deltaBuffer[0] == deltaBuffer[1] &&
										deltaBuffer[1] == deltaBuffer[2]);
					var allDivisable = (isDivisible(deltaBuffer[0], 120) &&
										isDivisible(deltaBuffer[1], 120) &&
										isDivisible(deltaBuffer[2], 120));
					return !(allEquals || allDivisable);
				}

				function isDivisible(n, divisor) {
					return (Math.floor(n / divisor) == n / divisor);
				}

				var requestFrame = (function () {
					  return  window.requestAnimationFrame       ||
							  window.webkitRequestAnimationFrame ||
							  function (callback, element, delay) {
								  window.setTimeout(callback, delay || (1000/60));
							  };
				})();

				var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;


				/***********************************************
				 * PULSE
				 ***********************************************/

				/**
				 * Viscous fluid with a pulse for part and decay for the rest.
				 * - Applies a fixed force over an interval (a damped acceleration), and
				 * - Lets the exponential bleed away the velocity over a longer interval
				 * - Michael Herf, http://stereopsis.com/stopping/
				 */
				function pulse_(x) {
					var val, start, expx;
					// test
					x = x * options.pulseScale;
					if (x < 1) { // acceleartion
						val = x - (1 - Math.exp(-x));
					} else {     // tail
						// the previous animation ended here:
						start = Math.exp(-1);
						// simple viscous drag
						x -= 1;
						expx = 1 - Math.exp(-x);
						val = start + (expx * (1 - start));
					}
					return val * options.pulseNormalize;
				}

				function pulse(x) {
					if (x >= 1) return 1;
					if (x <= 0) return 0;

					if (options.pulseNormalize == 1) {
						options.pulseNormalize /= pulse_(1);
					}
					return pulse_(x);
				}

				addEvent("mousedown", mousedown);
				addEvent("mousewheel", wheel);
				addEvent("load", init);
			}
		},
		twitter : function() {
			$(document).ready(function(){
				var tweets = $("#tweets");
				if (tweets.length) tweets.twitterfeed();
			});
		},
		flickr : function() {
			$(document).ready(function(){
				var flickr = $("#flickr");
				if (flickr.length) {
					flickr.jflickrfeed({
						limit	: 6,
						qstrings: {
							id: '8114993@N06'
						},
						itemTemplate: 	'<li>'+
											'<a class="lightbox" href="{{image_b}}" data-fancybox-group="flickr">'+
												'<span class="btn btn-icon-view"></span>'+
												'<img src="{{image_s}}" alt="{{title}}">'+
											'</a>'+
										'</li>'
					});
				}
			});
		},
		animation : function() {
			if (!$.isMobile) {
				var animationItem = $('.animation[class*="animation-"]');
				if (animationItem.length) {

					$(window).load(function(){

						var delay;
						animationItem.not(".active").each(function(i){
							if (i !=0 && $(this).offset().top == $(animationItem.get(i-1)).offset().top) {
								delay++
							} else { delay= 0 }

							$(this).css({
								'-webkit-transition-delay': delay*100+'ms',
								'-moz-transition-delay': delay*100+'ms',
								'-o-transition-delay': delay*100+'ms',
								'-ms-transition-delay': delay*100+'ms',
								'transition-delay': delay*100+'ms'
							});

						});

						setTimeout(function(){
							$(window).scroll(function(){

								var scrollTop = $(window).scrollTop();
								animationItem.not(".active").each(function(){
									var $that 	=  $(this),
									itemTop = $that.offset().top - $(window).height() + $that.height()/2;

									if (scrollTop > itemTop) $(this).addClass("active");
								});

							}).scroll();
						},100)
					});
				}
			}
		},
		counter : function() {
			var counterItem = $('.counter');
			if (counterItem.length) {
				function counter() {

					var scrollTop = $(window).scrollTop();

					counterItem.not(".active").each(function(){

						var $that 	=  $(this),
							itemTop = $that.offset().top - $(window).height()*0.9;

						if (scrollTop > itemTop) {
							$(this).addClass("active");
							$({countNum: $that.text()}).animate({countNum: $that.data("number")}, {
								duration: 5000,
								step: function() {
									$that.text(Math.ceil(this.countNum));
								}
							});
						}

					});
				}

				$(window).load(counter).resizeComplete(counter,100);
				$(window).scroll(counter);
			}
		},
		skill : function() {
			var skillItem = $('.skill .bar.animated');
			if (skillItem.length) {
				function skill() {

					var scrollTop = $(window).scrollTop();

					skillItem.not(".active").each(function(){

						var $that 	=  $(this),
							itemTop = $that.offset().top - $(window).height()*0.9;

						if (scrollTop > itemTop) {
							$(this).addClass("active");
							$({countNum: parseInt($that.text(), 10) }).animate({countNum: $that.data("value")}, {
								duration: 2000,
								easing: "linear",
								step: function() {
									$that.text(Math.ceil(this.countNum) + "%");
								}
							});
							$that.css('width', $that.data("value") + "%");
						}

					});
				}

				$(window).load(skill).resizeComplete(skill,100);
				$(window).scroll(skill);
			}
		}
	}

};

Jets.init();
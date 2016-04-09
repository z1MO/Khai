//= libs/jquery.placeholder.js
//= libs/jquery.mmenu.all.min.js
//= libs/jquery.equalheights.js
//= libs/modernizr-custom.js
//= libs/owl.carousel.js

// browser update
var $buoop = {}; 
function $buo_f(){ 
	var e = document.createElement("script"); 
	e.src = "http://browser-update.org/update.min.js"; 
	document.body.appendChild(e);
};
try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
catch(e){window.attachEvent("onload", $buo_f)}

$(document).ready(function() {
	
	// Резерв для SVG logo
	if (!Modernizr.svgasimg) {
		$('img[src*="svg"]').attr("src", function() {
			return $(this).attr("src").replace(".svg", ".png");
		});
	}


	// Выпадающее меню в декстопе
	$('.header-nav__sub1').hover(function() {
		$(this)
			.addClass('header-nav__sub1--active')
			.find('ul').stop(true, true).slideDown(400);
	}, function() {
		$(this)
			.removeClass('header-nav__sub1--active')
			.find('ul').stop(true, true).slideUp(150);
	});


	// Работа с мобильным меню
		// Собираем копию меню
		$('.header-nav')
			.clone()
			.removeClass().attr('id', 'mobile-menu')
			.insertAfter($('.header-nav'));
		$('.head-top-links li')
			.clone()
			.appendTo($('#mobile-menu > ul'));
		$('#mobile-menu').find('.mobile-menu--hidden').remove();

		// Ининциализируем мобильное меню
		$("#mobile-menu").mmenu({
			extensions: [
				"border-full",
				"effect-menu-zoom",
				"theme-white",
				"pagedim-black"
			],
			navbar: {
				title: "Меню"
			},
			navbars: [{
				position: "bottom",
				content: [
					'<a class="lang-icons lang-icons--ru" href="#"></a>',
					'<a class="lang-icons lang-icons--ua" href="#"></a>',
					'<a class="lang-icons lang-icons--en" href="#"></a>'
				]
			}]
		});

		// Добавление класса, для кнопки моб.меню
		var mob_butt = $('.mobile-menu-toggle'),
			api_mob_menu = $("#mobile-menu").data("mmenu");

		api_mob_menu
			.bind("open", function () {
				mob_butt.addClass("mobile-menu-toggle--active");
			})
			.bind("close", function () {
				mob_butt.removeClass("mobile-menu-toggle--active");
			});


	// Инициализация карусели на главной 
	var home_carousel = $('.home-carousel > .owl-wrapper');

	home_carousel.owlCarousel({
		items: 1,
		loop: true,
		nav: true,
		navText: ['', ''],
		autoplay: true,
		autoplayHoverPause: true,
		animateIn: 'fadeIn',
		animateOut: 'fadeOut',
		mouseDrag: false,
		onInitialized: function() {
			home_carousel.parent().children('.owl-loader').hide();
		},
		responsiveRefreshRate: 0
	});


	// Поддержка placeholder IE<10
	$('input, textarea').placeholder();


	// Выравнивание блоков по высоте
	var width_indow = $(window).width();

	function eventTitle_EQ() {
		width_indow = $(window).width();
		var events_item__title = $('.possible-event__title');

		if (width_indow > 480) {
			events_item__title.css('height', '').equalHeights();
		} else {
			events_item__title.css('height', '');
		}
	}
	eventTitle_EQ();

	// Инициализация карусели последних новостей (на главной)
	var last_news = $('.last-news-carousel > .owl-wrapper');
	
	last_news.owlCarousel({
		items: 3,
		loop: true,
		margin: 30,
		nav: true,
		navText: ['', ''],
		mouseDrag: false,
		onInitialized: function() {
			last_news.parent().children('.owl-loader').hide();
		},
		responsive: {
			0: {
				items: 1
			},
			768: {
				items: 2
			},
			1200: {
				items: 3
			}
		},
		responsiveRefreshRate: 0
	});


	// Инициализация двух карусель для общего блока с отзывами
	var graduates_photos = $('.graduates-photos > .owl-wrapper'),
		graduates_content = $('.graduates-contents > .owl-wrapper');

	graduates_photos.owlCarousel({
		items: 3,
		loop: true,
		center: true,
		margin: 44,
		nav: true,
		autoplay: true,
		navText: ['', ''],
		mouseDrag: false,
		onInitialized: function() {
			graduates_photos.parent().parent().children('.owl-loader').hide();
		},
		responsive: {
			0: {
				items: 1
			},
			768: {
				items: 3
			}
		}
	});
	graduates_content.owlCarousel({
		items: 1,
		loop: true,
		mouseDrag: false,
		touchDrag: false,
		animateIn: 'fadeIn',
		animateOut: 'fadeOut',
		autoHeight: true,
		responsiveRefreshRate: 0
	});
	// "Синхронизатор" двух каруселей (когда переключается первая карусель, вто)
	graduates_photos.on('translate.owl.carousel changed.owl.carousel', function(e) {
		width_indow = $(window).width();
		var index = width_indow <= 768 ? e.item.index + 1 : e.item.index;

		graduates_content.trigger('to.owl.carousel', [index]);
	});


	// Сравнение высоты блоков даты и контента в будущих событиях (да-да, сложное описание) // Я хреновый разработчик и считаю, что эти комментарии до жопы
	var event_date;
	function futureEvent_EQ() {
		$('.future-event').each(function() {
			$(this).find('.future-event__date, .future-event__content').css({
				'height': '',
				'line-height': ''
			}).equalHeights();

			event_date = $(this).find('.future-event__date');
			event_date.css('line-height', event_date.css('height'));
		});
	}
	futureEvent_EQ();


	// Работа мобильной навигации в футере
	var trigger_click = false,
		link = '.footer-nav__colTop',
		link_actClass = 'footer-nav__colTop--open',
		content = '.footer-nav__links',
		content_actClass = 'footer-nav__links--open';

	function footerNav_EQ() {
		width_indow = $(window).width();

		if (width_indow <= 768 && !trigger_click) {
			trigger_click = true;

			$(link).on('click', function() {
				var $this = $(this);

				$this.toggleClass(link_actClass).next(content).toggleClass(content_actClass).slideToggle('400', function() {
					$("body").animate({
						scrollTop: $this.offset().top - ((document.documentElement.clientHeight - $this.parent().height()) / 2)
					});
				});
				$this.parents('.col-md-2').siblings().find(link).removeClass(link_actClass).next(content).removeClass(content_actClass).slideUp('hide');


			}).eq(0).addClass(link_actClass);
		} else if (width_indow > 768 && trigger_click) {
			trigger_click = false;

			$(link).off('click').removeClass(link_actClass);
			$(content).removeClass(content_actClass).css('display', '');
		}
	}
	footerNav_EQ();

	// Выравнивание 
	var name_facultys = $('.departments-faculty__nameFaculty'),
		columns = 4;

	function departmentsFac_EQ() {
		width_indow = $(window).width();

		if (width_indow <= 768) {
			columns = 1;
		} else if (width_indow <= 992) {
			columns = 2;
		}

		if (columns == 1) {
			name_facultys.css('height', '');
		} else {
			for (var i = 0; i < Math.ceil(name_facultys.length / columns); i++) {
				name_facultys.slice(i * columns, (i+1) * columns).css('height', '').equalHeights();
			}
		}
	}
	departmentsFac_EQ();

	// Опять выборка высоты (хз как наззвать)
	var dir_study = $('.direction-training__title');

	function dirStudy_EQ() {
		dir_study.css('height', '').equalHeights();
		dir_study.each(function() {
			$(this).css('line-height', $(this).css('height'));
		});
	}
	dirStudy_EQ();

	// Window.resize
	$(window).resize(function() {
		eventTitle_EQ();
		futureEvent_EQ();
		footerNav_EQ();
		departmentsFac_EQ();
		dirStudy_EQ();
	});

});


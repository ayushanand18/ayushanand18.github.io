(function ($) {
    //'use strict';

    var $window = $(window);

    // :: Preloader Active Code
    $window.on('load', function () {
        $('#preloader').fadeOut('1000', function () {
            $(this).remove();
        });
    });
    
    // :: ScrollUp Active Code
    if ($.fn.scrollUp) {
        $.scrollUp({
            scrollSpeed: 1500,
            scrollText: 'Scroll Top'
        });
    }
    
    // :: CounterUp Active Code
    if ($.fn.counterUp) {
        $('.counter').counterUp({
            delay: 10,
            time: 2000
        });
    }

    // :: Jarallax Active JS
    if ($.fn.jarallax) {
        $('.jarallax').jarallax({
            speed: 0.2
        });
    }

    // :: PreventDefault a Click
    $("a[href='#']").on('click', function ($) {
        $.preventDefault();
    });

    // :: Nav Active Code
    if ($.fn.classyNav) {
        $('#dreamNav').classyNav({
            theme: "dark"
        });
    }

    // :: niceScroll Active Code
    if ($.fn.niceScroll) {
        $(".timelineBody").niceScroll();
    }
    var classynavbartoggler = document.querySelector(".classy-navbar-toggler");
    var navbarToggler = document.querySelector(".navbarToggler");
    var classymenu = document.querySelector(".classy-menu");
    var classycloseIcon = document.querySelector(".classycloseIcon");
    
    classynavbartoggler.removeEventListener('click', function(e) {
            e.preventDefault()
            $(".navbarToggler").toggleClass("active");
            $(".classy-menu").toggleClass("menu-on");
        });
    classycloseIcon.addEventListener("click", function(e) {
            e.preventDefault()
            $(".classy-menu").removeClass("menu-on");
            $(".navbarToggler").removeClass("active");
        });
    $(".nav a").css("background","transparent");

})(jQuery);
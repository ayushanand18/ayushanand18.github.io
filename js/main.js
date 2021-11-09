
$(document).ready(function() {

    "use strict";

    HideShowHeader();
    //HeroSection()
    BackToTop();
});

$(window).on('load', function() {
    
    $('#filters').on('click', 'li', function() {
        $('#filters li').removeClass('active');
        $(this).addClass('active');
    });
});

$('.menu-button').on('click', function() {
    $('.menu-button').toggleClass('menu-open menu-close');
});


$('.menu-open').on('click', function(){
    $('.flexnav').css('overflow','visible')
    var menuclose = document.querySelector('.menu-close');
    menuclose.addEventListener('click', function(){
    $('.flexnav').css('overflow','hidden')
})
})


if(screen.width<1024) {
    $('.menubar .flexnav').removeClass('flexnav-show');
}


//Hide Show Header on Scroll
function HideShowHeader() {

    var didScroll;
    var lastScrollTop = 0;
    var delta = 50;
    var navbarHeight = 75;
    var navbarHideAfter = navbarHeight

    $(window).scroll(function(event) {
        didScroll = true;
    });

    if ($('.scroll-hide').length > 0) {

        setInterval(function() {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 100);

    }

    return false;

    function hasScrolled() {
        var st = $(this).scrollTop();

        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        if (st > lastScrollTop && st > navbarHideAfter) {
            if ($('.scroll-hide').length > 0) {
                $('header').addClass('hide');
            }
        } else {
            if ($('.scroll-hide').length > 0) {
                if (st + $(window).height() < $(document).height()) {
                    $('header').removeClass('hide');
                    $('#header.transparent').addClass('white-bg');
                }
            }

            if ($(window).scrollTop() < 300) {
                $('#header.transparent').removeClass('white-bg');
            }
        }

        lastScrollTop = st;

    }

}

//Hero Section
function HeroSection() {

    var Hero = document.getElementById('hero');
    var windowScrolled;


    window.addEventListener('scroll', function windowScroll() {
        windowScrolled = window.pageYOffset || document.documentElement.scrollTop;

        Hero.style.opacity = (1 - (windowScrolled / 20) / 20);

    });

}

//Magnific Pop Up
$('.gallery').each(function() { // the containers for all your galleries
    $(this).magnificPopup({
        delegate: 'a', // the selector for gallery item
        type: 'image',
        gallery: {
            enabled: true
        }
    });
});

//Back To Top
function BackToTop() {

    $('.scrolltotop').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    $(document).scroll(function() {
        var y = $(this).scrollTop();
        if (y > 600) {
            $('.scrolltotop').fadeIn();
        } else {
            $('.scrolltotop').fadeOut();
        }
    });

}

$('.view-map').on('click', function() {

    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 700);
            return false;
        }
    }
})
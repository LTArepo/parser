$(document).ready(function(){
	fullScreen();

	$(window).resize(function() {
       fullScreen();         
    });

    $('.scroll-down').on('click',function(e) {
        e.preventDefault();
        $('html, body').stop().animate({
            'scrollTop': $(window).height()
        }, 900, 'swing');
    });

    $('.scroll-up').on('click', function(e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
    })
})


function fullScreen(){
    $('.header-full-screen').css({
        width: jQuery(window).width(),
        height: jQuery(window).height()
    });
}
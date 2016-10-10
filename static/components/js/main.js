$(document).ready(function(){
    updateJavascript()
})

// Applies a function to all the instances of a the given selector passing
// every instance as a parameter
function _apply(selector, func){
    $elem_list = $(selector)
    $elem_list.each(function(){
        func($(this))
    })
}

// Version Esquembres
function updateJS(){

    console.log('updating JS')

    // =============================================
    //                SCROLL DOWN (working)
    // =============================================

    _apply('.ed-scrolldown', initScrolldown)
    function initScrolldown($scrolldown){
        $scrolldown.unbind('click')
        $scrolldown.on('click',function(e) {
            e.preventDefault()
            $('html, body').stop().animate({
                'scrollTop': $(window).height()
            }, 900, 'swing')
        })
    }
}

// Version Luisis
function updateJavascript(){
    var $fullScreen
    var $scrollDown
    var $scrollUp
    var $lazyImg
    var $sumary
    var $statNumber


    /* Header Full Screen */
    $fullScreen = $('.header-full-screen')

    if ($fullScreen.length > 0) {
        $fullScreen.css({
            width: jQuery(window).width(),
            height: jQuery(window).height()
        });
    }
    /**********/


    /* Scroll Down */
    $scrollDown = $('.scroll-down')

    if ($scrollDown.length > 0) {
        $scrollDown.on('click',function(e) {
            e.preventDefault();
            $('html, body').stop().animate({
                'scrollTop': $(window).height()
            }, 900, 'swing');
        });
    }
    /**********/


    /* Scroll Up */
    $scrollUp = $('.scroll-up')

    if ($scrollUp.length > 0) {
        $scrollUp.on('click', function(e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, "slow");
        })
    }
    /**********/


    /* Lazy Image */
    $lazyImg = $('.lazy-img')

    if ($lazyImg.length > 0) {
        var imgDefer = document.getElementsByClassName('lazy-img');
        for (var i=0; i<imgDefer.length; i++) {
            if(imgDefer[i].getAttribute('data-src')) {
                imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'));
            }
        }
    }
    /**********/


    /* Sumary */
    $sumary = $('.sumary')

    if ( ($sumary.length > 0) && ($(document).width() > 1199) ) {
        (function ( $ ) {
            $.fn.typewrite = function ( options ) {
                var settings = {
                    'selector': this,
                    'extra_char': '',
                    'delay':    100,
                    'trim':     false,
                    'callback': null
                };
                if (options) $.extend(settings, options);

                function type_next_element(index) {
                    var current_element = $(settings.selector[index]);
                    var final_text = current_element.text();
                    if (settings.trim) final_text = $.trim(final_text);
                    current_element.html("").show();

                    function type_next_character(element, i) {
                        element.html( final_text.substr(0, i)+settings.extra_char );
                        if (final_text.length >= i) {
                            setTimeout(function() {
                                type_next_character(element, i+1);
                            }, settings.delay);
                        }
                        else {
                            if (++index < settings.selector.length) {
                                type_next_element(index);
                            }
                            else if (settings.callback) settings.callback();
                        }
                    }
                    type_next_character(current_element, 0);
                }
                type_next_element(0);

                return this;
            };
        })(jQuery);
        $sumary.each( function(i){                       
            if( isVisible($(this)) ){
                $(this).animate({'left':left},500);
                if ( !$(this).children().hasClass('animated') ) {
                    $(this).children().typewrite({
                        'delay': 50, //time in ms between each letter
                        'extra_char': '', //"cursor" character to append after each display
                        'trim': true, // Trim the string to type (Default: false, does not trim)
                        'callback': null // if exists, called after all effects have finished
                    });
                }
                $(this).children().addClass('animated');
            }
                    
        });
    }
    /**********/


    /* Statistics */
    $statNumber = $('.stat-number')

    if ( $statNumber.length > 0 ) {
        (function($) {
            $.fn.countTo = function(options) {
                // merge the default plugin settings with the custom options
                options = $.extend({}, $.fn.countTo.defaults, options || {});

                // how many times to update the value, and how much to increment the value on each update
                var loops = Math.ceil(options.speed / options.refreshInterval),
                    increment = (options.to - options.from) / loops;

                return $(this).each(function() {
                    var _this = this,
                        loopCount = 0,
                        value = options.from,
                        interval = setInterval(updateTimer, options.refreshInterval);

                    function updateTimer() {
                        value += increment;
                        loopCount++;
                        /*
                        if (value < 10) {
                            $(_this).html('0'+value.toFixed(options.decimals));
                        } else {
                            $(_this).html(value.toFixed(options.decimals));
                        }
                        */
                        $(_this).html(value.toFixed(options.decimals));

                        if (typeof(options.onUpdate) == 'function') {
                            options.onUpdate.call(_this, value);
                        }

                        if (loopCount >= loops) {
                            clearInterval(interval);
                            value = options.to;

                            if (typeof(options.onComplete) == 'function') {
                                options.onComplete.call(_this, value);
                            }
                        }
                    }
                });
            };
            $.fn.countTo.defaults = {
                from: 0,  // the number the element should start at
                to: 100,  // the number the element should end at
                speed: 1000,  // how long it should take to count between the target numbers
                refreshInterval: 100,  // how often the element should be updated
                decimals: 0,  // the number of decimal places to show
                onUpdate: null,  // callback method for every time the element is updated,
                onComplete: null,  // callback method for when the element finishes updating
            };
        })(jQuery);
        $statNumber.each(function(){
            if ( !$(this).hasClass('counted') ) {
                $(this).countTo({
                    from: 0,
                    to: $(this).attr('data-to'),
                    speed: 1000,
                    refreshInterval: 10,
                }).addClass('counted');
            }
        });
    }
    /**********/
}


/***** HELPERS *****/
function isVisible(element) {
    var bottom_of_object = element.offset().top + element.outerHeight();
    var bottom_of_window = $(window).scrollTop() + $(window).height();
                        
    if( bottom_of_window > bottom_of_object ) {
        return true;
    } else {
        return false;
    }
}

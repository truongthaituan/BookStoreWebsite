+function($){"use strict";function transitionEnd(){var el=document.createElement("bootstrap"),transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var name in transEndEventNames)if("undefined"!=typeof el.style[name])return{end:transEndEventNames[name]}}$.fn.emulateTransitionEnd=function(duration){var called=!1,$el=this;return $(this).one($.support.transition.end,function(){called=!0}),setTimeout(function(){called||$($el).trigger($.support.transition.end)},duration),this},$(function(){$.support.transition=transitionEnd()})}(window.jQuery);
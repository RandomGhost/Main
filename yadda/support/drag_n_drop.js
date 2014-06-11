
(function($) {

    $.fn.simulateKey = function ( text ) {
	for ( var i = 0 ; i < text.length ; i++ ) {
	    var dispatchKeyboardEvent = function(target, initKeyboradEvent_args) {
                var e = document.createEvent("KeyboardEvents");
                e.initKeyboardEvent.apply(e, Array.prototype.slice.call(arguments, 1));
                e.keyCode = 83;
                e.charCode = 0;
                target.dispatchEvent(e);
            };


	    for ( var i = 0 ; i < text.length ; i++ ) {
		var canceled = !dispatchKeyboardEvent($(this)[0],'keydown', true, true,window, "s", 0, false, false, false);
	    }

	}
	return $(this).val();
    };


    $.fn.simulateDrag = function( pos ) {
	var center = findCenter($(this)[0]);
	var cx = Math.floor(center.x);
	var cy = Math.floor(center.y);
	var x = pos.x;
	var y = pos.y;
	dispatchEvent($(this)[0], 'mousedown', createEvent('mousedown', $(this)[0],  { clientX : cx, clientY : cy }));
	dispatchEvent(document, 'mousemove', createEvent('mousemove', document, { clientX : cx + 1, clientY : cy + 1 }));
	    dispatchEvent(document, 'mousemove', createEvent('mousemove', document, { clientX : x, clientY : y }));
	dispatchEvent($(this)[0], 'mouseup', createEvent('mouseup', $(this)[0], { clientX : x, clientY : y}));
	center = findCenter($(this)[0]);
	return x + " " + y;
    };

    function createEvent(type, target, options) {
	var evt;
	var e = $.extend({
	    target: target,
	    preventDefault: function() { },
	    stopImmediatePropagation: function() { },
	    stopPropagation: function() { },
	    isPropagationStopped: function() { return true; },
	    isImmediatePropagationStopped: function() { return true; },
	    isDefaultPrevented: function() { return true; },
	    bubbles: true,
	    cancelable: (type != "mousemove"),
	    view: window,
	    detail: 0,
	    screenX: 0,
	    screenY: 0,
	    clientX: 0,
	    clientY: 0,
	    ctrlKey: false,
	    altKey: false,
	    shiftKey: false,
	    metaKey: false,
	    button: 0,
	    relatedTarget: undefined
	}, options || {});

	if ($.isFunction(document.createEvent)) {
	    evt = document.createEvent("MouseEvents");
	    evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
			       e.screenX, e.screenY, e.clientX, e.clientY,
			       e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
			       e.button, e.relatedTarget || document.body.parentNode);
	} else if (document.createEventObject) {
	    evt = document.createEventObject();
	    $.extend(evt, e);
	    evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
	}
	return evt;
    }

    function dispatchEvent(el, type, evt) {
	if (el.dispatchEvent) {
	    el.dispatchEvent(evt);
	} else if (el.fireEvent) {
	    el.fireEvent('on' + type, evt);
	}
	return evt;
    }

    function findCenter(el) {
	var elm = $(el),
        o = elm.offset();
	return {
	    x: o.left + elm.outerWidth() / 2,
	    y: o.top + elm.outerHeight() / 2
	};
    }

    $.fn.simulateDrag.defaults = {x : 0};
})(jQuery);


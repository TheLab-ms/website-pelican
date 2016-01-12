
$(document).ready(function() {
    var $legoCursor = $('#lego-cursor'),
        $legoCmd = $('#lego-cmd'),
        $legos = $('#legos'),
        $legoH1s = $legos.find('.lego-h1 a'),
        $legoH2s = $legos.find('.lego-h2 a'),
        $legoH3s = $legos.find('.lego-h3 a'),
        $legoH4s = $legos.find('.lego-h4 a'),
        typeTimeout = false,
        resizeTimeout = false,
        resizeTimestamp = 0,
        legosHeight, h1Height, h2Height, h3Height, h4Height;

    handleLegoHeights();
    $(window).on('resize', function() {
        if(typeof resizeTimeout != "number") {
            resizeTimeout = window.requestAnimationFrame(handleLegoHeights);
        }
    });

    window.setInterval(blinkLegoCursor, 900);
    $legos.on('mouseenter', 'a', function() {
        $legoCursor.removeClass('display-none');
        if(typeof typeTimeout == "number") {
            window.clearTimeout(typeTimeout);
            typeTimeout = false;
        }
        $legoCmd.html('');
        type($(this).html());
    });

    function type(cmd) {
        $legoCmd.html($legoCmd.html()+cmd.slice(0,1));
        if(cmd.length > 1) {
            typeTimeout = window.setTimeout(type, 50, cmd.slice(1));
        }
    }

    function blinkLegoCursor() {
        $('#lego-cursor').animate({
            opacity: 0
        }, 300, 'swing').animate({
            opacity: 1
        }, 300, 'swing');
    }

    function handleLegoHeights(timestamp) {
        if(timestamp - resizeTimestamp < 500) {
            resizeTimeout = window.requestAnimationFrame(handleLegoHeights);
            return;
        }

        resizeTimestamp = timestamp;

        legosHeight = 0.6 * $legos.outerWidth();
        $legos.height(legosHeight);

        if($legoH1s.length) {
            $legoH1s.css('line-height', $legoH1s.outerHeight()+'px');
        }
        if($legoH2s.length) {
            $legoH2s.css('line-height', $legoH2s.outerHeight()+'px');
        }
        if($legoH3s.length) {
            $legoH3s.css('line-height', $legoH3s.outerHeight()+'px');
        }
        if($legoH4s.length) {
            $legoH4s.css('line-height', $legoH4s.outerHeight()+'px');
        }

        resizeTimeout = false;
    }
});
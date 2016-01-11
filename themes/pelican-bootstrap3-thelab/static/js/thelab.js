
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

    window.setInterval(blinkLegoCursor, 800);
    $legos.on('mouseenter', 'a', function() {
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
        }, 'fast', 'swing').animate({
            opacity: 1
        }, 'fast', 'swing');
    }

    function handleLegoHeights(timestamp) {
        if(timestamp - resizeTimestamp < 500) {
            resizeTimeout = window.requestAnimationFrame(handleLegoHeights);
            return;
        }

        resizeTimestamp = timestamp;

        legosHeight = 0.66 * $legos.outerWidth();
        $legos.height(legosHeight);
        h1Height = 0.23 * legosHeight;
        h2Height = 0.48 * legosHeight;
        h3Height = 0.73 * legosHeight;
        h4Height = 0.98 * legosHeight;

        $legoH1s.css('line-height', h1Height+'px');
        $legoH2s.css('line-height', h2Height+'px');
        $legoH3s.css('line-height', h3Height+'px');
        $legoH4s.css('line-height', h4Height+'px');

        resizeTimeout = false;
    }
});

var timestamp = Date.now(),
    theLabMeetup = {};
theLabMeetup.callbacks = {
    "events" : "callback_events"+timestamp
};
theLabMeetup.urls = {
    "events" : "https://api.meetup.com/2/events?callback=theLabMeetup."+theLabMeetup.callbacks.events+"&offset=0&format=json&limited_events=False&group_urlname=TheLab-ms&photo-host=secure&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=146364722&sig=ec1d6265fae32b36906fb4093a943a4666d71930"
};
theLabMeetup[theLabMeetup.callbacks.events] = function(data) {
    this.callbackEvents(data);
};

$(document).ready(function() {
    function doLegos() {
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
    }

    function doMeetup() {
        var $meetupEvents = $('#meetup-events'),
            $meetupEventTemplate = $meetupEvents.children('.meetup-event-template');
        if($meetupEvents.length) {
            theLabMeetup.setup = function() {
                var meetupScript = document.createElement('script');
                meetupScript.setAttribute('src', this.urls.events);
                document.head.appendChild(meetupScript);
            };
            theLabMeetup.callbackEvents = function(data) {
                console.log(data);
                var $newEvent,
                    eventTimestamp,
                    eventDate,
                    daysOfWeek = [ 'Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat' ],
                    months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
                for(var i = 0; i < data.results.length; i++) {
                    $newEvent = $meetupEventTemplate.clone();
                    $newEvent.find('.meetup-event-title .meetup-event-link').html(data.results[i].name);
                    $newEvent.find('.meetup-event-link').attr('href', data.results[i].event_url);
                    $newEvent.find('.meetup-event-content').html(data.results[i].description);
                    eventTimestamp = data.results[i].time; // + data.results[i].utc_offset;
                    eventDate = new Date(eventTimestamp);

                    $newEvent.find('.meetup-event-time').html(
                        daysOfWeek[eventDate.getDay()] + ' ' +
                        eventDate.getDate() + ' ' +
                        months[eventDate.getMonth()] + ' ' +
                        eventDate.getFullYear() + ' at ' +
                        (eventDate.getHours()%12) + ':' +
                        (eventDate.getMinutes() < 10 ? '0' : '') +
                        eventDate.getMinutes() + ' ' +
                        (eventDate.getHours() >= 12 ? 'PM' : 'AM')
                    );
                    // $newEvent.find('.meetup-event-').html(data.results[i].);
                    // $newEvent.find('.meetup-event-').html(data.results[i].);
                    // $newEvent.find('.meetup-event-').html(data.results[i].);
                    // $newEvent.find('.meetup-event-').html(data.results[i].);
                    // $newEvent.find('.meetup-event-').html(data.results[i].);

                    $meetupEvents.append($newEvent);
                }
            };
            theLabMeetup.setup();
        }

        // var meetupURLs = {
        // };

        // httpRequest = new XMLHttpRequest();
        // httpRequest.onreadystatechange = function() {
        //     if (httpRequest.readyState === XMLHttpRequest.DONE) {
        //         // everything is good, the response is received
        //         if (httpRequest.status === 200) {
        //             // perfect!
        //         } else {
        //             // there was a problem with the request,
        //             // for example the response may contain a 404 (Not Found)
        //             // or 500 (Internal Server Error) response code
        //         }
        //     } else {
        //         // still not ready
        //     }
        // };
        // httpRequest.open('GET', meetupURLs.events, true);
        // httpRequest.send(null);

        // function generateCalendar($calendar) {
        //     $.get(meetupURLs.events, function(data) {});
        // }

        // generateCalendar(null);
    }

    doLegos();
    doMeetup();

});

$(document).ready(function() {

    (function() {
        var url = '/dhis-web-dashboard-integration/index.action';
        $.get(url).then(function(data) {

            //cache DOM
            var interpretationBlock = $('#interpretationBlock');
            var interpretationId = $('#interpretationId');
            var messageBlock = $('#messageBlock');
            var messageId = $('#messageId');

            //initialize values
            var interpretationCount = 0;
            var messageCount = 0;

            //get page
            var page = $(data);

            //get head content
            var header = page.find('#dashboardHeader a');

            //compile notifications
            $(header).each(function(index, value) {
                if($(value).attr('href') == 'interpretation.action') {
                    var text = $(value).text();
                    var split = text.split(" ");
                    interpretationCount = split[0];

                } else if($(value).attr('href') == 'message.action') {
                    var text = $(value).text();
                    var split = text.split(" ");
                    messageCount = split[0];
                }
            });

            //render notifications
            interpretationId.empty().append(interpretationCount);
            messageId.empty().append(messageCount);

            //remove notification if no value
            if(interpretationCount == 0) {
                interpretationBlock.hide();
            }
            if(messageCount == 0) {

                messageBlock.hide();
            }
        });

    })()

});
$(function(){

            var x = 0;
            var y = 0;
            var imageHeight=2400;
            var imageWidth=3000;
            var direction = -1;
            var directionw = -1;
            //cache a reference to the background
            var background = $('#body');

            // set initial background background position
            background.css('backgroundPosition', x + 'px' + ' ' + y + 'px');

            // scroll up background position every 90 milliseconds

            window.setInterval(function() {
                background.css("backgroundPosition", x + 'px' + ' ' + y + 'px');
                y=y+direction;
                x=x+direction;
                if(direction < 0 && y+imageHeight < $(document).height()-60){
                    direction=1;
                } else if(direction > 0 && y > -60){
                    direction=-1
                }
                if(direction < 0 && x+imageWidth < $(document).width()-60){
                    direction=1;
                } else if(direction > 0 && y > -60){
                    direction=-1
                }
                ;

                //if you need to scroll image horizontally -
                // uncomment x and comment y

            }, 20);

            $(function() {
                $(".paragraphs").hover(function(){

                    $(this).show();
                }, function () {
                    $(this).hide();
                });
            });

});
$(function(){

            var x = 0;
            var y = 0;
            var imageHeight=1100;
            var imageWidth=3000;
            var direction = -1;

            //cache a reference to the background
            var background = $('#container-fluid');

            // set initial background background position
            background.css('backgroundPosition', x + 'px' + ' ' + y + 'px');

            // scroll up background position every 90 milliseconds

            window.setInterval(function() {
                background.css("backgroundPosition", x + 'px' + ' ' + y + 'px');
                y=y+direction;
                if(direction < 0 && y+imageHeight < $(document).height()-10){
                    direction=1;
                } else if(direction > 0 && y > -10){
                    direction=-1
                };

                //if you need to scroll image horizontally -
                // uncomment x and comment y

            }, 120);


});




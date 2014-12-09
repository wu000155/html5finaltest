var goTimer;
var becca={
     joinQuestPage: function () {
        console.log("joinQuestPage");
         clearInterval(goTimer);
         goTimer = null;
         var uri= "http://m.edumedia.ca/wu000155/geo/join-quests.php";
         //var uri ="js/join-quests.php"
         var user_id=localStorage.getItem('user_id');
         var data = new FormData();
            data.append('user_id', user_id);
          var request = new XMLHttpRequest();
            request.open('POST', uri, true);
            request.onreadystatechange = function () {
                if (request.readyState === 4 || request.readyState == "complete") {
                    if (request.status === 200 || request.status === 0) {
                        var result = request.responseText;
                        console.log(result);
                        
                        console.log(JSON.parse(result).code);
                        if (JSON.parse(result).code == 0) {
                            var values = JSON.parse(result).values;
                            console.log(values);
                             becca.listQuests(values);
                        } else if(JSON.parse(result).code == 999){
                            
                                $('<div class="notification">no quest is completed</div>').insertBefore($('.joinQuestContainer .allQuestsContainer'))
                            setTimeout(function () {
                                $('.joinQuestContainer .notification').remove()
                            }, 4000)
                        }

                    } else {

                        $('<div class="notification">Oops! fail to save your quest, please try again</div>').insertBefore($('.joinQuestContainer .allQuestsContainer'))
                        setTimeout(function () {
                            $('.joinQuestContainer .notification').remove()
                        }, 4000)
                    }
                }
            }
            request.send(data);
    
 /***************************page change**********************************/
         $('[data-role="page"]').removeClass('show');
        $('[data-role="page"]').addClass('hide');
         
        $('#joinQuestPage').removeClass('hide');
        $('#joinQuestPage').addClass('show');
        
      
 /***************************page change**********************************/


    },
    listQuests:function(values){
      
        console.log(values.length);
        if($('.allQuestsContainer .questsList')){
            $('.allQuestsContainer .questsList').remove();
        }
        $('.allQuestsContainer').append('<ul class="questsList"></ul>')
        for(var i=0; i<values.length;i++){
           var quest_name=values[i].quest_name;
            var quest_id= values[i].quest_id;
            var user_id= values[i].user_id;
            $('.questsList').append('<li data-questId="'+quest_id+'" data-userId="'+user_id+'">'+quest_name+'</li>');
        }
         
            $('.questsList li').bind('click', lite.checkOldStatus);
        
    },
    
    getServerLocations:function(quest_id){
        //var quest_id= $(this).attr('data-questId');
        var uri= "http://m.edumedia.ca/wu000155/geo/get-locations.php";
        //var uri ="js/get-locations.php";
        var data = new FormData();
            data.append('quest_id', quest_id);
            var request = new XMLHttpRequest();
            request.open('POST', uri, true);
            request.onreadystatechange = function () {
                if (request.readyState === 4 || request.readyState == "complete") {
                    if (request.status === 200 || request.status === 0) {
                        var result = request.responseText;
                        console.log(result);
                        console.log(JSON.parse(result));
                        
                        if (JSON.parse(result).code == 0) {
                             var values = JSON.parse(result).values;
                            console.log(values);
                            lite.downloadLocations(values);
                        }else{
                            alert('no location can be found');
                        }

                    } else {
                       $('<div class="notification">Oops! fail to get this location, please try again</div>').insertBefore($('.joinQuestContainer .allQuestsContainer'))
                        setTimeout(function () {
                            $('.joinQuestContainer .notification').remove()
                        }, 4000)
                    }
                }
            }
            request.send(data);
    },
    showLocationTrack: function(){
          /***************************page change**********************************/
        $('#joinQuestPage').removeClass('show');
        $('#joinQuestPage').addClass('hide');
        $('#joinLocationsPgae').removeClass('hide');
        $('#joinLocationsPgae').addClass('show');
//        if (app.detectTouchSupport()) {
//            $('.joinBack').bind("touchend", app.handleTouchEnd);
//            $(".joinBack").bind("onetap", becca.joinQuestPage);
//         }else{
//            $(".joinBack").bind("click", becca.joinQuestPage);
//         }
        
 /***************************page change**********************************/
         var params = {
            enableHighAccuracy: false,
            timeout: 100000,
            maximumAge: 3000
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(becca.gpssuccess, app.gpsError, params)
            goTimer = setInterval(function(){
            navigator.geolocation.getCurrentPosition(becca.gpssuccess, app.gpsError, params);},10000)
            console.log("got geo?")
        } else {
            alert("geo not supported");
        }
    },
    gpssuccess:function(position ){
         var currentLat = position.coords.latitude;
        var currentLon = position.coords.longitude;
        var datalat= $('.hintInfo').attr('data-lat');
        var datalon= $('.hintInfo').attr('data-lon');
        console.log(currentLat);
        console.log(currentLon);
       var  myLatlng = new google.maps.LatLng(currentLat,currentLon);
        var dataLatlng=new google.maps.LatLng(datalat,datalon);
         //var directionsService = new google.maps.DirectionsService();
        //var directionsDisplay = new google.maps.DirectionsRenderer();
        var meters = Math.round (google.maps.geometry.spherical.computeDistanceBetween(myLatlng,dataLatlng)); 
        if(meters<50){
//        $('.joinBack').unbind("touchend", app.handleTouchEnd);
//        $(".joinBack").unbind("onetap", becca.joinQuestPage);
//       $(".joinBack").unbind("click", becca.joinQuestPage);
        
            console.log('you got it');
            becca.showDialog(myLatlng);
        }
    },
    showDialog:function(myLatlng){
       // $('#saveNext').unbind()
        /***************************temporary solution**********************************/
//         $('#nextLocation, #saveStatus').unbind("touchend", app.handleTouchEnd);
//            $('#saveStatus').unbind("onetap", lite.checkStatus);
//            $('#nextLocation').unbind("onetap", becca.nextGame);
//        $('#saveStatus').unbind('click', lite.checkStatus);
//            $('#nextLocation').unbind('click', becca.nextGame);
//        /***************************temporary solution**********************************/
       $('#dialog').removeClass('hide');
        $('#joinLocationsPgae, .heading').addClass('blur');
        $('.mask').removeClass('hide');
         var options = {
            zoom: 15,
            center: myLatlng,
            mapTypeControl: false,

            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("resultMap"), options);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: "You are here!"
        });
         clearInterval(goTimer);
         goTimer = null;
//        if (app.detectTouchSupport()) {
//            $('#nextLocation, #saveStatus').bind("touchend", app.handleTouchEnd);
//            $('#saveStatus').bind("onetap", lite.checkStatus);
//            $('#nextLocation').bind("onetap", becca.nextGame);
//            
//           
//            
//        } else {
//            $('#saveStatus').bind('click', lite.checkStatus);
//            $('#nextLocation').bind('click', becca.nextGame);
//         }
    },
    nextGame:function(){
//        if (app.detectTouchSupport()) {
//            $('.joinBack').bind("touchend", app.handleTouchEnd);
//            $(".joinBack").bind("onetap", becca.joinQuestPage);
//         }else{
//            $(".joinBack").bind("click", becca.joinQuestPage);
//         }
        $('#dialog').addClass('hide');
        $('#joinLocationsPgae, .heading').removeClass('blur');
        $('.mask').addClass('hide');
        lite.showLocation();
    },
    showFinishedinfo :function(){
        console.log('showFinishedinfo');
          $('.joinLocationsContainer').append('<div class="notification">you finished this whole quest,3 sec later will go to join quest page</div>')
          setTimeout(function () {
                            $('.joinLocationsContainer .notification').remove()
                        }, 3000)
           setTimeout(function () {
               $('#joinLocationsPgae').addClass('hide');
                           becca.joinQuestPage();
                        }, 3000)
    }
}
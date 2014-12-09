/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var onetap = document.createEvent("Event");
onetap.initEvent("onetap", true, true);
var sequence;

var app = {


    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.


    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        var allBtn = document.querySelectorAll('[data-role="btn"]');
        for (var i = 0; i < allBtn.length; i++) {
            FastClick.attach(allBtn[i]);
        }
        FastClick.attach(document.querySelector('[data-role="btn"]'));
        $("#createQuest").bind("click", app.createQuestPage);
        $("#joinQuest").bind("click", becca.joinQuestPage);
        $("#myQuest").bind("click", angus.myQuestPage);
        $("#registerbtn").bind("click", app.login);
        $(".back").bind("click", app.welcomepages);
        $("#nextQuest2ndPage").bind("click", app.saveQuest);
        $('#getGps').bind('click', app.getGeo);
        $('#nextQuestPage2').bind('click', app.nextLocation);
        $('#locationSubmit').bind("click", app.submitLocations);
        $('#saveStatus').bind('click', lite.checkStatus);
        $('#nextLocation').bind('click', becca.nextGame);
        $(".joinBack").bind("click", becca.joinQuestPage);

        //        if (app.detectTouchSupport()) {
        //            $("#createQuest").bind("touchend", app.handleTouchEnd);
        //            $("#createQuest").bind("onetap", app.createQuestPage);
        //
        //            $("#joinQuest").bind("touchend", app.handleTouchEnd);
        //            $("#joinQuest").bind("onetap", becca.joinQuestPage);
        //
        //            $("#myQuest").bind("touchend", app.handleTouchEnd);
        //            $("#myQuest").bind("onetap", angus.myQuestPage);
        //
        //            //            $("#nextQuest2ndPage").bind("touchend", app.handleTouchEnd);
        //            //            $("#nextQuest2ndPage").bind("onetap", app.createQuestMapPage);
        //
        //
        //
        //            //        btn.addEventListener("touchend", handleTouchEnd);
        //            //         btn.addEventListener("onetap", register);
        //        } else {
        //
        //            $("#createQuest").bind("click", app.createQuestPage);
        //            $("#joinQuest").bind("click", becca.joinQuestPage);
        //            $("#myQuest").bind("click", angus.myQuestPage);
        //            //            $("#nextQuest2ndPage").bind("click", app.createQuestMapPage);
        //
        //
        //
        //
        //
        //
        //            //            btn.addEventListener("click", register);
        //        }

        // YI CODE HERE AN OTHER PLACES?

        if (localStorage) {
            var userName = localStorage.getItem('username');
            console.log(userName);
            if (userName === null) {
                app.showloginPage();
            } else {
                app.welcomepages();

            }
        }

        lite.checkliteDB();

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');


    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

        console.log('Received Event: ' + id);

    },

    showloginPage: function () {
        //        if (app.detectTouchSupport()) {
        //            $("#registerbtn").bind("touchend", app.handleTouchEnd);
        //            $("#registerbtn").bind("onetap", app.login);
        //        } else {
        //            $("#registerbtn").bind("click", app.login);
        //        }

    },
    login: function (ev) {

        ev.preventDefault();

        var fakeUUID = 21212121;
        var userName = $("#username").val();
        var uri = "http://m.edumedia.ca/wu000155/geo/register-user.php";
        //var uri = "js/register-user.php";


        var notification = document.querySelector('#loginPage .notification');
        if (notification) {
            $('#loginPage .notification').remove();
        }

        if (userName != '') {
            var data = new FormData();
            data.append('user_name', userName);
            data.append('UUID', fakeUUID);
            var request = new XMLHttpRequest();
            request.open('POST', uri, true);
            request.onreadystatechange = function () {
                if (request.readyState === 4 || request.readyState == "complete") {
                    if (request.status === 200 || request.status === 0) {
                        var result = request.responseText;
                        JSON.parse(result).user_id
                        console.log(JSON.parse(result).user_id);
                        if (JSON.parse(result).user_id != null) {
                            app.registrationsuccess(result);
                        } else {
                            // alert('same user name');
                            $('<div class="notification">same user name</div>').insertBefore($('#createContainer .createQuestForm'))
                            setTimeout(function () {
                                $('#createContainer .notification').remove()
                            }, 4000)
                        }

                    } else {
                        $('.loginPageSocial').append('<div class="notification">Oops! fail to register your account, please try again</div>');
                        setTimeout(function () {
                            $('#frontPage .notification').remove()
                        }, 4000)
                    }
                } else {
                    $('.loginPageSocial').append('<div class="notification">Oops! fail to register your account, please try again</div>');
                    setTimeout(function () {
                        $('#frontPage .notification').remove()
                    }, 4000)
                }
            }
            request.send(data);
        } else {
            $('<div class="notification">User name can not be empty</div>').insertBefore($('#loginPage .loginPageSocial'))
        }
    },
    registrationsuccess: function (result) {
        var callback = JSON.parse(result)
        console.log(callback.user_id);
        var userName = $("#username").val();
        console.log(userName);
        localStorage.setItem('username', userName);
        localStorage.setItem('user_id', callback.user_id);
        app.welcomepages();
    },

    welcomepages: function () {
        console.log("welcomepages");

        var userName = localStorage.getItem('username');
        $(".loginUsername").html("Welcome: " + userName);
        /***************************page change**********************************/
        //$('#loginPage').addClass('hide');
        $('[data-role="page"]').removeClass('show');
        $('[data-role="page"]').addClass('hide');
        $('#welcomepages').removeClass('hide');
        $('#welcomepages').addClass('show');
		 $('#questMapPagebtn').removeClass('show');
		$('#questMapPagebtn').addClass('hide');
       
        $("#questName").val("");
        $('#locationContainer').attr('data-sequence','');
    },



    // WARREN CODE HERE
    createQuestPage: function () {


        console.log("createQuestPage");



        $('[data-role="page"]').removeClass('show');
        $('[data-role="page"]').addClass('hide');
        $('#createQuestPage').removeClass('hide');
        $('#createQuestPage').addClass('show');

        //        if (app.detectTouchSupport()) {
        //            $(".back ,.nextQuest2ndPage").bind("touchend", app.handleTouchEnd);
        //            $(".back").bind("onetap", app.welcomepages);
        //            $(".nextQuest2ndPage").bind("click", app.saveQuest);
        //        } else {
        //            $(".back").bind("click", app.welcomepages);
        //            $(".nextQuest2ndPage").bind("click", app.saveQuest);
        //
        //        }


    },
    saveQuest: function (ev) {
        ev.preventDefault();
        var user_id = localStorage.getItem("user_id");
        console.log(user_id);
        var quest_name = $("#questName").val();
        console.log(quest_name);
        var isCompleted = "false";
        var uri = "http://m.edumedia.ca/wu000155/geo/create-quest.php";
        //var uri = "js/create-quest.php";

        var notification = document.querySelector('#createContainer .notification');
        if (notification) {
            $('#createContainer .notification').remove();
        }

        if (user_id != '' && quest_name != '') {
            var data = new FormData();
            data.append('user_id', user_id);
            data.append('quest_name', quest_name);
            data.append('isCompleted', isCompleted);

            var request = new XMLHttpRequest();
            request.open('POST', uri, true);
            request.onreadystatechange = function () {
                if (request.readyState === 4 || request.readyState == "complete") {
                    if (request.status === 200 || request.status === 0) {
                        var result = request.responseText;
                        console.log(result);
                        console.log(JSON.parse(result).quest_id);
                        if (JSON.parse(result).quest_id != null) {
                            var quest_id = JSON.parse(result).quest_id;
                            console.log(JSON.parse(result).quest_id);
                            $("#questName").val("");
                            app.createQuestMapPage(quest_id);
                        } else {
                            //alert('same quest name');
                            $('<div class="notification">same quest name</div>').insertBefore($('#createContainer .createQuestForm'))
                            setTimeout(function () {
                                $('#createContainer .notification').remove()
                            }, 4000)
                        }

                    } else {

                        $('<div class="notification">Oops! fail to save your quest, please try again</div>').insertBefore($('#createContainer .createQuestForm'))
                        setTimeout(function () {
                            $('#createContainer .notification').remove()
                        }, 4000)
                    }
                }
                $('<div class="notification">Oops! fail to save your quest, please try again</div>').insertBefore($('#createContainer .createQuestForm'))
                setTimeout(function () {
                    $('#createContainer .notification').remove()
                }, 4000)
            }
            request.send(data);
        } else {
            $('<div class="notification">quest name can not be empty</div>').insertBefore($('#createContainer .createQuestForm'))
            setTimeout(function () {
                $('#createContainer .notification').remove()
            }, 4000)
        }


    },



    createQuestMapPage: function (quest_id) {

        console.log("createQuestMapPage");
        $('#createQuestPage').removeClass('show');
        $('#createQuestPage').addClass('hide');
        $('#createQuestMapPage').removeClass('hide');
        $('#createQuestMapPage').addClass('show');
        /***************************page change**********************************/
        $('#locationContainer').attr('data-GEOQuest-id', quest_id);

        if ($('#locationContainer').attr('data-sequence')=="") {
            sequence = 0;
			console.log(sequence);
			//has issue
            $('#locationContainer').attr('data-sequence',sequence);
			$('<div class="notification">Finish your first location, then you can see back button</div>').insertBefore($('#locationContainer #locationHintArea'))
							setTimeout(function () {
								$('#locationContainer .notification').remove()
							}, 4000)
        } else {
            if ($('#locationContainer .information')) {
                $('#locationContainer .information').remove();
            }
            sequence = Number($('#locationContainer').attr('data-sequence'));
			console.log(sequence);
            $('#questMapPagebtn').removeClass('hide');
            $('#questMapPagebtn').addClass('show');
            var pages = sequence + 1
            $('<div class="information">your No.' + pages + ' location</div>').insertAfter($('#locationContainer #locationHintArea'))
            $('#locationContainer').attr('data-sequence', '');
        }
        /***************************temporary solution**********************************/
        //        $('#getGps, #nextQuestPage2, #locationSubmit').unbind("touchend", app.handleTouchEnd);
        //        $('#getGps').unbind("onetap", app.getGeo);
        //        $('#nextQuestPage2').unbind("onetap", app.nextLocation);
        //        $('#getGps').unbind('click', app.getGeo);
        //        $('#nextQuestPage2').unbind('click', app.nextLocation);
        //        $('#locationSubmit').unbind("onetap", app.submitLocations);
        //        $('#locationSubmit').unbind("click", app.submitLocations);
        //        /***************************temporary solution**********************************/
        //        if (app.detectTouchSupport()) {
        //            $('#getGps, #nextQuestPage2, #locationSubmit').bind("touchend", app.handleTouchEnd);
        //            $('#getGps').bind("onetap", app.getGeo);
        //            $('#nextQuestPage2').bind("onetap", app.nextLocation);
        //            $('#locationSubmit').bind("onetap", app.submitLocations);
        //        } else {
        //            $('#getGps').bind('click', app.getGeo);
        //            $('#nextQuestPage2').bind('click', app.nextLocation);
        //             $('#locationSubmit').bind("click", app.submitLocations);
        //        }
        // document.getElementById("getGps").addEventListener("click", app.getGeo);
    },
    nextLocation: function (ev) {

        ev.preventDefault();
       

        lite.saveLocations();
    },
    submitLocations: function () {
        console.log('submitLocations');
        var hint = $.trim($("textarea").val());
        var lat = $('#mapcontainer').attr('data-lat');
        if (hint == "" && !lat) {
            lite.submitToDatabase();
        } else if (hint != '' && (lat && lat != '')) {
            lite.saveLocations();
            setTimeout(function () {
                lite.submitToDatabase();
            }, 1000)
        } else {
            alert('you did not finished your quest');
            /***************************want more good ux, add code here**********************************/
        }
    },

    getGeo: function () {
        if ($('#mapcontainer')) {
            $('#mapcontainer').remove();
        }
        $('<div id="mapcontainer" data-lat="" data-lon=""></div>').insertAfter($('#locationContainer #getGps'))
        console.log("made it to geolocation");
        var params = {
            enableHighAccuracy: false,
            timeout: 100000,
            maximumAge: 3000
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(app.success, app.gpsError, params);
            console.log("got geo?")
        } else {
            alert("geo not supported");
        }
        //app.success();
    },

    success: function (position) {
        console.log("made it to success");
        var coordinate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var lat = position.coords.latitude;
        var longitude = position.coords.longitude;
        $('#mapcontainer').attr('data-lat', lat);
        $('#mapcontainer').attr('data-lon', longitude);
        console.log("latitude: " + lat + "longitude: " + longitude);

        var options = {
            zoom: 15,
            center: coordinate,
            mapTypeControl: false,

            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("mapcontainer"), options);

        var marker = new google.maps.Marker({
            position: coordinate,
            map: map,
            title: "You are here!"
        });
    },

    saveLocationstoDatabase: function (rs) {
        console.log("saveLocationstoDatabase");
        var literesult = rs.rows;
        var uri = "http://m.edumedia.ca/wu000155/geo/create-locations.php";
        //var uri = "js/create-locations.php";
        console.log(literesult.length);
		if(literesult.length>0){
			for (var i = 0; i < literesult.length; i++) {
				var quest_id = rs.rows.item(i).quest_id;
				console.log(quest_id);
				var sqlSequence = rs.rows.item(i).sequence;
				console.log(sqlSequence);
				var hint = rs.rows.item(i).hint;
				console.log(hint);
				var GPS = rs.rows.item(i).GPS;
				console.log(GPS);
				var user_id = rs.rows.item(i).user_id;
				console.log(user_id);
	
	
				var data = new FormData();
				data.append('user_id', user_id);
				data.append('sequence', sqlSequence);
				data.append('hint', hint);
				data.append('GPS', GPS);
				data.append('quest_id', quest_id);
	
				var request = new XMLHttpRequest();
				request.open('POST', uri, true);
				request.onreadystatechange = function () {
					if (request.readyState === 4 || request.readyState == "complete") {
						if (request.status === 200 || request.status === 0) {
							var result = request.responseText;
							//                        console.log(result);
							//                        console.log(JSON.parse(result));
							console.log(JSON.parse(result).values.length);
							console.log(literesult.length);
							//                        if (JSON.parse(result).values.length == literesult.length) {
							//                            console.log('isCompleted');
							//                            //app.changeStatus(quest_id);
							//        
							//                        }
	
						} else {
	
							$('<div class="notification">Oops! fail to save your quest, please try again</div>').insertBefore($('#locationContainer #locationHintArea'))
							setTimeout(function () {
								$('#locationContainer .notification').remove()
							}, 4000)
						}
					}
				}
				request.send(data);
	
			}
        app.changeStatus(quest_id);
		}else{
			$('<div class="notification">you did not save any location for this quest</div>').insertBefore($('#locationContainer #locationHintArea'))
							setTimeout(function () {
								$('#locationContainer .notification').remove()
							}, 4000)
		}
    },
    changeStatus: function (quest_id) {
        var uri = "http://m.edumedia.ca/wu000155/geo/change-status.php";
        //var uri = "js/change-status.php";

        var data = new FormData();
        data.append('quest_id', quest_id);
        var request = new XMLHttpRequest();
        request.open('POST', uri, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 || request.readyState == "complete") {
                if (request.status === 200 || request.status === 0) {
                    var result = request.responseText;
                    console.log(result);


                }
            }
        }
        request.send(data);
        /**********************************page change**********************/
        $('#createQuestMapPage').removeClass('show');
        $('#createQuestMapPage').addClass('hide');
        $('#welcomepages').removeClass('hide');
        $('#welcomepages').addClass('show');
        /**********************************page change**********************/
    },



    handleTouchEnd: function (ev) {
        //pass the touchend event directly to a click event
        ev.preventDefault();
        var target = ev.currentTarget;
        console.log(target);
        target.dispatchEvent(onetap);
        //this will send a click event from the touched tab to the function handleLinkClick
    },

    detectTouchSupport: function () {
        msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
        touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
        console.log(touchSupport);
        return touchSupport;
    },

    gpsError: function (error) {
        alert("gps error no code provided")
        var errors = {
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
        alert("Error: " + errors[error.code]);
    }


};

app.initialize();
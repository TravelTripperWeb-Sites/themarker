

$(document).ready(function() {
		if(sessionStorage.getItem('mobileOfferShown')){
			$('.mobile-only-offer').hide();
			$('.mobile-only').css({
					'overflow-y': 'auto'
				});

		}else{
			if($(window).width() <= 768){
			sessionStorage.setItem('mobileOfferShown',  true);
			$('.mobile-only-offer').css({'visibility' : "visible"});
			}
		}
		
		$('#kill').click(function() {
			$('.mobile-only-offer').css({
				'visibility': 'hidden',
				'opacity': '0',
				'-webkit-transition': 'all 1s ease-in-out',
				'-moz-transition': 'all 1s ease-in-out',
				'-o-transition': 'all 1s ease-in-out',
				'transition': 'all 1s ease-in-out'
			});
		  $('.mobile-only').css({
				'overflow-y': 'auto'
			});
	 	 });

	    $(".mobile-only-offer a").click(function(){
	        $('#kill').click();
	    });

       $("#home-carousel-2,#room-carousel-1").owlCarousel({


           navigation : false, // Show next and prev buttons
           slideSpeed : 500,
           paginationSpeed : 400,
           items : 2,
           paginationNumbers: false,
            pagination: false,
            autoPlay: false,
            navigation: true,
            navigationText : false,

            itemsDesktop : [1199,2],
           itemsDesktopSmall : [980,2],
           itemsTablet: [768,2],
           itemsTabletSmall: false,
           itemsMobile : [767,1],

           // "singleItem:true" is a shortcut for:
           // items : 1,
           // itemsDesktop : false,
           // itemsDesktopSmall : false,
           // itemsTablet: false,
           // itemsMobile : false

       });

 });



$(window).on('load resize', function () {
     var wHeight = $( window ).height() -60;
	 $('#homeBannerCarousel').height(wHeight);
	 $('#homeBannerCarousel .item').height(wHeight);
	   var IwHeight = $( window ).height() -175;
	 $('#innerCarousel').height(IwHeight);
	 $('#innerCarousel .item').height(IwHeight);

	 var width = $(window).width();
    if (width < 1181){


    } else {
      $('ul.nav li.dropdown').hover(function() {
          $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(250);
        }, function() {
          $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(250);
        });
    }
});
 $(document).ready(function() {
  var content = "";
 setTimeout(function(){
  	$("#owl-promo").owlCarousel({
      items : 3,
      itemsDesktop:	[1199,3],
      itemsTablet:	[768,2],
	  itemsMobile:	[479,1],
      navigation : true
    //jsonPath : 'https://rt3api-prd.ttaws.com/hotels/special_rates.json?hotel_id=KEYMRK&portal_id=themarkerkeywes&locale=en&currency=USD',
    //jsonSuccess : customDataSuccess
  })}, 2000);
 /*
  function customDataSuccess(data){
  	console(data);
    var content = "";
    for(var i in data["special_rates"]){
       var title = data["special_rates"][i].rate_plan_name;
       var img = data["special_rates"][i].lead_photo_url[0].thumb_yankee_large;
       var description = data["special_rates"][i].short_description;
       var rateplan = data["special_rates"][i].rate_plan_code;


       //content += "<h4> "+title+" </h4><img src=\"" +img+ "\" >"
     content += "<article><a class='thumbnail' ng-show='img.length > 1'  ><img src=\"" +img+ "\"  title=\"" +title+ "\"></a><h4><a href=\"special/special-more#/"+rateplan+"\">"+title+"</a></h4><p>"+description+"</p><a class='button'  href=\"special/special-more#/"+rateplan+"\">Read More</a></article>"
    }
    $("#owl-promo").html(content);
  } */
});



$(function() {
 	$( "#booking" ).hover(function() {
			$(this).removeClass("collapsed");
	});
	$( "#inner-wrapper .sidebar-nav h4" ).click(function() {
			$(this).toggleClass("active");
	});

	/*--galelry --*/

	 $("#exterior-gallery").lightGallery( );
	 $("#gust-gallery").lightGallery( );
	 $("#lobby-gallery").lightGallery( );
	 $("#pool-gallery").lightGallery( );
	 $("#cero-gallery").lightGallery( );
	 $("#events-gallery").lightGallery( );
 $("div[data-href='']").hide();


// Custom link to reztrip search
var today = new Date();
var arrival = $.datepicker.formatDate('yy-mm-dd', today);
var departure = $.datepicker.formatDate('yy-mm-dd', new Date(today.setDate(today.getDate() + 1)));

var rooms = 1; //default
var adults = 2; //default

createLink();

$( ".selectbox" ).selectmenu({
    change: function(event, ui) {
        if (event.target.id == 'adults') {
            adults = ui.item.value;
        }

        if (event.target.id == 'rooms') {
            rooms = ui.item.value;
        }

        createLink();
    }
});

$(document).on('change', '#arrival_dates', function() {
    arrival = $('#arrival_dates').val();
    departure = $('#departure_dates').val();

    var arrivalDateValue = new Date(arrival)
    var departureDateValue = new Date(departure)

    var minDepartureDateValue = new Date(arrivalDateValue)
    minDepartureDateValue.setDate(minDepartureDateValue.getDate() + 1)

    departureDate.datepicker('option', 'minDate', minDepartureDateValue);

    if (minDepartureDateValue.getTime() > departureDateValue.getTime()) {
        departureDate.datepicker('setDate', minDepartureDateValue);
        departure = $.datepicker.formatDate('yy-mm-dd', minDepartureDateValue);
    }


    searchBarCheckAvailabiliti();
});
$(document).on('change', '#departure_dates', function() {
    departure = $('#departure_dates').val();

    searchBarCheckAvailabiliti();
});

$(document).on('click', '.hometonightRate', function() {
    var today = new Date();

    var arrival = $.datepicker.formatDate('yy-mm-dd', today);
    var departure = $.datepicker.formatDate('yy-mm-dd', new Date(today.setDate(today.getDate() + 1)));

    var rooms = 1;
    var adults = 2;
    var linkToSearch =
        'https://themarkerkeywest.reztrip.com/search?' +
        'arrival_date=' + arrival +
        '&departure_date=' + departure +
        '&rooms=' + rooms +
        '&adults=' + adults;

    $('.hometonightRate').attr('href', linkToSearch);
});

function searchBarCheckAvailabiliti() {
    var linkToSearch =
        'https://themarkerkeywest.reztrip.com/search?' +
        'arrival_date=' + arrival +
        '&departure_date=' + departure +
        '&rooms=' + rooms +
        '&adults=' + adults;

    $('.link_to_reztrip_with_search_params').attr('href', linkToSearch);
}
searchBarCheckAvailabiliti();


function createLink(to, item) {
    var date = new Date();
    var arrival = $.datepicker.formatDate('yy-mm-dd', date);
    var departure = $.datepicker.formatDate('yy-mm-dd', new Date(date.setDate(date.getDate() + 1)));
    var rooms = 1;
    var adults = 2;
    var rootLink = 'https://themarkerkeywest.reztrip.com/';

    if (to == "Book Now") {
        var result =
            rootLink +
            'search?' +
            'arrival_date=' + arrival +
            '&departure_date=' + departure +
            '&rooms=' + rooms +
            '&adults=' + adults +
			'&selected_room_category=' + item.data('link-to-book-now');
			var roomcode = item.data('roomcode'); 
			if(roomcode){
				result = result + "&selected_room=" + roomcode;
			}

        item.attr('href', result);
    }

    if (to == "Category") {
        var result = rootLink + '?selected_room_category=' + item.data('link-to-category');

        item.attr('href', result);
	}

}

$.each($('[data-link-to-book-now]'), function(index, value) {
    createLink('Book Now', $(this));
});

$.each($('[data-link-to-category]'), function(index, value) {
    createLink('Category', $(this));
});

//  Datepicker
var defaultArrivalDate = arrival;
var defaultDepartureDate = departure;

var arrivalDate = $('#arrival_dates');
var departureDate = $('#departure_dates');

arrivalDate.val(defaultArrivalDate);
departureDate.val(defaultDepartureDate);

arrivalDate.datepicker({
    dateFormat: 'yy-mm-dd',
    minDate: 0
});

departureDate.datepicker({
    dateFormat: 'yy-mm-dd',
});

	setTimeout(function(){
		if ($('#innerCarousel .item').length > 1) {
				$('.carousel-control').show();
				var innerCarousel = $(".carousel");
				innerCarousel.append("<ol class='carousel-indicators'></ol>");
				var indicators = $(".carousel-indicators");
				innerCarousel.find(".carousel-inner").children(".item").each(function(index) {
						(index === 0) ?
						indicators.append("<li data-target='#innerCarousel' data-slide-to='"+index+"' class='active'></li>") :
						indicators.append("<li data-target='#innerCarousel' data-slide-to='"+index+"'></li>");
				});
		
		}
		if ($('#innerCarouselRoom .item').length > 1) {
				$('.carousel-control').show();
		}
		$('.carousel').carousel();
		var IwHeight = $( window ).height() -175;
		$('#innerCarouselRoom').height(IwHeight);
		$('#innerCarouselRoom .item').height(IwHeight);
	},2200);

	setTimeout(function(){
		$(".price-wrap1").css("display","block");
	},2800);
	
	$("a.anchorLink").anchorAnimate()

	// back to top link is shown
		var offset = 300,
		offset_opacity = 1200,
		scroll_top_duration = 700,
		$back_to_top = $('.cd-top');

	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) {
			$back_to_top.addClass('cd-fade-out');
		}
	});

	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
		 	}, scroll_top_duration
		);
	});


 });


jQuery.fn.anchorAnimate = function(settings) {
 	settings = jQuery.extend({
		speed : 1100
	}, settings);

	return this.each(function(){
		var caller = this
		$(caller).click(function (event) {
			event.preventDefault()
			var locationHref = window.location.href
			var elementClick = $(caller).attr("href")

			var destination = $(elementClick).offset().top - 80;
			$("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, settings.speed, function() {
				window.location.hash = elementClick
			});
		  	return false;
		})
	})
}

//  Navis Phone number
 function ReturnNavisNCPhoneNumberFormat(fmt){
      var ph = NavisConvertTagToPhoneNumberBasic(ReadNavisTagCookie());
      return FormatPhone(ph, fmt);
}

ProcessNavisNCKeyword();

$(document).ready(function() {
      var NCDisplayNum = ReturnNavisNCPhoneNumberFormat("(###) ###-####");
      var NCLinkNum = 'tel:' + ReturnNavisNCPhoneNumberFormat("###-###-####");
      $(".NCLink").html(NCDisplayNum).attr("href", NCLinkNum);
});
// google map
$(document).ready(function () {
	siteInfo = { name: "The Marker Waterfront Resort", country: "USA", state: "Florida", city: "Key West", adr: "200 William Street", zip: "33040", lat: "24.5609239", lng: "-81.80140140000003", phone: "(305) 501-5193" };
	var isiPad = navigator.userAgent.match(/iPad/i) != null;

	if (typeof poi_json !== "undefined" && $("#poi").length) {

		var map = new google.maps.Map(document.getElementById("poi_map"), {
			mapTypeId:google.maps.MapTypeId.ROADMAP,
			scrollwheel:false
		});

		var infowindow = new google.maps.InfoWindow({
			content:""
		});

		$("#poi-list").append('<thead><tr><th class="name">Place Name</th><th class="address">Address</th><th class="phone">Phone</th><th class="distance">Distance</th><th class="th-showonmap">Show on map</th></tr></thead>');

		function addMarker(point, marker_nr) {
			var marker = new google.maps.Marker({
				position:new google.maps.LatLng(point.lat, point.lng),
				map:map
			});
			var infoContent = '<div class="map-content"><h4>' + point.name + '</h4><p>' + point.address + '<br>' + point.phone + '</p><p><a href="http://maps.google.com/maps?f=d&amp;geocode=&amp;daddr=' + point.lat + '%2C%20' + point.lng + '&amp;z=14" target="_blank">Get directions</a></p></div>';

			google.maps.event.addListener(marker, "click", function () {
				infowindow.setContent(infoContent);
				infowindow.open(map, marker);
			});
			$("#point-" + marker_nr + " .show-on-map").click(function (e) {
				if (isiPad) $('#copy').animate({scrollTop:$("#poi_map").position().top}, 100);
				else $('html,body').animate({scrollTop:$("#poi_map").offset().top}, 100);
				infowindow.setContent(infoContent);
				infowindow.open(map, marker);
			});

			$("#point-more-" + marker_nr + " .c-show-on-map").click(function (e) {
				e.preventDefault();
				if (isiPad) $('#copy').animate({scrollTop:$("#poi_map").position().top}, 100);
				else $('html,body').animate({scrollTop:$("#poi_map").offset().top}, 100);
				infowindow.setContent(infoContent);
				infowindow.open(map, marker);
			});

			$("#point-" + marker_nr + " .poi-expand").not(".disabled").click(function (e) {

				var desc = $("#point-more-" + marker_nr + " div");

				if ($(this).hasClass("expanded")) {
					$(this).removeClass("expanded");
					desc.slideUp(200);
				} else {
					$(this).addClass("expanded");
					desc.slideDown(200);
				}

			});

			$("#point-" + marker_nr + " .show-on-map").hover(
				function () {
					marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
				}, function () {
					marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
				}
			);
		}

		$.each(poi_json.points, function (i, point) {

			var thumbnail = point.image_link ? "<img src='" + point.image_link + "' alt='"+point.name+"'>" : "";
			var moreExtraClass = "";
			if (thumbnail == "" && point.descr == "" && point.url_name == "") moreExtraClass = " disabled";
			var pointContent = "<tr id='point-" + i + "'><td class='name'><span class='poi-expand" + moreExtraClass + "'>" + point.name + "</span></td><td class='address'>" + point.address + "</td><td class='phone'>" + point.phone + "</td><td class='distance'>" + point.distance + "</td><td class='td-showonmap'><span class='show-on-map'>Show on map</span></td></tr><tr id='point-more-" + i + "' class='poi-more'><td colspan='5'><div>" + thumbnail + "<span class='poi-descr'>" + point.descr + "<br><a href='" + point.link + "' target='_blank'>" + point.url_name + "</a><br><a href='#' class='c-show-on-map'>show on map</a></span></div></td></tr>";
			$("#poi-list").append(pointContent);
			addMarker(point, i);
		});

		/* Hotel marker, address from site settings */

			var pointer = "/assets/images/6812/original/pointer.png";


		var marker = new google.maps.Marker({
			position:new google.maps.LatLng(poi_json.hotel_info.lat, poi_json.hotel_info.lng),
			map:map,
			icon:pointer
		});
		var infoContent = '<div class="map-content"><h4>' + poi_json.hotel_info.title + '</h4><p>' + poi_json.hotel_info.address + '</p><p><a href="http://maps.google.com/maps?f=d&amp;geocode=&amp;daddr=' + poi_json.hotel_info.lat + '%2C%20' + poi_json.hotel_info.lng + '&amp;z=14" target="_blank">Get directions</a></p></div>';

		google.maps.event.addListener(marker, "click", function () {
			infowindow.setContent(infoContent);
			infowindow.open(map, marker);
		});

		/* ---- */

		var bounds = new google.maps.LatLngBounds();
		var extendPointHotel = new google.maps.LatLng(poi_json.hotel_info.lat, poi_json.hotel_info.lng);
		bounds.extend(extendPointHotel);

		$.each(poi_json.points, function (i, point) {
			bounds.extend(new google.maps.LatLng(point.lat, point.lng));
		});

		if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
			var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.006, bounds.getNorthEast().lng() + 0.006);
			var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.006, bounds.getNorthEast().lng() - 0.006);
			bounds.extend(extendPoint1);
			bounds.extend(extendPoint2);
		}

		map.fitBounds(bounds);

		$("#show-all").click(function (e) {
			infowindow.close();
			map.fitBounds(bounds);
			return false;
		});
	}

	if($('#map-canvas').length)	{ initGoogleMap(siteInfo) }
});



	function initGoogleMap(siteInfo) {
	var latLng = new google.maps.LatLng(siteInfo.lat, siteInfo.lng);
	var content = '<div class="map-content"><h4>' + siteInfo.name+'</h4><p>'+siteInfo.adr+'<br>Phone: '+ siteInfo.phone + '</p><p><a href="http://maps.google.com/maps?f=d&geocode=&daddr=' + siteInfo.lat + ',' + siteInfo.lng + '&z=15" target="_blank">Get directions</a></p></div>';

	var mapOptions = {
		zoom: 16,
		center: latLng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scrollwheel: false
	};

	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


		var pointer = "/assets/images/6812/original/pointer.png";


	var marker = new google.maps.Marker({
		position: latLng,
		map: map,
		icon: pointer
	});

	var infowindow = new google.maps.InfoWindow();
	infowindow.setContent(content);
	infowindow.open(map, marker);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
	});
}

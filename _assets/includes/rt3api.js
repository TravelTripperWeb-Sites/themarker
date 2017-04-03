function Rt3Api(params) {
    this.config = params;
    this.roomCache = null;
}

Rt3Api.prototype.getHotelInfo = function() {
    var path = '/hotels/details.json';
    var params = {
        hotel_id: this.config.hotelId,
        portal_id: this.config.portalId,
        locale: this.config.defaultLocale
    };

    return query(path, params);
};

Rt3Api.prototype.getPortalInfo = function() {
    var path = '/portals/'+ this.config.portalId +'.json';
    var params = {
        locale: this.config.defaultLocale,
        currency: this.config.defaultCurrency
    };

    return query(path, params);
};

Rt3Api.prototype.getAllRooms = function() {
    var self = this;
    var path = '/hotels/rooms.json';
    var params = {
        rooms: 1,
        hotel_id: this.config.hotelId,
        portal_id: this.config.portalId,
        locale: this.config.defaultLocale
    };
    var defer = $.Deferred();
    if (this.roomCache) {
        defer.resolve(this.roomCache);
    } else
    {
        query(path, params).then(function(result) {
            self.roomCache = result;
            defer.resolve(result);
        });
    }
    return defer;
};



Rt3Api.prototype.getAllAvailableRooms = function(searchParams) { //console.log(sessionStorage.ip_add);
    var path = '/hotels/rooms.json';
    var newParams = {};
    if(searchParams){
         newParams.arrival_date_0 = searchParams.arrival_date;
         newParams.departure_date_0 = searchParams.departure_date;
         newParams.adults_0 = searchParams.adults;
         newParams.children_0 = searchParams.children;
         newParams.rooms = 1;

         delete searchParams.arrival_date;
         delete searchParams.departure_date;
         delete searchParams.adults;
         delete searchParams.children;

    }
    else {
        var now = new Date();
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear() + "-" + (month) + "-" + (day);

        var nextDay;
        nextDay = new Date(today);
        var tomarrow=new Date(nextDay.setDate(nextDay.getDate() + 1));
        var depart=tomarrow.toISOString().slice(0,10);

        newParams.arrival_date_0 = today;
        newParams.departure_date_0 = depart;
        newParams.adults_0 = 2;
        newParams.children_0 = 0;
        newParams.rooms = 1;
    }
    var defaultParams = {
        hotel_id: this.config.hotelId,
        portal_id: this.config.portalId,
        locale: this.config.defaultLocale,
        currency: this.config.defaultCurrency,
        ip_address : sessionStorage.ip_add
    }





    var params = $.extend(defaultParams, newParams , searchParams)
        //console.log(JSON.stringify(params));
    return query(path, params);
};


Rt3Api.prototype.availableRooms = function(searchParams) {
    var path = '/hotels/roomRateList.json';
    var defaultParams = {
        hotel_id: this.config.hotelId,
        portal_id: this.config.portalId,
        locale: this.config.defaultLocale,
        currency: this.config.defaultCurrency
    }

    var params = $.extend(defaultParams, searchParams)

    return query(path, params);
};

Rt3Api.prototype.getAllSpecialRates = function() {
    var path = '/hotels/special_rates.json';
    var params = {
        hotel_id: this.config.hotelId,
        portal_id: this.config.portalId,
        locale: this.config.defaultLocale,
        currency: this.config.defaultCurrency
    };

    return query(path, params);
};

Rt3Api.prototype.getRoomInfo = function(searchParams) {
    var path = '/hotels/roomDetails.json';
    var defaultParams = {
        hotel_id: this.config.hotelId,
        portal_id: this.config.portalId,
        locale: this.config.defaultLocale,
        currency: this.config.defaultCurrency
    };

    var params = $.extend(defaultParams, searchParams);

    return query(path, params);
};

Rt3Api.prototype.getRateShopping = function(searchParams) {
    var path = '/hotels/rateshopping.json';
    var defaultParams = {
       hotel_id: this.config.hotelId,
       portal_id: this.config.portalId,
       locale: this.config.defaultLocale,
       currency: this.config.defaultCurrency,
       popular_only: false,
       num_rates_display: 10,
       client_ip: sessionStorage.ip_add,
       lowest_rate: null,
       search_lowest: true
    };

    var params = $.extend(defaultParams, reformatParams(searchParams));

    function reformatParams(searchParams) {
       var params = searchParams;

       params['adults[]'] = searchParams.adults || 1;
       params['children[]'] = searchParams.children || 0;
       params.rooms = searchParams.rooms || 1;

       return params;
    }

    return query(path, params);
};


Rt3Api.prototype.getBrgInfo = function(searchParams) {
    var self = this;

    var defaultParams = {
        hotel_id: this.config.hotelId,
        portal_id: this.config.portalId,
        locale: this.config.defaultLocale,
        currency: this.config.defaultCurrency
    };

    var params = $.extend(defaultParams, searchParams);

    var defered = $.Deferred();

    var roomInfo = this.getRoomInfo(params).then(function(response) {
        var ratePlans = response.rate_plans;

        self.getAllRooms().then(function(rooms_response){

            if(ratePlans) {
                var is_base_room_type = false;
                $.each(rooms_response.rooms, function(key, value) {
                    if (value.code == params.room_id && value.is_base_room_type) {
                        is_base_room_type = true;
                    }
                });

                if (is_base_room_type) {

                    self.getRateShopping({
                        arrival_date: searchParams.arrival_date,
                        departure_date: searchParams.departure_date,
                        adults: searchParams.adults,
                        children: searchParams.children
                    }).then(function(rsResponse) {
                        if(rsResponse.error_info.error_details.length){
                            if (console && console.error) {
                                console.error(rsResponse.error_info);
                            }
                        }
                        if(rsResponse.show_brg) {
                            var response = {
                                discounted_rate: rsResponse.discounted_rate || rsResponse.original_rate,
                                code: 'BRG',
                                rates: rsResponse.rates,
                                avg_brg_discounted_price: rsResponse.discounted_rate,
                                avg_brg_original_price: rsResponse.original_rate,
                                show_brg: true,
                                discount_threshold_exceeded: rsResponse.discount_threshold_exceeded,
                                dpr_name: rsResponse.dpr_name
                            };
                            defered.resolve(response);
                        } else {
                            var response = {
                                discounted_rate: ratePlans[0].average_discounted_nightly_price || ratePlans[0].average_nightly_price,
                                code: ratePlans[0].code,
                                rates: []
                            };
                            defered.resolve(response);
                        }
                    });


                } else {

                    var response = {
                        discounted_rate: ratePlans[0].average_discounted_nightly_price || ratePlans[0].average_nightly_price,
                        code: ratePlans[0].code,
                        rates: []
                    };
                    defered.resolve(response);
                }

            } else {
                var response = {
                    discounted_rate: null,
                    code: null,
                    rates: []
                };
                defered.resolve(response);
            }
        });
    });

    return defered;
};


Rt3Api.prototype.getOTARates = function (params){
  var searchParams ,
      startDate,
      endDate,

      retResponse={},
      reztripRate,
      brg ={},
      brgFound;
var defered = $.Deferred();
  //return new Promise(function(resolve, reject){
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var startDate = now.getFullYear() + "-" + (month) + "-" + (day);

    var nextDay;
    nextDay = new Date(startDate);
    var tomarrow=new Date(nextDay.setDate(nextDay.getDate() + 1));
    var endDate=tomarrow.toISOString().slice(0,10);

    searchParams = {
      arrival_date    : startDate ,
      departure_date  : endDate
    };

    if(params){
      searchParams = $.extend(searchParams, params);
    }

    this.getRateShopping(searchParams).then(function(response) {
        var errors = response.error_info;
        if(errors && errors.error_details.length > 0){
           defered.reject(errors);

        }else{
            if(response.show_brg ){
            //  retResponse.otaRates    = response.rates;"$"+Math.round(roomRate);

              reztripRate = "$"+Math.round(response.discounted_rate);

              response.rates.forEach(function(ota){
                brg[ota.provider] = ota.rate;
              });

              brgFound = response.rates.length > 0 ? true : false;
              retResponse = {
                'reztripRate' : reztripRate,
                'brg' : brg,
                'brgFound' : brgFound
              }
              defered.resolve(retResponse);
            //  return defered;
            }else{
              retResponse = { "error_info": {"error_details" : [
                                                        {"error_type"    : "NOT_ALLOWED",
                                                        "error_messgae" : "BRG rates are not allowed to display."
                                                      }]
                                             }
                            };
              defered.reject(retResponse);
            //  return defered;
            }

        }
    });
    return defered;
  //});

}


Rt3Api.prototype.recentBookings = function(timeCutOffMinutes) {
    var path = '/ext/recentBookings';
    var params = {
        propertyCode: this.config.hotelId,
        timeCutOffMinutes: timeCutOffMinutes
    };

    return query(path, params);
};

// Private
function query(path, params) {
    var rootPath = 'https://rt3api-prd.ttaws.com';

    return $.ajax({
        url: rootPath + path,
        method: 'GET',
        data: params
    });
}

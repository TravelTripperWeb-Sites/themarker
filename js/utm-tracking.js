
(function($){
    // Give the URL parameters variable names
    var u_source = getParameterByName('utm_source');
    var u_medium = getParameterByName('utm_medium');
    var u_campaign = getParameterByName('utm_campaign');
    var u_term = getParameterByName('utm_term');
    var u_content = getParameterByName('utm_content');

    // Set the cookies
    if(u_source != "" ) {
        sessionStorage.utm_source = u_source;
        //createCookie('utm_source', u_source);
    }
    if(u_medium != "") {
        sessionStorage.utm_medium = u_medium;
    }
    if(u_campaign !="") {
        sessionStorage.utm_campaign =  u_campaign;
    }
    if(u_term !="") {
        sessionStorage.utm_term = u_term;
    }
    if(u_content !="") {
        sessionStorage.utm_content =  u_content;
    }

    // pass utm params if anchor url is reztrip.com
    $(document).on("click", "a", function(){
        var source = sessionStorage.utm_source;
        var medium = sessionStorage.utm_medium;
        var campaign = sessionStorage.utm_campaign;
        var term = sessionStorage.utm_term;
        var content = sessionStorage.utm_content;
        var currentUrl = window.location.origin;

        var this_href = $(this).attr("href");
        if(this_href && (source || medium || campaign || term || content )) {
            if(this_href.indexOf('?') != -1 )
                this_href = this_href +"&";
            else
                this_href = this_href +"?";

            if(source != null && source != '' && this_href.indexOf('utm_source') == -1){
                this_href = this_href + 'utm_source='+source+'&';
            }
            if(medium != null && medium != '' && this_href.indexOf('utm_medium') == -1) {
                this_href = this_href + 'utm_medium='+medium+'&';
            }
            if(campaign != null && campaign != '' && this_href.indexOf('utm_campaign') == -1){
                this_href = this_href + 'utm_campaign='+campaign+'&';
            }
            if(term != null && term != '' && this_href.indexOf('utm_term') == -1){
                this_href = this_href + 'utm_term='+term+'&';
            }
            if(content != null && content != '' && this_href.indexOf('utm_content') == -1){
                this_href = this_href + 'utm_content='+content;
            }

            if(this.href.indexOf(currentUrl) == -1){
               $(this).attr('href',this_href);
            }
        }




    });
    // pass utm params on form submission;
    $(document).on('submit', 'form', function(){
        var this_action = $(this).attr("action");
        var source = sessionStorage.utm_source;
        var medium = sessionStorage.utm_medium;
        var campaign = sessionStorage.utm_campaign;
        var term = sessionStorage.utm_term;
        var content = sessionStorage.utm_content;
        var utmEl='';

        if(source != null && source != '' && $("input[name='utm_source']").length ==0 ){
            utmEl = "<input type='hidden' name='utm_source' value='" + escape(source) + "'>";
        }
        if(medium != null && medium != '' && $("input[name='utm_medium']").length ==0) {
            utmEl = utmEl + "<input type='hidden' name='utm_medium' value='" + escape(medium) + "'>";
        }
        if(campaign != null && campaign != '' && $("input[name='utm_campaign']").length ==0){
            utmEl = utmEl + "<input type='hidden' name='utm_campaign' value='" + escape(campaign) + "'>";
        }
        if(term != null && term != '' && $("input[name='utm_term']").length ==0){
            utmEl = utmEl + "<input type='hidden' name='utm_term' value='" + escape(term) + "'>";
        }
        if(content != null && content != '' && $("input[name='utm_content']").length ==0){
            utmEl = utmEl + "<input type='hidden' name='utm_content' value='" + escape(content) + "'>";
        }
        if(utmEl != '' ){
            utmEl = $(utmEl);
            $(this).prepend(utmEl);
        }
    });

    // Parse the URL
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }


})($);

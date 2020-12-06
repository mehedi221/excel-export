 /*
 * define .. 
 * load send followup module all js 
 * Developed by Alamgir hossen 
 * on 09/04/2019 ...
 *
 */
/*Follow Up setting start*/
function enableDailySummary(){
    var checkBox = document.getElementById("enable_daily_summary");
    var text = document.getElementById("enable_daily_summary_block");
    if (checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

function automaticBounce(){
    var checkBox = document.getElementById("bounce_handling");

    var text = document.getElementById("automatic_bounce_section");
    if (checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

$(document).ready(function(){
    $('#bounce_ssl').on('change',function(){
        var  bounce_ssl = $(this).val();

        if ($(this).is(":checked")) {
            $('#bounce_port').val('995');
        } else {
            $('#bounce_port').val('110');
        }


    });

    $('.checkbox_value_set').on('change',function(){
        var id = $(this).data('id');
        
        if ($(this).is(":checked")) {
            $('#'+id).val(1);
        } else {
            $('#'+id).val(0);
        }


    });
});

/*Follow Up setting End*/

/*### follow up email module create js  and ajax start ###*/
 function ajax_tag_search_result() {
     var email_type = $('#email_type').val();

     jQuery('#loading').html('<div class="loader"></div>');
     $.ajax({
         type: 'GET',
         url: base_url + 'follow_up/get_ajax_follow_mail_type/' + email_type,
         dataType: 'json',
         success: function (data) {
             jQuery('#mail_type_data').html(data.details_data);
             jQuery('#variables_data').html(data.variables_data);
             jQuery('#loading').html('');
         }
     });
 }

function showDiv(element) {
    if (element.value == 1) {
        document.getElementById("hidden_div").style.display = "block";
        document.getElementById("hidden_div_two").style.display = "none";

    } else {
        document.getElementById("hidden_div_two").style.display = "block";
        document.getElementById("hidden_div").style.display = "none";
    }
}


function myFunction() {
    var checkBox = document.getElementById("coupons");
    var text = document.getElementById("hidden_div_select");
    if (checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

function myFunctionGoogle() {
    var checkBox = document.getElementById("google_tracking");
    var text = document.getElementById("hidden_div_select_google");
    if (checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}


function myFunctionTwo() {
    var checkBox = document.getElementById("coupons_two");
    var text = document.getElementById("hidden_div_select_two");
    if (checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

function myFunctionGoogleTwo() {
    var checkBox = document.getElementById("google_tracking_two");
    var text = document.getElementById("hidden_div_select_google_two");
    if (checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

/*Follow Up email module create js  and ajax End*/

/***********************follow email index page bulck action js satar******************************/
$(document).ready(function (e) {
    $('.selectall').on('change', function (e) {
        var inputs = $('.select_input_value');

        if ($(this).is(":checked")) {
            var Current_ids = [];

            for (var i = 0; i < inputs.length; i++) {

                Current_ids.push($(inputs[i]).val());
            }

            $('#hidden_email_ids').val(Current_ids.join(","));

        } else {
            $('#hidden_email_ids').val('');
        }
    });


    $('.select_input_value').on('change', function (e) {
        var val = $(this).val();
        var Current_ids = $('#hidden_email_ids').val();
        if (Current_ids != '') {
            Current_ids = Current_ids.split(',');
        } else {
            var Current_ids = [];
        }
        if ($(this).is(":checked")) {
            Current_ids.push(val);
        } else {
            Current_ids = Current_ids.filter(function (obj) {
                return obj !== val;
            });
        }
        console.log(Current_ids.join(","));

        $('#hidden_email_ids').val(Current_ids.join(","));


    });

});

/***********************follow email index page bulck action js End******************************/
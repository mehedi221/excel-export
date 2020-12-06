function ajax_tag_search_result() {
        var webPath = "<?= site_url(); ?>";
        var email_type =  $('#email_type').val();
       
        jQuery('#loading').html('<div class="loader"></div>');
        $.ajax({ 
            type: 'GET', 
            url: webPath + 'follow_up/get_ajax_follow_mail_type/' + email_type, 
            dataType: 'json',
            success: function (data) {
                jQuery('#mail_type_data').html(data.a);
                jQuery('#variables_data').html(data.b);
                jQuery('#loading').html('');
            }
        });
    }

    function showDiv(element)
    {

        if(element.value==1)
        {
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
        if (checkBox.checked == true){
            text.style.display = "block";
        } else {
            text.style.display = "none";
        }
    }

    function myFunctionGoogle() {
        var checkBox = document.getElementById("google_tracking");
        var text = document.getElementById("hidden_div_select_google");
        if (checkBox.checked == true){
            text.style.display = "block";
        } else {
            text.style.display = "none";
        }
    }


    function myFunctionTwo() {

        var checkBox = document.getElementById("coupons_two");
        var text = document.getElementById("hidden_div_select_two");
        if (checkBox.checked == true){
            text.style.display = "block";
        } else {
            text.style.display = "none";
        }
    }

    function myFunctionGoogleTwo() {
        var checkBox = document.getElementById("google_tracking_two");
        var text = document.getElementById("hidden_div_select_google_two");
        if (checkBox.checked == true){
            text.style.display = "block";
        } else {
            text.style.display = "none";
        }
    }


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

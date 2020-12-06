var $ = jQuery;

// bootstrap Remote Modal
var BootstrapRemoteModal = function () {
    // private function 
    var remoteModalInit = function () {
        $('body').on('click', '[data-toggle="modal"]', function () {
            $($(this).data("target") + ' .modal-content').load($(this).attr('href'));
        });
    };
    return {
        init: function () {
            remoteModalInit();
        }
    };
}();

jQuery(function () {
    jQuery('body .select2').select2({
        placeholder: "Select One"
    });

    // bootstrap 4 remote modal
    BootstrapRemoteModal.init();

    $('#lg_view_model').on('hidden.bs.modal', function (e) {
        clearTimeout(settimeout_id);
    });

    //iris color picker
    $('.colorpick')
        .iris({
            change: function (event, ui) {
                $(this).parent().find('.colorpickpreview').css({backgroundColor: ui.color.toString()});
            },
            hide: true,
            border: true
        })
        .on('click focus', function (event) {
            event.stopPropagation();
            $('.iris-picker').hide();
            $(this).closest('.field_container').find('.iris-picker').show();
            $(this).data('original-value', $(this).val());
        })
        .on('change', function () {
            if ($(this).is('.iris-error')) {
                var original_value = $(this).data('original-value');

                if (original_value.match(/^\#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)) {
                    $(this).val($(this).data('original-value')).change();
                } else {
                    $(this).val('').change();
                }
            }
        });

    $('body').on('click', function () {
        $('.iris-picker').hide();
    });
});

// formatted price
function get_formatted_price(price) {
    price = $.number(price, 2);
    var format = '$%s USD';
    return format.replace("%s", price);
}

// date range picker
function date_range_picker(start_date, end_date) {
    var start = moment(start_date, 'YYYY-MM-DD');
    var end = moment(end_date, 'YYYY-MM-DD');
    $('.daterange-picker').daterangepicker({
        startDate: start,
        endDate: end,
        opens: "left",
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Lifetime': [moment('2018-07-01'), moment()]
        }
    }, cb);
    cb(start, end);
}
function cb(start, end) {
    $('.daterange-picker span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
    $('.daterange-picker input').val(start.format('YYYY-MM-DD') + ',' + end.format('YYYY-MM-DD'));
}

jQuery(document).ready(function () {
    /*### tooltip ###*/
    jQuery('[data-toggle="tooltip"]').tooltip();

    /*### date picker ###*/
    jQuery('.date_picker').daterangepicker({
        //startDate : true,
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {format: 'YYYY-MM-DD'}
    });

    /*### make title to slug ###*/
    jQuery('.the_title').on('input', function () {
        var this_val = jQuery(this).val().toLowerCase();
        var this_val2 = jQuery(this).val().toLowerCase();
        this_val = this_val.replace(/\s/g, "-");

        var inputString = "~!@#$%^&*()_+=`{}[]|\:;'<>, " + this_val2,
            outputString = inputString.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g, '');

        jQuery('.the_slug').val(outputString);
    });

    /*### delete confirmation ###*/
    function confirm_delete() {
        return confirm('Are you sure to delete?');
    }

    /*### menu system ###*/
    // menu item add or update
    var menu_type = jQuery('form#manage_menu_item select#menu_type').val();
    if (menu_type != '') {
        set_menu_item_action_box_for_menu_type(menu_type);
    }

    jQuery('form#manage_menu_item select#menu_type').on('change', function () {
        set_menu_item_action_box_for_menu_type(jQuery(this).val());
    });

    function set_menu_item_action_box_for_menu_type(menu_type) {
        if (menu_type == 'page') {
            jQuery('form#manage_menu_item .pages-field-box').show();
            jQuery('form#manage_menu_item .customs-field-box').hide();
        } else {
            jQuery('form#manage_menu_item .pages-field-box').hide();
            jQuery('form#manage_menu_item .customs-field-box').show();
        }
    }

    /*### settings ###*/
    // get state options on change country in store settings
    jQuery('form#store_settings select#store_country').on('change', function () {
        var country_id = jQuery(this).val();

        if (country_id != '') {
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: base_url + 'settings/ajax_get_state_by_country_id',
                data:
                    {
                        'country_id': parseInt(country_id)
                    },
                success: function (data) {
                    jQuery('#store_state').empty().append(data);
                }
            });
        }
    });

    // manage selling countries on change allowed_countries in store settings
    jQuery('form#store_settings select#allowed_countries').on('change', function () {
        var allowed_countries = jQuery(this).val();

        if (allowed_countries == 'specific') {
            jQuery('.sell-to-countries-box').show();
        } else {
            jQuery('.sell-to-countries-box').hide();
        }
    });

    // manage shipping countries on change allowed_countries in store settings
    jQuery('form#store_settings select#ship_to_countries').on('change', function () {
        var ship_to_countries = jQuery(this).val();

        if (ship_to_countries == 'specific') {
            jQuery('.ship-to-countries-box').show();
        } else {
            jQuery('.ship-to-countries-box').hide();
        }
    });

    /*### manual order create ###*/
    // toggle customer billing and shipping address
    jQuery('span.edit_address').on('click', function () {
        jQuery(this).parents('.order_data_column').find('div.address_wrapper').toggle();
        jQuery(this).parents('.order_data_column').find('div.edit_address').toggle();
    });

    // load customer billing address
    jQuery('.load_customer_billing').on('click', function () {
        if (confirm('Load the customer\'s billing information? This will remove any currently entered billing information.'))
        {
            var customer_id = jQuery('#customer_id option:selected').val();

            if (parseInt(customer_id) > 0) {
                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: base_url + 'order/ajax_load_customer_billing',
                    data:
                        {
                            'customer_id': parseInt(customer_id)
                        },
                    success: function (data) {
                        if (data.billing_first_name && data.billing_last_name) {
                            jQuery('#billing_first_name').val(data.billing_first_name);
                            jQuery('#billing_last_name').val(data.billing_last_name);
                            jQuery('#billing_company').val(data.billing_company);
                            jQuery('#billing_address_1').val(data.billing_address_1);
                            jQuery('#billing_address_2').val(data.billing_address_2);
                            jQuery('#billing_city').val(data.billing_city);
                            jQuery('#billing_postcode').val(data.billing_postcode);
                            jQuery('#billing_country').val(data.billing_country);
                            jQuery('#billing_state').val(data.billing_state);
                            jQuery('#billing_phone').val(data.billing_phone);
                            jQuery('#billing_email').val(data.billing_email);
                        }
                    }
                });
            } else {
                alert('No customer selected');
            }
        }
    });

    // load customer shipping address
    jQuery('.load_customer_shipping').on('click', function () {
        if (confirm('Load the customer\'s shipping information? This will remove any currently entered shipping information.'))
        {
            var customer_id = jQuery('#customer_id option:selected').val();

            if (parseInt(customer_id) > 0) {
                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: base_url + 'order/ajax_load_customer_shipping',
                    data:
                        {
                            'customer_id': parseInt(customer_id)
                        },
                    success: function (data) {
                        if (data.shipping_first_name && data.shipping_last_name) {
                            jQuery('#shipping_first_name').val(data.shipping_first_name);
                            jQuery('#shipping_last_name').val(data.shipping_last_name);
                            jQuery('#shipping_company').val(data.shipping_company);
                            jQuery('#shipping_address_1').val(data.shipping_address_1);
                            jQuery('#shipping_address_2').val(data.shipping_address_2);
                            jQuery('#shipping_city').val(data.shipping_city);
                            jQuery('#shipping_postcode').val(data.shipping_postcode);
                            jQuery('#shipping_country').val(data.shipping_country);
                            jQuery('#shipping_state').val(data.shipping_state);
                        }
                    }
                });
            } else {
                alert('No customer selected');
            }
        }
    });

    // copy customer billing address to shipping
    jQuery('.copy_customer_billing').on('click', function () {
        if (confirm('Copy billing information to shipping information? This will remove any currently entered shipping information.'))
        {
            var billing_first_name = jQuery('#billing_first_name').val();
            var billing_last_name = jQuery('#billing_last_name').val();
            var billing_company = jQuery('#billing_company').val();
            var billing_address_1 = jQuery('#billing_address_1').val();
            var billing_address_2 = jQuery('#billing_address_2').val();
            var billing_city = jQuery('#billing_city').val();
            var billing_postcode = jQuery('#billing_postcode').val();
            var billing_country = jQuery('#billing_country').val();
            var billing_state = jQuery('#billing_state').val();

            jQuery('#shipping_first_name').val(billing_first_name);
            jQuery('#shipping_last_name').val(billing_last_name);
            jQuery('#shipping_company').val(billing_company);
            jQuery('#shipping_address_1').val(billing_address_1);
            jQuery('#shipping_address_2').val(billing_address_2);
            jQuery('#shipping_city').val(billing_city);
            jQuery('#shipping_postcode').val(billing_postcode);
            jQuery('#shipping_country').val(billing_country);
            jQuery('#shipping_state').val(billing_state);
        }
    });

    // toggle products box to add order items
    jQuery('body').on('click', '.order-bulk-action-box .btn.add_order_item', function () {
        var customer_id = jQuery('#customer_id').val();
        var billing_first_name = jQuery('#billing_first_name').val();
        var billing_last_name = jQuery('#billing_last_name').val();
        var shipping_first_name = jQuery('#shipping_first_name').val();
        var shipping_last_name = jQuery('#shipping_last_name').val();

        if (customer_id == '') {
            alert('Please select customer');
            return false;
        }

        if (billing_first_name == '' || billing_last_name == '') {
            alert('Billing information is empty');
            return false;
        }

        if (shipping_first_name == '' || shipping_last_name == '') {
            alert('Shipping information is empty');
            return false;
        }

        jQuery('.add-product-box').toggle();
        jQuery("html, body").animate({scrollTop: jQuery('.add-product-box').offset().top}, 1000);
    });

    // apply order item
    jQuery('.btn.apply_order_item').on('click', function (e) {
        if (jQuery('.meal-items tr.meal_item').length > 0) {
            if (jQuery('.meal-items tr.meal_item input[type=checkbox]:checked').length <= 0) {
                alert('You must select meal items!');
                return false;
            }

            if (jQuery('.order_review_table tbody .order-item-row').length > 0) {
                alert('You are not able to select one more meal plane at a time!\nRemove previous item to select another plane.');
                return false;
            }
        }

        var site = jQuery('#site option:selected').val();
        var item_id = jQuery('#item_id option:selected').val();
        var quantity = jQuery('#quantity').val();

        var already_exist = false;

        if (parseInt(item_id) > 0) {
            if (jQuery('.order-item-row.item-row-' + item_id).length > 0) {
                var old_quantity = jQuery('.order-item-row.item-row-' + item_id + ' input.quantity_' + item_id).val();
                quantity = parseInt(old_quantity) + parseInt(quantity);
                already_exist = true;
            }

            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: base_url + 'order/ajax_apply_cart_item',
                data: {
                    'site': site,
                    'item_id': parseInt(item_id),
                    'quantity': parseInt(quantity)
                },
                success: function (data) {
                    if (already_exist == true) {
                        jQuery('.order-item-row.item-row-' + item_id).remove();
                    }

                    jQuery('.order_review_table tbody').append(data.html);

                    jQuery('.order-bulk-action-box .btn.cancel_order_item').show();

                    jQuery("html, body").animate({scrollTop: jQuery('.postbox_order_table').offset().top}, 1000);
                }
            });
        } else {
            alert('No product selected!');
        }
    });

    // edit order item
    jQuery('body').on('click', '.edit_order_item', function () {
        var rowid = jQuery(this).attr('data-rowid');

        jQuery('.order-item-row.item-row-' + rowid + ' .view').hide();
        jQuery('.order-item-row.item-row-' + rowid + ' .edit').show();

        jQuery('.order-bulk-action-box .btn.cancel_order_item').show();
    });

    // delete order item
    jQuery('body').on('click', '.delete_order_item', function () {
        if (confirm('Are you sure to delete?')) {
            var rowid = jQuery(this).attr('data-rowid');

            jQuery('.order-item-row.item-row-' + rowid).remove();
        } else
        {
            return false;
        }
    });

    // on change order item qty
    jQuery('body').on('input change keyup paste', '.order-item-row .quantity', function () {
        var this_parent = jQuery(this).parents('.order-item-row');

        var item_qty = parseInt(jQuery(this).val());

        var item_price = this_parent.find('input.price').val();
        item_subtotal = parseFloat(item_price) * item_qty;
        this_parent.find('input.item_subtotal').val(item_subtotal);

        var cart_sale_price = this_parent.find('input.cart_sale_price').val();
        item_total = parseFloat(cart_sale_price) * item_qty;
        this_parent.find('input.item_total').val(item_total);
    });

    // save order item changes
    jQuery('body').on('click', '.order-bulk-action-box .btn.save_order_item', function () {
        jQuery('.add-product-box').hide();
        jQuery('.order-bulk-action-box .btn.cancel_order_item').hide();
        jQuery('.order-items-summary').addClass('loading');

        calculate_order_item();
    });

    jQuery('body').on('click', '.order-bulk-action-box .btn.cancel_order_item', function () {
        jQuery(this).hide();
        jQuery('.add-product-box').hide();
        jQuery('.order-items-summary').addClass('loading');

        calculate_order_item();
    });

    // apply shipping method and cost
    jQuery('.order-shipping-method-items label.shipping-item').on('click', function () {
        var shipping_cost = jQuery(this).find('input').attr('data-shipping-cost');
        var old_shipping_cost = jQuery('#shipping_cost').val();
        var order_total = jQuery('#order_total').val();

        if (old_shipping_cost > 0) {
            order_total = parseFloat(shipping_cost) + (parseFloat(order_total) - parseFloat(old_shipping_cost));
        } else {
            order_total = parseFloat(shipping_cost) + parseFloat(order_total);
        }

        jQuery('#order_total_view').html(get_formatted_price(order_total));
        jQuery('#order_total').val(order_total);
        jQuery('#shipping_cost').val(shipping_cost);
    });

    // toggle coupon box
    jQuery('.order-bulk-action-box .apply_coupon').click(function (e) {
        if (jQuery('.order-item-row').length > 0) {
            jQuery('.add-coupon-box').toggle();

            jQuery("html, body").animate({scrollTop: jQuery('.add-coupon-box').offset().top}, 1000);
        } else {
            alert('You have no product yeat!');
        }
    });

    // apply coupon
    jQuery('.add-coupon-box .apply_coupon_code').on('click', function () {
        var coupon_code_field = jQuery('#applied_coupon_code');
        var coupon_code = coupon_code_field.val();

        if (coupon_code == '') {
            coupon_code_field.addClass('validation-error');
            coupon_code_field.focus();
            return false;
        }

        if (jQuery('.wc-used-coupons .wc_coupon_list .code').hasClass('code-' + coupon_code)) {
            alert('Coupon already used.');
            return false;
        }

        var html = '<li class="code code-'+coupon_code+'">' +
            '<a href="#"><span>'+coupon_code+'</span></a>' +
            '<input type="hidden" name="coupon_code[]" class="coupon_codes" value="'+coupon_code+'">' +
            '</li>';

        jQuery('.wc-used-coupons .wc_coupon_list').append(html);

        var order_data = jQuery("#add_manual_order").serialize();

        jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            url: base_url + 'order/ajax_apply_coupon_code',
            data: order_data,
            success: function (data) {
                if (data.full_free == 1) {
                    jQuery('#full_free').val(1);
                    jQuery('.save_order_item').trigger('click');
                }

                if (data.status == 1) {
                    jQuery('.wc-used-coupons').show();
                    jQuery('.wc-used-coupons .wc_coupon_list').html(data.html);

                    var discount_total = parseFloat(data.discount);

                    jQuery('.order-items-summary .order-total-discount').show();
                    jQuery('#discount_total_view').html(get_formatted_price(discount_total));
                    jQuery('#discount_total').val(discount_total);
                    jQuery('#coupon_discount_total').val(discount_total);

                    var order_total = jQuery('#order_total').val();
                    order_total = order_total > 0 ? (parseFloat(order_total) - discount_total) : 0;
                    order_total = order_total < 0 ? 0 : order_total;

                    if (data.full_free == 1) {
                        order_total = 0;
                    }

                    jQuery('#order_total_view').html(get_formatted_price(order_total));
                    jQuery('#order_total').val(order_total);

                    jQuery("html, body").animate({scrollTop: jQuery('.wc-used-coupons').offset().top - 100}, 1000);

                    jQuery('#applied_coupon_code').val('');

                    calculate_order_item();
                } else {
                    alert(data.message);
                }
            }
        });
    });

    // toggle coupon box
    jQuery('.order-bulk-action-box .add_additional_fee').click(function (e) {
        if (jQuery('.order-item-row').length > 0) {
            jQuery('.add-fee-box').toggle();

            jQuery("html, body").animate({scrollTop: jQuery('.add-fee-box').offset().top}, 1000);
        } else {
            alert('You have no product yeat!');
        }
    });

    // apply additional fee
    jQuery('.add-fee-box .apply_additional_fee').on('click', function () {
        var fee_name = jQuery('#fee_name');
        var fee_amount = jQuery('#fee_amount');

        if (fee_name.val() == '' || fee_amount.val() == '') {
            fee_name.addClass('validation-error');
            fee_amount.addClass('validation-error');
            return false;
        } else {
            jQuery('.save_order_item').trigger('click');

            var additional_fees_num_of_rows = jQuery('#additional_fees_num_of_rows').val();
            var last_additional_fees_num_of_rows = parseInt(additional_fees_num_of_rows) + 1;
            jQuery('#additional_fees_num_of_rows').val(last_additional_fees_num_of_rows);

            jQuery('.order-items-summary .additional-fees').show();
            jQuery('.order-items-summary .additional-fees').append('' +
                '<tr class="additional-fee-item hover_action_show">' +
                '<td class="thumb" style="width: 65px; text-align: center"><div class="addFeeIco"><i class="fa fa-plus-circle" aria-hidden="true"></i></div></td>' +
                '<td class="name" colspan="2" width="50%">' +
                '<div class="view">' + fee_name.val() + '</div>' +
                '<div class="edit" style="display: none;">' +
                '<input type="text" name="additional_fees[' + last_additional_fees_num_of_rows + '][name]" value="' + fee_name.val() + '" placeholder="Fee name">' +
                '</div>' +
                '</td>' +
                '<td class="line_cost" colspan="4" style="text-align: right; width: 140px;">' +
                '<div class="view">' + get_formatted_price(fee_amount.val()) + '</div>' +
                '<div class="edit" style="display: none;">' +
                '<input type="text" name="additional_fees[' + last_additional_fees_num_of_rows + '][amount]" value="' + fee_amount.val() + '" class="line_total" placeholder="0">' +
                '</div>' +
                '</td>' +
                '<td class="wc-order-edit-line-item">' +
                '<div class="wc-order-edit-line-item-actions td_hover_visible_action">' +
                '<a class="edit-order-item" href="javascript:void(0)"><i class="fa fa-pencil" aria-hidden="true"></i></a>' +
                '<a class="delete_additional_fee" href="javascript:void(0)"><i class="fa fa-times deleteIco" aria-hidden="true"></i></a>' +
                '</div>' +
                '</td>' +
                '</tr>'
            );

            var fee_amount = fee_amount.val();
            fee_amount = parseFloat(fee_amount);

            var order_total = jQuery('#order_total').val();
            order_total = parseFloat(order_total) + parseFloat(fee_amount);

            jQuery('#order_total_view').html(get_formatted_price(order_total));
            jQuery('#order_total').val(order_total);

            jQuery("html, body").animate({scrollTop: jQuery('.additional-fees').offset().top - 100}, 1000);
        }
    });

    // calculate order item
    function calculate_order_item() {
        if (jQuery('.postbox_order_table table tbody tr.order-item-row').length > 0) {
            var shipping_cost = jQuery('#shipping_cost').val();
            var order_total = 0;
            var discount_total = 0;
            var coupon_discount_total = jQuery('#coupon_discount_total').val();

            var tax_amount = 0;
            var full_free = jQuery('#full_free').val();
            var set_timeout_val = 10;

            if(full_free != 1)
            {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', base_url + 'order/ajax_tax_calculate', true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.send(jQuery("#add_manual_order").serialize());
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        tax_amount = xhr.responseText;
                    }
                }

                set_timeout_val = 2000;
            }

            setTimeout(function () {
                jQuery('.order-items-summary').removeClass('loading');

                jQuery('.postbox_order_table table tbody tr.order-item-row').each(function () {
                    var this_parent = jQuery(this);

                    var quantity = parseInt(this_parent.find('input.quantity').val());
                    var cart_price = parseFloat(this_parent.find('input.price').val());
                    var cart_sale_price = parseFloat(this_parent.find('input.cart_sale_price').val());
                    var item_subtotal = parseFloat(this_parent.find('input.item_subtotal').val());
                    var item_total = parseFloat(this_parent.find('input.item_total').val());
                    var item_discount = 0;
                    var item_total_discount = 0;

                    if (item_total != item_subtotal) {
                        cart_sale_price = item_total / quantity;
                        item_discount = cart_price - cart_sale_price;

                        item_total_discount = (cart_price * quantity) - item_total;
                    } else {
                        item_total = cart_sale_price * quantity;
                    }

                    this_parent.find('.view').show();

                    this_parent.find('input.cart_sale_price').val(cart_sale_price);
                    this_parent.find('.item_cost .amount').html(get_formatted_price(cart_sale_price));

                    if (item_discount > 0) {
                        this_parent.find('.item_cost .discount').html('-' + get_formatted_price(item_discount));
                    }

                    this_parent.find('input.item_total').val(item_total);
                    this_parent.find('input.item_total').attr('data-item-total', item_total);
                    this_parent.find('.item_total_cost .amount').html(get_formatted_price(item_total));

                    if (item_total_discount > 0) {
                        this_parent.find('.item_total_cost .discount').html('-' + get_formatted_price(item_total_discount));

                        if (discount_total == 0) {
                            discount_total = item_total_discount;
                        } else {
                            discount_total = discount_total + item_total_discount;
                        }
                    }

                    if (order_total == 0) {
                        order_total = item_total;
                    } else {
                        order_total = order_total + item_total;
                    }

                    this_parent.find('.line_qty .view .qty').html(quantity);

                    this_parent.find('.edit').hide();
                });

                order_total = order_total + parseFloat(tax_amount) - parseFloat(coupon_discount_total);

                var additional_fee = 0;
                if (jQuery('.additional-fee-item').length > 0) {
                    jQuery('.additional-fee-item .line_total').each(function () {
                        additional_fee = jQuery(this).val();
                    });
                }

                order_total = order_total + parseFloat(additional_fee);

                if (full_free == 1) {
                    order_total = 0;
                    shipping_cost = 0;
                }

                jQuery('#order_total_view').html(get_formatted_price(parseFloat(order_total) + parseFloat(shipping_cost)));
                jQuery('#order_total').val(parseFloat(order_total) + parseFloat(shipping_cost));
                jQuery('#tax_amount_view').html(get_formatted_price(tax_amount));

                discount_total = discount_total + parseFloat(coupon_discount_total);

                if (discount_total > 0) {
                    jQuery('.order-items-summary .order-total-discount').show();
                    jQuery('#discount_total_view').html(get_formatted_price(discount_total));
                    jQuery('#discount_total').val(discount_total);
                }

            }, set_timeout_val);
        }
    }

    // calculate subscription item
    function calculate_subscription_item() {
        if (jQuery('.postbox_order_table table tbody tr.order-item-row').length > 0) {
            var shipping_cost = jQuery('#shipping_cost').val();
            var order_total = 0;
            var discount_total = 0;

            var tax_amount = 0;
            var full_free = jQuery('input[name=full_free]').val();
            var set_timeout_val = 10;

            if(full_free != 1)
            {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', base_url + 'subscription/ajax_tax_calculate', true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.send(jQuery("#add_manual_order").serialize());
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        tax_amount = xhr.responseText;
                    }
                }

                set_timeout_val = 2000;
            }

            setTimeout(function () {
                jQuery('.order-items-summary').removeClass('loading');

                jQuery('.postbox_order_table table tbody tr.order-item-row').each(function () {
                    var this_parent = jQuery(this);

                    var item_qty = parseInt(this_parent.find('input.item_qty').val());
                    var item_price = parseFloat(this_parent.find('input.price').val());
                    var sale_price = parseFloat(this_parent.find('input.sale_price').val());
                    var item_subtotal = parseFloat(this_parent.find('input.item_subtotal').val());
                    var item_total = parseFloat(this_parent.find('input.item_total').val());
                    var item_discount = 0;
                    var item_total_discount = 0;

                    if (item_total != item_subtotal) {
                        sale_price = item_total / item_qty;
                        item_discount = item_price - sale_price;

                        item_total_discount = (item_price * item_qty) - item_total;
                    } else {
                        item_total = sale_price * item_qty;
                    }

                    this_parent.find('.view').show();

                    this_parent.find('input.sale_price').val(sale_price);
                    this_parent.find('.item_cost .amount').html(get_formatted_price(sale_price));

                    if (item_discount > 0) {
                        this_parent.find('.item_cost .discount').html('-' + get_formatted_price(item_discount));
                    }

                    this_parent.find('input.item_total').val(item_total);
                    this_parent.find('input.item_total').attr('data-item-total', item_total);
                    this_parent.find('.item_total_cost .amount').html(get_formatted_price(item_total));

                    if (item_total_discount > 0) {
                        this_parent.find('.item_total_cost .discount').html('-' + get_formatted_price(item_total_discount));

                        if (discount_total == 0) {
                            discount_total = item_total_discount;
                        } else {
                            discount_total = discount_total + item_total_discount;
                        }
                    }

                    if (order_total == 0) {
                        order_total = item_total;
                    } else {
                        order_total = order_total + item_total;
                    }

                    this_parent.find('.line_qty .view .qty').html(item_qty);

                    this_parent.find('.edit').hide();
                });

                order_total = order_total + parseFloat(tax_amount);

                var additional_fee = 0;
                if (jQuery('.additional-fee-item').length > 0) {
                    jQuery('.additional-fee-item .line_total').each(function () {
                        additional_fee = jQuery(this).val();
                    });
                }

                order_total = order_total + parseFloat(additional_fee);

                if (full_free == 1) {
                    order_total = 0;
                }

                jQuery('#order_total_view').html(get_formatted_price(parseFloat(order_total) + parseFloat(shipping_cost)));
                jQuery('#order_total').val(parseFloat(order_total) + parseFloat(shipping_cost));
                jQuery('#tax_amount_view').html(get_formatted_price(tax_amount));

                if (discount_total > 0) {
                    jQuery('.order-items-summary .order-total-discount').show();
                    jQuery('#discount_total_view').html(get_formatted_price(discount_total));
                    jQuery('#discount_total').val(discount_total);
                }

            }, set_timeout_val);
        }
    }

    // order refund action
    jQuery('body').on('click', '.order_refund_action_btn', function () {
        jQuery('table tr.refund').show('slow');
        jQuery('table td .refund').show();
        jQuery('.order_refund_cancel_btn').show();
        jQuery('.order_refund_save_btn').show();
        jQuery('.order_refund_action_btn').hide();
        jQuery('.order_review_summary').hide();
    });

    // order refund cancel
    jQuery('body').on('click', '.order_refund_cancel_btn', function () {
        jQuery('table tr.refund').hide();
        jQuery('table td .refund').hide();
        jQuery('.order_refund_cancel_btn').hide();
        jQuery('.order_refund_save_btn').hide();
        jQuery('.order_refund_action_btn').show();
        jQuery('.order_review_summary').show('slow');
    });

    // on change full refund
    jQuery('body').on('change', '#full_refund', function () {
        var full_refund = jQuery(this).is(':checked') ? 'yes' : 'no';

        if (full_refund == 'yes') {
            // change shipping cost
            var max_shipping_cost = jQuery('.refund_shipping_cost').attr('data-max-shipping-cost');
            max_shipping_cost = max_shipping_cost != '' ? parseFloat(max_shipping_cost) : 0;

            jQuery('.refund_shipping_cost').val(max_shipping_cost);
            jQuery('.refund_shipping_cost').trigger('change');

            // change shipping tax
            var max_shipping_tax = jQuery('.refund_shipping_tax').attr('data-max-shipping-tax');
            max_shipping_tax = max_shipping_tax != '' ? parseFloat(max_shipping_tax) : 0;

            jQuery('.refund_shipping_tax').val(max_shipping_tax);
            jQuery('.refund_shipping_tax').trigger('change');

            // change line items data
            jQuery('.refund_order_item_qty').each(function () {
                var item_max_qty = jQuery(this).attr('max');
                item_max_qty = item_max_qty != '' ? parseInt(item_max_qty) : 0;

                jQuery(this).val(item_max_qty);
                jQuery(this).trigger('change');
            });
        } else {
            /*// change shipping cost
            jQuery('.refund_shipping_cost').val('');
            jQuery('.refund_shipping_cost').trigger('change');

            // change shipping tax
            jQuery('.refund_shipping_tax').val('');
            jQuery('.refund_shipping_tax').trigger('change');

            // change line items data
            jQuery('.refund_order_item_qty').val(0);
            jQuery('.refund_order_item_qty').trigger('change');*/

            unchecked_refund_items();
        }
    });

    // un-checked all refund items
    function unchecked_refund_items() {
        // change shipping cost
        jQuery('.refund_shipping_cost').val('');
        jQuery('.refund_shipping_cost').trigger('change');

        // change shipping tax
        jQuery('.refund_shipping_tax').val('');
        jQuery('.refund_shipping_tax').trigger('change');

        // change line items data
        jQuery('.refund_order_item_qty').val(0);
        jQuery('.refund_order_item_qty').trigger('change');
    }

    // on change line item refund amount
    jQuery('body').on('change paste', '.refund_line_total', function () {
        calculate_all_refunded_amount();
    });

    // on change line item refund tax
    jQuery('body').on('change paste', '.refund_line_tax_amount', function () {
        var refund_item_tax_amount = jQuery(this).val();
        refund_item_tax_amount = refund_item_tax_amount != '' ? parseFloat(refund_item_tax_amount) : 0;

        var max_item_tax_amount = jQuery(this).attr('data-max-item-tax-amount');
        max_item_tax_amount = max_item_tax_amount != '' ? parseFloat(max_item_tax_amount) : 0;

        var go_ahead = 1;

        /*if (max_item_tax_amount <= 0) {
            var go_ahead = 0;
            jQuery(this).val(0);
        } else if (max_item_tax_amount < refund_item_tax_amount) {
            var go_ahead = 1;
            jQuery(this).val(max_item_tax_amount);
            alert('You have cross TAX amount to refund!');
        }*/

        if (go_ahead == 1) {
            calculate_all_refunded_amount();
        }
        return false;
    });

    // on change refunded qty
    jQuery('body').on('change paste', '.refund_order_item_qty', function () {
        var item_qty = jQuery(this).val();
        item_qty = item_qty != '' ? parseInt(item_qty) : 0;

        if (!jQuery.isNumeric(item_qty)) {
            jQuery(this).val('');
            return false;
        }

        var item_max_qty = jQuery(this).attr('max');
        item_max_qty = item_max_qty != '' ? parseInt(item_max_qty) : 0;

/*        var item_subtotal = jQuery(this).parents('tr').find('.line_cost').attr('data-line-subtotal');
        item_subtotal = item_subtotal != '' ? parseFloat(item_subtotal) : 0;*/

        var item_price_with_discount = jQuery(this).parents('tr').find('.line_cost').attr('data-line-price-with-discount');
        item_price_with_discount = item_price_with_discount != '' ? parseFloat(item_price_with_discount) : 0;

        var item_total = parseInt(item_qty) * parseFloat(item_price_with_discount);
        item_total = item_total != '' ? parseFloat(item_total) : 0;

        var max_item_tax_amount = jQuery(this).parents('tr').find('.refund_line_tax_amount').attr('data-max-item-tax-amount');
        max_item_tax_amount = max_item_tax_amount != '' ? parseFloat(max_item_tax_amount) : 0;

        var refund_line_tax_amount = parseFloat(max_item_tax_amount / item_max_qty) * item_qty;

        if (item_qty > item_max_qty) {
            jQuery(this).val('');
            jQuery(this).parents('tr').find('.refund_line_total').val('');
            jQuery(this).parents('tr').find('.refund_line_tax_amount').val('');
            alert('You are not allowed to refund more than ' + item_max_qty);
        } else {
            jQuery(this).parents('tr').find('.refund_line_total').val(item_total);
            jQuery(this).parents('tr').find('.refund_line_tax_amount').val($.number(refund_line_tax_amount, 2));
            calculate_all_refunded_amount();
        }
        return false;
    });

    // on change refund shipping cost
    jQuery('body').on('change paste', '.refund_shipping_cost', function () {
        var refund_shipping_cost = jQuery(this).val();
        refund_shipping_cost = refund_shipping_cost != '' ? parseFloat(refund_shipping_cost) : 0;

        var max_shipping_cost = jQuery(this).attr('data-max-shipping-cost');
        max_shipping_cost = max_shipping_cost != '' ? parseFloat(max_shipping_cost) : 0;

        var go_ahead = 1;

        if (max_shipping_cost <= 0) {
            go_ahead = 0;
            jQuery(this).val(0);
        } else if (refund_shipping_cost > max_shipping_cost) {
            go_ahead = 1;
            alert('You have cross shipping amount to refund!');
            jQuery(this).val(max_shipping_cost);
        }

        if (go_ahead == 1) {
            calculate_all_refunded_amount();
        }
        return false;
    });

    // on change refund shipping tax amount
    jQuery('body').on('change paste', '.refund_shipping_tax', function () {
        var refund_shipping_tax = jQuery(this).val();
        refund_shipping_tax = refund_shipping_tax != '' ? parseFloat(refund_shipping_tax) : 0;

        var max_shipping_tax = jQuery(this).attr('data-max-shipping-tax');
        max_shipping_tax = max_shipping_tax != '' ? parseFloat(max_shipping_tax) : 0;

        var go_ahead = 1;

        /*if (max_shipping_tax <= 0) {
            go_ahead = 0;
            jQuery(this).val(0);
        } else if (max_shipping_tax < refund_shipping_tax) {
            go_ahead = 1;
            jQuery(this).val(max_shipping_tax);
            alert('You have cross shipping TAX amount to refund!');
        }*/

        if (go_ahead == 1) {
            calculate_all_refunded_amount();
        }
        return false;
    });

    // on change refunded amount
    jQuery('body').on('input change keyup paste', '#refund_amount', function () {
        var order_total = parseFloat(jQuery('#order_total').val());
        var refunded_amount = parseFloat(jQuery('#refunded_amount').val());
        var refund_amount = jQuery('#refund_amount').val();
        var refunded_total = $.number((refunded_amount + parseFloat(refund_amount)), 2);
        var allowed_amount = $.number((order_total - refunded_amount), 2);

        unchecked_refund_items();

        if (order_total < refunded_total) {
            jQuery('#refund_amount').val(allowed_amount);
            jQuery('.order_refund_save_btn .refunded_amount').text(get_formatted_price(allowed_amount));
            alert('You are not allowed to refund more than ' + allowed_amount);
        } else {
            jQuery('#refund_amount').val(refund_amount);
            jQuery('.order_refund_save_btn .refunded_amount').text(get_formatted_price(refund_amount));
        }
    });

    // function to sum all refunded amount
    function calculate_all_refunded_amount() {
        var order_total = parseFloat(jQuery('#order_total').val());
        var refunded_amount = parseFloat(jQuery('#refunded_amount').val());

        var refund_shipping_cost = jQuery('input[name=refund_shipping_cost]').val();
        refund_shipping_cost = refund_shipping_cost != '' ? refund_shipping_cost : 0;

        var refund_shipping_tax = jQuery('input[name=refund_shipping_tax]').val();
        refund_shipping_tax = refund_shipping_tax != '' ? refund_shipping_tax : 0;

        // calculate per item refund amount
        var total_refund_amount = 0;
        jQuery('.refund_line_total').each(function () {
            var refund_line_total = jQuery(this).val();

            if (refund_line_total) {
                total_refund_amount += parseFloat(refund_line_total);
            }
        });

        // calculate per item refund tax amount
        var total_refund_tax_amount = 0;
        jQuery('.refund_line_tax_amount').each(function () {
            var refund_line_tax_amount = jQuery(this).val();

            if (refund_line_tax_amount) {
                total_refund_tax_amount += parseFloat(refund_line_tax_amount);
            }
        });

        var calculated_refund_total = parseFloat(total_refund_amount) + parseFloat(total_refund_tax_amount) + parseFloat(refund_shipping_cost) + parseFloat(refund_shipping_tax);
        var calculated_refund_total = $.number(calculated_refund_total, 2);
        var refunded_total = $.number((parseFloat(refunded_amount) + calculated_refund_total), 2);
        var allowed_amount = $.number((parseFloat(order_total) - parseFloat(refunded_amount)), 2);

        setTimeout(function () {
            full_refund_prop_checked(order_total, refunded_total)
        }, 500);
        setTimeout(function () {
            full_refund_prop_checked(order_total, refunded_total)
        }, 1000);
        setTimeout(function () {
            full_refund_prop_checked(order_total, refunded_total)
        }, 2000);

        if (order_total < refunded_total) {
            jQuery('#refund_amount').val(allowed_amount);
            jQuery('.order_refund_save_btn .refunded_amount').text(get_formatted_price(allowed_amount));
            alert('You are not allowed to refund more than ' + allowed_amount);
        } else {
            jQuery('#refund_amount').val(calculated_refund_total);
            jQuery('.order_refund_save_btn .refunded_amount').text(get_formatted_price(calculated_refund_total));
            return calculated_refund_total;
        }
    }

    function full_refund_prop_checked(order_total, refunded_total) {
        if (order_total != refunded_total) {
            jQuery('#full_refund').prop('checked', false);
        } else {
            jQuery('#full_refund').prop('checked', true);
        }
    }

    /*### order ###*/
    // add order note
    jQuery('body').on('click', '.add_order_note', function () {
        var note = jQuery('#note').val();
        var note_type = jQuery('#note_type').val();
        var order_id = jQuery('input[name=order_id]').val();

        if (note != '' && order_id != '') {
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: base_url + 'order/ajax_add_order_note',
                data:
                    {
                        'note': note,
                        'note_type': note_type,
                        'order_id': order_id,
                    },
                success: function (data) {
                    if (data.response == true) {
                        jQuery('ul.order_notes').html(data.html);
                        jQuery('#note').val('');
                    }
                }
            });
        }

        return false;
    });

    // delete order note
    jQuery('body').on('click', '.delete_order_note', function () {
        if (confirm('Are you sure to delete?')) {
            var noteid = jQuery(this).attr('data-noteid');

            jQuery('ul.order_notes .noteid-' + noteid).remove();

            if (noteid != 0) {
                jQuery.ajax({
                    url: base_url + 'order/ajax_delete_order_note/?noteid=' + noteid
                });
            }
        } else
        {
            return false;
        }
    });

    /*### subscription ###*/
    // apply subscription item
    jQuery('.btn.apply_subscription_item').on('click', function (e) {
        if (jQuery('.meal-items tr.meal_item').length > 0)
        {
            if (jQuery('.meal-items tr.meal_item input[type=checkbox]:checked').length <= 0)
            {
                alert('You must select meal items!');
                return false;
            }

            if (jQuery('.order_review_table tbody .order-item-row').length > 0)
            {
                alert('You are not able to select one more meal plane at a time!\nRemove previous item to select another plane.');
                return false;
            }
        }

        var site = jQuery('#site option:selected').val();
        var item_id = jQuery('#item_id option:selected').val();
        var item_qty = jQuery('#item_qty').val();

        var already_exist = false;

        if (parseInt(item_id) > 0) {
            if (jQuery('.order-item-row.item-row-' + item_id).length > 0) {
                var old_item_qty = jQuery('.order-item-row.item-row-' + item_id + ' input.item_qty_' + item_id).val();

                item_qty = parseInt(old_item_qty) + parseInt(item_qty);

                already_exist = true;
            }

            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: base_url + 'subscription/ajax_apply_subscription_item',
                data: {
                    'site': site,
                    'item_id': parseInt(item_id),
                    'item_qty': parseInt(item_qty)
                },
                success: function (data) {
                    if (already_exist == true) {
                        jQuery('.order-item-row.item-row-' + item_id).remove();
                    }

                    jQuery('.order_review_table tbody').append(data.html);

                    jQuery('.order-bulk-action-box .btn.cancel_order_item').show();

                    jQuery("html, body").animate({scrollTop: jQuery('.postbox_order_table').offset().top}, 1000);
                }
            });
        } else {
            alert('No product selected!');
        }
    });

    // save subscription item changes
    jQuery('body').on('click', '.order-bulk-action-box .btn.save_subscription_item', function () {
        jQuery('.add-product-box').hide();
        jQuery('.order-bulk-action-box .btn.cancel_order_item').hide();
        jQuery('.order-items-summary').addClass('loading');

        calculate_subscription_item();
    });

    // add subscription note
    jQuery('body').on('click', '.add_subscription_note', function () {
        var note = jQuery('#note').val();
        var note_type = jQuery('#note_type').val();
        var subscription_id = jQuery('input[name=subscription_id]').val();

        if (note != '' && subscription_id != '') {
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: base_url + 'subscription/ajax_add_subscription_note',
                data:
                    {
                        'note': note,
                        'note_type': note_type,
                        'subscription_id': subscription_id,
                    },
                success: function (data) {
                    if (data.response == true) {
                        jQuery('ul.order_notes').html(data.html);
                        jQuery('#note').val('');
                    }
                }
            });
        }

        return false;
    });

    // delete subscription note
    jQuery('body').on('click', '.delete_subscription_note', function () {
        if (confirm('Are you sure to delete?')) {
            var noteid = jQuery(this).attr('data-noteid');

            jQuery('ul.order_notes .noteid-' + noteid).remove();

            if (noteid != 0) {
                jQuery.ajax({
                    url: base_url + 'subscription/ajax_delete_subscription_note/?noteid=' + noteid
                });
            }
        } else
        {
            return false;
        }
    });

    /*### product variations ###*/
    // variation collaps content
    jQuery('body').on('click', '.variations .variation .variation_collaps a.collaps', function () {
        jQuery(this).toggleClass('active');

        jQuery(this).parents('.variation').find('.variation-content').toggleClass('show');
    });

    // remove
    jQuery('body').on('click', '.variations .variation a.remove_variation', function (e) {
        e.preventDefault();

        if (confirm('Are you sure to remove this variation?')) {
            var product_id = jQuery(this).attr('data-product-id');
            var variation_id = jQuery(this).attr('data-variation-id');

            if (typeof variation_id !== 'undefined') {
                jQuery.ajax({
                    url: base_url + 'product/remove_variation/?product_id=' + product_id + '&variation_id=' + variation_id
                });
            }

            if (parseInt(jQuery('.variation').length) - 1 <= 0) {
                jQuery('.variations-panel .inside').html('');
                jQuery('.variations').remove();
            }

            jQuery(this).parents('.variation').remove();
        }

        return false;
    });

    // add
    jQuery('body').on('click', 'a.add_variation', function () {
        jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            url: base_url + 'product/add_variation',
            data:
                {
                    'current_variation_total': parseInt(jQuery('.variation').length)
                },
            beforeSend: function (data) {
                jQuery('body').append('<div id="overlay"></div>');

                jQuery('#overlay').append('<span class="loader" style="background-size:100px;position:absolute;width:50px;height:50px;left:50%;top:50%;border-radius:50%;background-position:-26px -3px;"></span>');
            },
            success: function (data) {
                setTimeout(function () {
                    jQuery('#overlay').remove();

                }, 500);

                if (jQuery('.variations').length <= 0) {
                    jQuery('.variations-panel .inside').html('<div class="variations"></div>');
                }

                jQuery('.variations').append(data.html);

                jQuery('body .select2').select2();

                jQuery("html, body").animate({scrollTop: jQuery('.postbox-subscription').offset().top - 550}, 1000);
            }
        });
    });

    // show hide product parent variation box
    jQuery('body').on('click', '.is_parent', function () {
        if (jQuery(this).is(':checked')) {
            jQuery(this).parents('.variation').find('.parent-variation-box').show();
        } else {
            jQuery(this).parents('.variation').find('.parent-variation-box').hide();
        }
    });

    // show hide quantity field
    jQuery('body').on('click', '.manage_stock', function () {
        if (jQuery(this).is(':checked')) {
            jQuery(this).parents('.variation').find('.stock-quantity-field-box').show();
            jQuery(this).parents('.variation').find('.stock-status-field-box').hide();
        } else {
            jQuery(this).parents('.variation').find('.stock-quantity-field-box').hide();
            jQuery(this).parents('.variation').find('.stock-status-field-box').show();
        }
    });

    /*### bundle product variations ###*/
    // remove
    jQuery('body').on('click', '.variations .variation a.remove_bundle_variation', function (e) {
        e.preventDefault();

        if (confirm('Are you sure to remove this variation?')) {
            var product_id = jQuery(this).attr('data-product-id');
            var variation_id = jQuery(this).attr('data-variation-id');

            if (typeof variation_id !== 'undefined') {
                jQuery.ajax({
                    url: base_url + 'bundle_product/remove_variation/?product_id=' + product_id + '&variation_id=' + variation_id
                });
            }

            if (parseInt(jQuery('.variation').length) - 1 <= 0) {
                jQuery('.variations-panel .inside').html('');
                jQuery('.variations').remove();
            }

            jQuery(this).parents('.variation').remove();
        }

        return false;
    });

    // add
    jQuery('body').on('click', 'a.add_bundle_variation', function () {
        jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            url: base_url + 'bundle_product/add_variation',
            data:
                {
                    'current_variation_total': parseInt(jQuery('.variation').length)
                },
            beforeSend: function (data) {
                jQuery('body').append('<div id="overlay"></div>');

                jQuery('#overlay').append('<span class="loader" style="background-size:100px;position:absolute;width:50px;height:50px;left:50%;top:50%;border-radius:50%;background-position:-26px -3px;"></span>');
            },
            success: function (data) {
                setTimeout(function () {
                    jQuery('#overlay').remove();

                }, 500);

                if (jQuery('.variations').length <= 0) {
                    jQuery('.variations-panel .inside').html('<div class="variations"></div>');
                }

                jQuery('.variations').append(data.html);

                jQuery('body .select2').select2();

                jQuery("html, body").animate({scrollTop: jQuery('.postbox-subscription').offset().top}, 1000);
            }
        });
    });
});

/*### instant product file upload ####*/
function imageIsLoaded(e) {
    $('.imgbox.active .previewing').html('<img src="' + e.target.result + '">');
    $(".imgbox").removeClass("active");
};

// on click file upload #
$(document).ready(function (e) {
// function to preview image after validation
    $("body").on('click', '.selectimage', function () {
        $(this).parent().find('input.prodimg').trigger("click");
//$(this).parent().addClass("active");
    });

    $(function () {
        $("body").on('change', 'input.prodimg', function () {
            var file = this.files[0];
            var imagefile = file.type;
            var match = ["image/jpeg", "image/png", "image/jpg"];

            if (!((imagefile == match[0]) || (imagefile == match[1]) || (imagefile == match[2]))) {
                alert('Please select a valid image. Note: Only jpeg, jpg and png are allowed');
                $(".imgbox").removeClass("active");
                return false;
            } else {
                $(this).parent().addClass("active");
                var reader = new FileReader();
                reader.onload = imageIsLoaded;
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
});

// drag and drop file upload
$(document).on('dragenter', '.imgbox', function () {
//$(this).css('border', '3px dashed red');
    return false;
});

$(document).on('dragover', '.imgbox', function (e) {
    e.preventDefault();
    e.stopPropagation();
//$(this).css('border', '3px dashed red');
    return false;
});

$(document).on('dragleave', '.imgbox', function (e) {
    e.preventDefault();
    e.stopPropagation();
// $(this).css('border', '3px dashed #BBBBBB');
    return false;
});

$(document).on('drop', '.imgbox', function (e) {
    if (e.originalEvent.dataTransfer) {
        if (e.originalEvent.dataTransfer.files.length) {
            // stop the propagation of the event
            e.preventDefault();
            e.stopPropagation();

            $(this).find('input.prodimg').prop("files", e.originalEvent.dataTransfer.files);
            $(this).addClass("active");

            $("#message").empty();
            //var file = this.files[0];
            var file = e.originalEvent.dataTransfer.files[0];
            var imagefile = file.type;
            var match = ["image/jpeg", "image/png", "image/jpg"];

            if (!((imagefile == match[0]) || (imagefile == match[1]) || (imagefile == match[2]))) {
                $('#previewing').attr('src', 'noimage.png');
                $("#message").html("<p id='error'>Please Select A valid Image File</p>" + "<h4>Note</h4>" + "<span id='error_message'>Only jpeg, jpg and png Images type allowed</span>");
                return false;
            } else {
                var reader = new FileReader();
                reader.onload = imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }
    }

    return false;
});

// add product image
function add_product_image() {
    if (!jQuery('.postbox-product-image>.inside .imgbox.fullbox').length) {
        var attribute_item_html = '<div class="imgbox fullbox"><div class="selectimage"><div class="previewing"><img src="' + base_url + 'assets/media/product/list/nophoto.jpg"></div></div><input type="file" name="product_image" class="prodimg"><a href="javascript:void(0)" class="close-product-gallery"><i class="fa fa-times-circle" aria-hidden="true"></i></a></div>';

        jQuery('.postbox-product-image>.inside').prepend(attribute_item_html);

        jQuery('.postbox-product-image .add-more-gallery').hide();
    } else {
        jQuery('.postbox-product-image .add-more-gallery').show();
    }
}

// add more gallery
function add_product_gallery_images() {
    var current_gallery_id = jQuery('#current_gallery_id').val();
    var next_current_gallery_id = parseInt(current_gallery_id) + 1;

    var attribute_item_html = '<div class="col-lg-3 imgbox"><div class="selectimage"><div class="previewing"><img src="' + base_url + 'assets/media/product/thumbs/nophoto.jpg"></div></div><input type="file" name="product_gallery[]" class="prodimg"><a href="javascript:void(0)" class="close-product-gallery"><i class="fa fa-times-circle" aria-hidden="true"></i></a></div>';

    jQuery('.postbox-product-gallery>.inside>.row.row5').append(attribute_item_html);

    jQuery('#current_gallery_id').val(next_current_gallery_id);
}

// remove gallery
jQuery(document).ready(function () {
    jQuery('body, document').on('click', '.close-product-gallery', function () {

        if (confirm('Are you confirm to remove?'))
        {
            var product_id = jQuery(this).attr('data-product-id');
            var gallery_id = jQuery(this).attr('data-gallery-id');
            var type = jQuery(this).attr('data-type');

            if (typeof gallery_id !== 'undefined') {
                jQuery.ajax({
                    url: base_url + 'product/remove_product_gallery/?product_id=' + product_id + '&gallery_id=' + gallery_id + '&type=' + type
                });
            }

            jQuery(this).parent().remove();

            jQuery('.postbox-product-image .add-more-gallery').show();
        }
    });

// tinymce editor
    tinymce.init({
        mode: "textareas",
        extended_valid_elements: 'span',
        theme: "modern",
//            height: 250,
        branding: false,
        editor_selector: "mceEditor",
        plugins: 'print preview autolink fullscreen image link media template code spellchecker table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help responsivefilemanager',
//        plugins: [
//            "advlist autolink link image lists charmap print preview anchor",
//            "searchreplace visualblocks code fullscreen",
//            "table insertdatetime contextmenu media paste responsivefilemanager"
//        ],
        image_advtab: true,
        toolbar: "undo redo | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat |  image | preview code",
        //toolbar: "undo redo | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat |  image responsivefilemanager | preview code",
        convert_urls: false, // relative URl removed
        menubar: false
        // deaful p removed
//        force_br_newlines: true,
//        force_p_newlines: false,
//        forced_root_block: '', // Needed for 3.x

//        external_filemanager_path: base_url + "filemanager/",
//        filemanager_title: "Filemanager",
//        external_plugins: {"filemanager": base_url + "filemanager/plugin.min.js"},
//        content_css: [
//            '//www.tinymce.com/css/codepen.min.css'
//        ]
    });

// select all
    $('.selectall').click(function (e) {
        var table = $(e.target).closest('table');
        $('input:checkbox', table).prop('checked', this.checked);
    });

    $('table .cus-checkbox input[type=checkbox]').click(function (e) {
        var total_checkbox = jQuery(this).parents('tbody').find('input[type=checkbox]').length;
        var total_selected_checkbox = jQuery(this).parents('tbody').find('input[type=checkbox]:checked').length;

        if (total_checkbox != total_selected_checkbox) {
            jQuery('table .selectall').prop('checked', false);
        }
// else
// {
//     jQuery('table .selectall').prop('checked', true);
// }
    });
});

jQuery(document).ready(function ()
{
    $(".slug_link_edit").click(function () {
        $(this).addClass("slug_link_edit_none");
        $('.slug_link_edit_hide').addClass("slug_link_edit_show");
    });
    $(".slug_link_cancel").click(function () {
        $('.slug_link_edit_hide').removeClass("slug_link_edit_show");
        $('.slug_link_edit').removeClass("slug_link_edit_none");
    });

    /*### ajax user search ###*/
    $('.ajax_user_search').select2({
        minimumInputLength: 3,
        ajax: {
            url: base_url + 'users/ajax_get_user_list',
            dataType: 'json',
            data: function (params)
            {
                var role = $(this).attr('data-role');

                var query = {
                    search: params.term,
                    role: role
                }

                return query;
            },
            processResults: function (data)
            {
                return {results: data}
            }
        }
    });

    /*### ajax followup customer search ###*/
    $('.ajax_followup_customer_search').select2({
        minimumInputLength: 3,
        ajax: {
            url: base_url + 'users/ajax_get_followup_customer_list',
            dataType: 'json',
            data: function (params)
            {
                var query = {
                    search: params.term
                }

                return query;
            },
            processResults: function (data)
            {
                return {results: data}
            }
        }
    });
});

// sticky sidebar
var a = new StickySidebar('#adminmenumain', {
    topSpacing: -30,
    bottomSpacing: 30,
    containerSelector: '#wpwrap',
    innerWrapperSelector: '.left_bar'
});

// mobile toggle show / hide menu
if (jQuery(window).width() <= 767) {
    jQuery("#adminmenuback").hide();
}

jQuery(".m_menu_show_hide").click(function () {
    jQuery("#adminmenuback").toggle();
    jQuery("#adminmenumain").toggleClass("adminmenumain_show");
});

// text and visual editor show on tinymce
$.fn.extend({
    insertAtCaret: function(myValue) {
        this.each(function() {
            if (document.selection) {
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) +
                    myValue + this.value.substring(endPos,this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
        return this;
    }
});

function getSelectedText() {
    if (window.getSelection) {
        try {
            var ta = jQuery('textarea').get(0);
            return ta.value.substring(ta.selectionStart, ta.selectionEnd);
        } catch (e) {
            console.log('Cant get selection text')
        }
    }

    // for ie
    if (document.selection && document.selection.type != "Control") {
        return document.selection.createRange().text;
    }
}

jQuery('.mceEditor').mouseup(function () {
    var selected_text = getSelectedText().toString();
    localStorage.setItem('selected_text', selected_text);
});

jQuery(document).ready(function () {
    setTimeout(function () {
        var editor_format = localStorage.getItem('editor_format');
        if(editor_format)
        {
            jQuery('textarea.mceEditor').each(function () {
                var editor_id = jQuery(this).attr('id');
                if(editor_id)
                {
                    if(editor_format.toLowerCase() == 'text')
                    {
                        jQuery('.editor-tags-generate').show();

                        jQuery('.btn-editor-format').attr('data-editor-label', 'Visual');
                        jQuery('.btn-editor-format').text('Visual');

                        tinymce.execCommand('mceToggleEditor', false, editor_id);
                    }
                }
            });
        }
    }, 500);

    jQuery('textarea.mceEditor').each(function () {
        var editor_id = jQuery(this).attr('id');
        if (editor_id) {
            var editor_related_html = '<div class="editor-format-area">\n' +
                '                    <div class="editor-format-btn pull-right">\n' +
                '                        <button class="btn-editor-format admin_cus_btn" data-editor-label="Text">Text</button>\n' +
                '                    </div>\n' +
                '                    <div class="editor-tags-generate" style="display:none;">\n' +
                '                        <button class="btn-strong-tag admin_cus_btn">strong</button>\n' +
                '                        <button class="btn-b-tag admin_cus_btn">b</button>\n' +
                '                        <button class="btn-i-tag admin_cus_btn">i</button>\n' +
                '                        <button class="btn-p-tag admin_cus_btn">p</button>\n' +
                '                        <button class="btn-div-tag admin_cus_btn">div</button>\n' +
                '                        <button class="btn-span-tag admin_cus_btn">span</button>\n' +
                '                        <button class="btn-small-tag admin_cus_btn">small</button>\n' +
                '                        <button class="btn-h1-tag admin_cus_btn">h1</button>\n' +
                '                        <button class="btn-h2-tag admin_cus_btn">h2</button>\n' +
                '                        <button class="btn-ul-tag admin_cus_btn">ul</button>\n' +
                '                        <button class="btn-ol-tag admin_cus_btn">ol</button>\n' +
                '                        <button class="btn-li-tag admin_cus_btn">li</button>\n' +
                '                        <button class="btn-code-tag admin_cus_btn">code</button>\n' +
                '                    </div>\n' +
                '                </div>';
            jQuery('#' + editor_id).before(editor_related_html);
            jQuery('#' + editor_id).parent().addClass('mce-editor-parent-box');
        }
    });

    jQuery('.btn-editor-format').on('click', function () {
        var editor_id = jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').attr('id');

        var editor_label = jQuery(this).attr('data-editor-label').toLowerCase();
        localStorage.setItem('editor_format', editor_label);

        if (editor_label == 'text') {
            jQuery(this).parents('.mce-editor-parent-box').find('.editor-tags-generate').show();

            jQuery(this).attr('data-editor-label', 'Visual');
            jQuery(this).text('Visual');
        } else {
            jQuery(this).parents('.mce-editor-parent-box').find('.editor-tags-generate').hide();

            jQuery(this).attr('data-editor-label', 'Text');
            jQuery(this).text('Text');
        }

        tinymce.execCommand('mceToggleEditor', false, editor_id);
        return false;
    });

    jQuery('.btn-strong-tag').on('click', function () {
        var insert_val = '<strong></strong>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<strong>' + selected_text + '</strong>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-b-tag').on('click', function () {
        var insert_val = '<b></b>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<b>' + selected_text + '</b>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-i-tag').on('click', function () {
        var insert_val = '<em></em>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<em>' + selected_text + '</em>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-p-tag').on('click', function () {
        var insert_val = '<p></p>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<p>' + selected_text + '</p>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-div-tag').on('click', function () {
        var insert_val = '<div></div>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<div>' + selected_text + '</div>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-span-tag').on('click', function () {
        var insert_val = '<span></span>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<span>' + selected_text + '</span>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-small-tag').on('click', function () {
        var insert_val = '<small></small>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<small>' + selected_text + '</small>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-h1-tag').on('click', function () {
        var insert_val = '<h1></h1>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<h1>' + selected_text + '</h1>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-h2-tag').on('click', function () {
        var insert_val = '<h2></h2>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<h2>' + selected_text + '</h2>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-ul-tag').on('click', function () {
        var insert_val = '<ul></ul>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<ul>' + selected_text + '</ul>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-ol-tag').on('click', function () {
        var insert_val = '<ol></ol>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<ol>' + selected_text + '</ol>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-li-tag').on('click', function () {
        var insert_val = '<li></li>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<li>' + selected_text + '</li>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('.btn-code-tag').on('click', function () {
        var insert_val = '<code></code>';

        var selected_text = localStorage.getItem('selected_text');
        if (selected_text) {
            var insert_val = '<code>' + selected_text + '</code>';
            localStorage.setItem('selected_text', '');
        }

        jQuery(this).parents('.mce-editor-parent-box').find('.mceEditor').insertAtCaret(insert_val);
        return false;
    });

    jQuery('input[type=submit], button[type=submit]').on('click', function () {
        if (jQuery('.mceEditor').length > 0) {
            jQuery('.mceEditor').each(function () {
                var editor_id = jQuery(this).attr('id');
                if (editor_id) {
                    tinymce.execCommand('mceToggleEditor', true, editor_id);
                }
            });
        }
    });
});

<?php
$payout_type = $this->input->get('payout_type');
$order_type  = $this->input->get('order_type');
//$this->load->view('commission/running_commission_nav_links');
?>

<div class="row">
    <div class="col-md-12">
        <div class="tablenav top">
            <div class="float-left">
            </div>
            <div class="float-right tablenav-pages">
                <span class="displaying-num"><?php echo $total; ?> items</span>
                <nav aria-label="Page navigation example">
                    <?php // echo $this->pagination->create_links(); ?>
                </nav>
                <?php if($total > 0) { ?>
                    <a href="<?php echo site_url($module . '/downloads'); ?>?<?php echo ($this->input->get()) ? http_build_query($this->input->get()) . '&payout_id=0' : 'payout_id=0'; ?>" class="pull-right btn_download" data-toggle="modal" data-target="#lg_view_model">
                        <i class="fa fa-download"></i> Download As Excel
                    </a>
                <?php } ?>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="list_table table-responsive">
            <table class="table table-striped product_table_wrapper">
                <thead>

                </thead>
                <tbody>
                </tbody>
                <tfoot>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<div class="clearfix"></div>

<style>
    .list_table tr td {
        vertical-align: middle;
        padding: .65rem;
    }
    .cash-coupon-commission-box small {
        display: block;
        line-height: 13px;
    }
</style>
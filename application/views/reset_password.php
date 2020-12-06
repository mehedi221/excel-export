<!DOCTYPE html>
<html lang="en">
    <head>
        <title><?php echo $page_title; ?> &lsaquo; <?php echo get_settings_value('site_title') ?></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="<?php echo base_url('assets/images/favicon.png'); ?>" type="image/png">
        <link type='text/css' rel='stylesheet' href='<?php echo base_url('assets/css/font-awesome.min.4.7.0.css'); ?>'  />
        <link type="text/css" rel="stylesheet" href="<?php echo base_url('assets/css/bootstrap.min.css'); ?>" />
        <link type='text/css' rel='stylesheet' href='<?php echo base_url('assets/css/login.css'); ?>'/>
        <link type="text/css" rel="stylesheet" href="<?php echo base_url('assets/lib/select2/select2.min.css'); ?>">

        <script type="text/javascript">
            var base_url = '<?php echo base_url(); ?>';
        </script>

        <script type="text/javascript" src="<?php echo base_url('assets/js/jquery-3.3.1.min.js'); ?>"></script>

    </head>
    <body>
        <div class="login">
            <img src="<?php echo base_url('assets/images/logo.png'); ?>" alt="" title="" />
            <?php if (validation_errors()) { ?>
                <div class="cus_alert alert alert-warning alert-dismissible fade show" role="alert">
                    <?php echo validation_errors(); ?>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            <?php } ?>
            <?php
            // error message view section
            $view_error_msg = '';
            if ($this->session->flashdata('error_msg') != '')
                $view_error_msg .= $this->session->flashdata('error_msg');
            if (isset($error_msg))
                $view_error_msg .= $error_msg;
            if (!empty($view_error_msg)) {
                ?>
                <div class="cus_alert alert alert-danger alert-dismissible fade show" role="alert">
                    <?php echo $view_error_msg; ?>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            <?php } ?>
            <form name="loginform" id="loginform" action="" method="post">
                <div class="form-row">
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" name="password" class="input" value="" />
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="cpassword" class="input" value="" />                  
                    </div>
                    <div class="form-group">
                        <div class="float-right text-right">
                            <button type="submit" name="submit" value="1" class="btn login_cus_btn">Save Password</button>
                        </div>
                    </div>

                </div>
            </form>
            <div id="backtoblog"><a href="">&larr; Back to Prestige Labs</a></div>
        </div>
        <div class="clear"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/js/bootstrap.min.js'); ?>" ></script>
    </body>
</html>
<!DOCTYPE html>
<html class="wp-toolbar" lang="en">
    <head>
        <title><?php echo isset($page_title) ? $page_title . ' &lsaquo; ' : ''; ?> <?php //echo get_settings_value('site_title') ?></title>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no user-scalable=0">

        <link rel="icon" href="<?php echo base_url('assets/images/favicon.png'); ?>" type="image/png">

        <link type='text/css' rel='stylesheet' href='<?php echo base_url('assets/css/font-awesome.min.4.7.0.css'); ?>'  />
        <link type="text/css" rel="stylesheet" href="<?php echo base_url('assets/css/bootstrap.min.css'); ?>" />
        <link type="text/css" rel="stylesheet" href="<?php echo base_url('assets/lib/select2/select2.min.css'); ?>">
        <link type="text/css" rel="stylesheet" href="<?php echo base_url('assets/css/daterangepicker.css'); ?>">
        <link type="text/css" rel="stylesheet" href="<?php echo base_url('assets/lib/jquery-ui/jquery-ui.min.css'); ?>">
        <link type="text/css" rel='stylesheet' href='<?php echo base_url('assets/css/admin_custom.css'); ?>' />
        <link type="text/css" rel="stylesheet" href="<?php echo base_url('assets/css/responsive.css'); ?>">

        <script type="text/javascript">
            var base_url = '<?php echo base_url(); ?>';
            var settimeout_id;
        </script>

        <script type="text/javascript" src="<?php echo base_url('assets/js/jquery-3.3.1.min.js'); ?>"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/js/moment.min.js'); ?>"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/js/daterangepicker.min.js'); ?>"></script>
    </head>
    <body class="<?php echo $this->router->fetch_class() . '-' . $this->router->fetch_method(); ?>">
        <div id="wpwrap" class="wpwrap clearfix">
            <div id="adminmenuback"></div>
            <div id="adminmenumain" class="adminmenumain_hide">
                <div class="left_bar" id="adminmenuwrap">

                </div>
            </div>
            <div class="container_wrapper">
                <div class="top_bar" id="wpadminbar">
                    <span class="m_menu_show_hide"><i class="fa fa-bars" aria-hidden="true"></i></span>
                    <div class="quicklinks">
                        <div class="float-left top_bar_logo"></div>
                        <ul class="float-left ab-top-menu">
                            <li class="menupop">
                                <?php //echo get_settings_value('site_title') ?>
                                <!--                                <div class="top_bar_drop_menu">
                                                                    <ul class="ab-submenu">
                                                                        <li>
                                                                            <a href="#">Visit Site</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="#">Visit Store</a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                -->
                            </li>
                        </ul>
                        <ul class=" float-right user_option">
                            <li class="menupop">
                                <a class="user_name" href="<?php echo site_url('users/profile'); ?>">Howdy, <span class="display-name"><?php echo ($this->session->displayname) ? $this->session->displayname : $this->session->first_name . ' ' . $this->session->last_name; ?></span>
                                    <img alt='' src='<?php //echo get_gravatar($this->session->email, '16', 'mp'); ?>' class='avatar avatar-16 photo' />
                                </a>
                                <div class="top_bar_drop_menu user_option_container">
                                    <ul class="ab-submenu">
                                        <li>
                                            <div class="float-left auth_image">
                                                <a class="ab-item" href="<?php echo site_url('users/profile'); ?>">
                                                    <img alt='' src='<?php // echo get_gravatar($this->session->email, '64', 'mp'); ?>' class='avatar avatar-64 photo' />
                                                </a>
                                            </div>
                                            <div class="float-right auth_name_wrapper">
                                                <a class="ab-item" href="<?php echo site_url('users/profile'); ?>">
                                                    <span class='display-name'><?php echo ($this->session->displayname) ? $this->session->displayname : $this->session->first_name . ' ' . $this->session->last_name; ?></span><span class='username'><?php echo $this->session->username; ?></span>
                                                </a>
                                                <a class="ab-item" href="<?php echo site_url('users/profile'); ?>">Edit My Profile</a>
                                                <a class="ab-item" href="<?php echo site_url('auth/logout'); ?>">Log Out</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="body_main_container">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-12">
                                <h1 class="page_title">
                                    <?php echo $page_title; ?>
                                    <?php if (isset($action_button)) { ?>
                                        <a href="<?php echo (isset($action_button['url'])) ? $action_button['url'] : 'javascript:void(0)'; ?>" class="page-title-action"><?php echo (isset($action_button['title'])) ? $action_button['title'] : 'undefine'; ?></a>
                                    <?php } ?>
                                </h1>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
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
                                <?php
                                // success message section
                                $view_success_msg = '';
                                if ($this->session->flashdata('success_msg') != '')
                                    $view_success_msg = $this->session->flashdata('success_msg');
                                if (isset($success_msg))
                                    $view_success_msg .= $success_msg;
                                if (!empty($view_success_msg)) {
                                    ?>
                                    <div class="cus_alert alert alert-success alert-dismissible fade show" role="alert">
                                        <?php echo $view_success_msg; ?>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                <?php } ?>
                            </div>
                        </div>
                        <?php echo!empty($layout) ? $layout : ''; ?>
                        <!-- Start : larger Modal -->
                        <div class="modal fade" id="lg_view_model" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="model-loader" style="height: 300px;">
                                        <div>
                                            <img src="<?php echo site_url('assets/images/loading-2.gif'); ?>">
                                            <p style="display: block; text-align: center">Loading, Please wait...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- End : larger Modal -->
                        <!-- Start : Medium Modal -->
                        <div class="modal fade" id="md_view_model" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-md modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="model-loader" style="height: 200px;">
                                        <div>
                                            <img src="<?php echo site_url('assets/images/loading-2.gif'); ?>">
                                            <p style="display: block; text-align: center">Loading, Please wait...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- End : Medium Modal -->
                    </div>
                </div>
            </div>
        </div>

        <script src="<?php echo base_url('assets/lib/jquery-ui/jquery-ui.min.js'); ?>"></script>
        <!-- <script>
        /*** Handle jQuery plugin naming conflict between jQuery UI and Bootstrap ***/
        $.widget.bridge('uibutton', $.ui.button);
        $.widget.bridge('uitooltip', $.ui.tooltip);
        </script>-->
        <script type="text/javascript" src="<?php echo base_url('assets/js/popper.min.js'); ?>"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/js/bootstrap.min.js'); ?>"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/lib/select2/select2.full.min.js'); ?>"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/lib/tinymce/tinymce.min.js'); ?>"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/js/jquery.number.min.js'); ?>"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/lib/iris/iris.min.js'); ?>"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/js/sticky-sidebar.js'); ?>"></script>
        <script type="text/javascript" src="<?php echo base_url('assets/js/script.js'); ?>"></script>
    </body>
</html>

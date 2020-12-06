<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Commission extends CI_Controller {

    private $_module         = 'commission';
    private $_module_name    = 'Commission';
    private $_download_limit = 1000;
    private $table;

    public function __construct() {
        $this->table = 'tb_anchal_child_reg';
        parent::__construct();
    }

    public function index() {
        $data                = array();
        $data['menu_group']  = $this->_module;
        $data['module']      = $this->_module;
        $data['module_name'] = $this->_module_name;
        $data['page_active'] = $this->_module . '_running';
        $data['page_title']  = 'Export';
        $params              = array();
        $data['total'] = $this->global_model->get_count($this->table, $params);
        // load the views
        $data['layout'] = $this->load->view($this->_module . '/distributor_running_commission', $data, TRUE);
        $this->load->view('template', $data);
    }

    public function downloads() {
        $data                = array();
        $data['menu_group']  = $this->_module;
        $data['module']      = $this->_module;
        $data['module_name'] = $this->_module_name;
        $data['page_active'] = $this->_module . '_download';
        $data['page_title']  = 'Download Commission Details Report';

        $params              = array();
        // get the item
        $data['total']           = $this->global_model->get_count($this->table, $params);
        $data['total_processed'] = 0;
        $data['process_percent'] = 0;
        $data['limit']           = $this->_download_limit;
        // load the views
        $this->load->view($this->_module . '/downloads', $data);
    }

    public function ajax_download() {
        $response              = array();
        $response['status']    = 0;
        $response['file_name'] = '';

        $this->load->library('PHPXlsx', 'phpxlsx');

        // parameter from ajax
        $limit            = $this->input->post('limit');
        $start_no         = $this->input->post('start_no');
        $file_name        = $this->input->post('file_name');
        $last_index_count = ($this->input->post('last_index_count')) ? $this->input->post('last_index_count') : 0;

        // download params
        $params              = array();
        $order_by     = array('filed' => 'anchal_child_reg_auto_id', 'order' => 'desc');
        $limit_params = array('limit' => $limit, 'start' => $start_no);

        $path = FCPATH . 'assets/media/xlsx_download/';

        if($start_no > 0) {
            $file_dir = $path . $file_name;
            $this->phpxlsx->load_generate_file($file_dir);
        }
        else {
            $file_name = 'commission_details_report_' . date('d_m_Y') . '_' . uniqid() . '.xls';
            if(file_exists($path . $file_name)) {
                @unlink($path . $file_name);
            }
            $this->phpxlsx->generate_file();
        }

        $heading = array(
            'id',
            'name',
        );

        $this->phpxlsx->set_excel_heading($heading);

        // get the item     
        $process = 0;

        $results = $this->global_model->get('tb_anchal_child_reg', $params, '*', $limit_params, $order_by);

        $content = array();

        if(!empty($results)) {
            foreach ($results as $result) {
                $content[] = array(
                    $result->anchal_child_reg_auto_id,
                    $result->child_name,
                );
                $process++;
            }
        }

        // set the content
        $new_index_count = $this->phpxlsx->set_excel_content($content, $last_index_count);

        // set the title
        $this->phpxlsx->set_title('Commission Details Report');

        // save the file
        $this->phpxlsx->save_file($path, $file_name);

        $response['status']           = 1;
        $response['total_process']    = $process;
        $response['last_index_count'] = $new_index_count;
        $response['file_name']        = $file_name;
        $response['msg']              = 'write to excel file';

        echo json_encode($response);
        die();
    }
}
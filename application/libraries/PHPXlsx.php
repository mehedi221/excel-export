<?php

if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class PHPXlsx {

    public $api_key;
    public $client;
    protected $objPHPExcel;
    protected $alphabets;

    public function __construct() {
        // load php excel third party
        include_once APPPATH . '/third_party/PHPExcel/PHPExcel.php';
        include_once APPPATH . '/third_party/PHPExcel/PHPExcel/IOFactory.php';
        $this->alphabets = range('A', 'Z');
    }

    public function generate_file() {
        // create object
        $this->objPHPExcel = new PHPExcel();
    }

    public function load_generate_file($file_dir) {
        $this->objPHPExcel = PHPExcel_IOFactory::load($file_dir);
    }

    public function set_title($title) {
        // rename sheet
        $this->objPHPExcel->getActiveSheet()
                ->setTitle($title);
    }

    //  set the excel heading 
    public function set_excel_heading($heading) {
        $this->objPHPExcel->setActiveSheetIndex(0);

        if (!empty($heading)) {
            $i = 1;

            foreach ($heading as $key => $heading_elm) {
                $this->objPHPExcel->getActiveSheet()
                        ->setCellValue($this->alphabets[$key] . $i, $heading_elm);
            }
        }
    }

    // set the excel content
    public function set_excel_content($content, $last_index_count = 0) {
        $this->objPHPExcel->setActiveSheetIndex(0);
        $i = ($last_index_count == 0) ? 2 : $last_index_count;
        if (!empty($content)) {
            foreach ($content as $cnt_elm) {
                foreach ($cnt_elm as $key => $cnt) {
                    $this->objPHPExcel->getActiveSheet()
                            ->setCellValue($this->alphabets[$key] . $i, $cnt);
                }

                $i++;
            }
        }
        return $i;
    }
    public function set_excel_content2($content, $last_index_count = 0) {
        $this->objPHPExcel->setActiveSheetIndex(0);
        $i = ($last_index_count == 0) ? 2 : $last_index_count;
        if (!empty($content)) {
            foreach ($content as $key => $cnt) {
                $this->objPHPExcel->getActiveSheet()->setCellValue($this->alphabets[$key] . $i, $cnt);
            }
            $i++;
        }
        return $i;
    }

    public function save_file($path,$file_name) {
        $objWriter = PHPExcel_IOFactory::createWriter($this->objPHPExcel, 'Excel5');
        $objWriter->save($path . $file_name);
    }

    public function send_to_browser($file_name) {
        $objWriter = PHPExcel_IOFactory::createWriter($this->objPHPExcel, 'Excel5');
        // we'll be outputting an excel file
        header('Content-type: application/vnd.ms-excel');

        // it will be called file.xls
        header('Content-Disposition: attachment; filename="' . $file_name . '"');

        $objWriter->save('php://output');
    }

    /**
     *  Make Download
     *
     * @param1 array $title
     * @param2 array $file_name
     * @param3 array $heading
     * @param4 array $content
     * @return array
     */
    public function download($title, $file_name, $heading = array(), $content = array()) {

        // generate the object
        $this->generate_file();

        // set the heading
        $this->set_excel_heading($heading);

        // set the content
        $this->set_excel_content($content);

        // set the title
        $this->set_title($title);

        //generate and download to browser
        $this->send_to_browser($file_name);
    }

}

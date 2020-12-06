<?php
	include 'reader.php';
	$excel = new Spreadsheet_Excel_Reader();

	$excel->read('files/Schedule.xls');

	$path = 'files/Schedule.xls';
	echo $ext = pathinfo($path, PATHINFO_EXTENSION);

	echo '<pre/>';
	foreach($excel->sheets[0]['cells'] as $key=>$value){
		if(in_array('Name Of M/Vsl',$value) || in_array('Voy #',$value)){
			echo $key;
		}
	}

?>
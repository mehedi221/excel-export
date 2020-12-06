<div class="modal-header">
    <h5 class="modal-title">
        <i class="fa fa-download" aria-hidden="true"></i> <?php echo isset($page_title) ? $page_title : ''; ?></h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>

<div class="modal-body">
    <div class="row">
        <div class="col-12">
            <div id="message_section"></div>
            <div id="update-status">
                <span class="badge badge-primary p-1">Total : <span id="total"><?php echo $total; ?></span></span>
                <span class="badge badge-success p-1">Processed : <span id="total_process"><?php echo isset($total_processed) ? $total_processed : 0; ?></span></span>
                <span class="badge badge-warning p-1">Remaining : <span id="remain_no"><?php echo($total - $total_processed); ?></span></span>
            </div>
            <div class="clearfix"></div>
            <div id="loading" class="text-center">
                <img src="<?php echo base_url('assets/images/loading-2.gif'); ?>" alt="Loading....." title="Loading....."/>
                <br>
                <p>System is processing the download, please wait.....</p>
            </div>
            <div class="progress" style="height: 40px">
                <div class="progress-bar bg-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: <?php echo isset($process_percent) ? $process_percent : 0; ?>%;">
                    <span><span id="process_percent"><?php echo $process_percent; ?></span>%</span>
                </div>
            </div>
            <div id="downloadLink" class="text-center mt-2"></div>
        </div>
    </div>
</div>

<script type="text/javascript">
    var module = '<?php echo isset($module) ? $module : 'commission'; ?>';
    var total = <?php echo $total; ?>;
    var limit = <?php echo isset($limit) ? $limit : 20; ?>;
    var total_process = <?php echo $total_processed; ?>;
    var remain_no = <?php echo($total - $total_processed); ?>;
    var process_percent = parseInt((total_process / total) * 100);
    var file_name = '';
    var last_index_count = 0;
    var url_strings = '<?php echo ($this->input->get()) ? '?' . http_build_query($this->input->get()) : ''; ?>';

    $(document).ready(function () {
        ajax_download_file();
    });

    function ajax_download_file() {
        $.ajax({
            url: base_url + module + "/ajax_download" + url_strings,
            type: 'POST',
            data: {file_name: file_name, limit: limit, start_no: total_process, last_index_count: last_index_count},
            dataType: "json",
            success: function (response) {
                if (response.status) {
                    total_process = total_process + parseInt(response.total_process);
                    remain_no = remain_no - parseInt(response.total_process);
                    process_percent = parseInt((total_process / total) * 100);
                    last_index_count = parseInt(response.last_index_count);
                    file_name = response.file_name;

                    $('#total_process').text(total_process);
                    $('#remain_no').text(remain_no);
                    $('#process_percent').text(process_percent);
                    $('.progress-bar').css("width", process_percent + "%");
                    if (total_process < total) {
                        settimeout_id = setTimeout(ajax_download_file, 1000);
                    } else {
                        $("#loading").html('<img  style="width: 100px;" src="' + base_url + 'assets/images/done.png" alt="Done" title="Done" /><br/><p style="text-align: center">Your Download is ready</p>');
                        $("#downloadLink").html('<a href="' + base_url + 'assets/media/xlsx_download/' + file_name + '" class="btn btn-success">Download Now</a>');
                    }
                } else {
                    $('#message_section').html(response.msg);
                }
            }
        });
    }
</script>


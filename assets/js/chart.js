//GET and DELETE Ajax
function ajax_data(type, url, data, success) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: "json",
        restful: true,
        cache: false,
        timeout: 20000,
        async: true,
        beforeSend: function (data) {
        },
        success: function (data) {
            success.call(this, data);
        },
        error: function (data) {
            alert("Error In Connecting");
        }
    });
}



function lineChart(data, title, divID ) {

    var jsonData = data;
    //var title = '';
    google.load("visualization", "1", {packages: ["line"], callback: drawVisualization});
    google.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Sales');
        data.addColumn('number', 'Commission');
        data.addColumn('number', 'Refund');
        data.addColumn('number', 'Canceled');
        data.addColumn('number', 'Chargeback');
        $.each(jsonData, function (i, jsonData) {
            var date = jsonData.date;
            var sales = jsonData.sales;
            var commission = jsonData.commission;
            var refund = jsonData.refund;
            var canceled = jsonData.canceled;
            var chargeback = jsonData.chargeback;

            data.addRows([[date, sales, commission, refund, canceled, chargeback]]);
        });

        var options = {
            chart: {
                title: title
            },
            height: 400
        };

        var chart;
        chart = new google.charts.Line(document.getElementById(divID));

        chart.draw(data, options);
    }
}

function salesTrendChart(data, title, divID ) {

    var jsonData = data;
    //var title = '';
    google.load("visualization", "1", {packages: ["line"], callback: drawVisualization});
    google.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Sales');
        $.each(jsonData, function (i, jsonData) {
            var date = jsonData.date;
            var sales = jsonData.sales;

            data.addRows([[date, sales]]);
        });

        var options = {
            chart: {
                title: title
            },
            height: 400
        };

        var chart;
        chart = new google.charts.Line(document.getElementById(divID));

        chart.draw(data, options);
    }
}

function refundTrendChart(data, title, divID ) {

    var jsonData = data;
    //var title = '';
    google.load("visualization", "1", {packages: ["line"], callback: drawVisualization2});
    google.setOnLoadCallback(drawVisualization2);

    function drawVisualization2() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Refund');
        $.each(jsonData, function (i, jsonData) {
            var date = jsonData.date;
            var sales = jsonData.sales;

            data.addRows([[date, sales]]);
        });

        var options = {
            chart: {
                title: title
            },
            height: 400
        };

        var chart;
        chart = new google.charts.Line(document.getElementById(divID));

        chart.draw(data, options);
    }
}

function paoutTrendChart(data, title, divID ) {

    var jsonData = data;
    //var title = '';
    google.load("visualization", "1", {packages: ["line"], callback: drawVisualization3});
    google.setOnLoadCallback(drawVisualization3);

    function drawVisualization3() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Payout');
        $.each(jsonData, function (i, jsonData) {
            var date = jsonData.date;
            var sales = jsonData.sales;

            data.addRows([[date, sales]]);
        });

        var options = {
            chart: {
                title: title
            },
            height: 400
        };

        var chart;
        chart = new google.charts.Line(document.getElementById(divID));

        chart.draw(data, options);
    }
}


function donutChart(jsonData, title, divID) {
    google.load("visualization", "1", {packages: ["corechart"], callback: drawDonutChart});
    google.setOnLoadCallback(drawDonutChart);
    function drawDonutChart() {

        var data = new google.visualization.arrayToDataTable([
            ['Total', 'Totals'],
            ['Sales', jsonData.sales],
            ['Refunds', jsonData.refunds],
            ['Canceled', jsonData.canceled],
            ['Chargebacks', jsonData.chargebacks]
        ]);

        var options = {
            title: title,
            legend: 'none',
            pieSliceText: 'label',
            chartArea:{left:20,top:10,width:'95%',height:'90%'},
            pieStartAngle: 90
        };

        var chart = new google.visualization.PieChart(document.getElementById(divID));
        chart.draw(data, options);
    }
}

function barChart(jsonData, title, divID) {
    google.load("visualization", "1.1", {packages: ["bar"], callback: barChartDraw})
    google.setOnLoadCallback(barChartDraw);
    function barChartDraw() {
        var data = google.visualization.arrayToDataTable([
            ['Device Type', 'Delivered Push', 'Pending Push'],
            ['Android', jsonData.android_delivered, jsonData.android_pending],
            ['iOS', jsonData.ios_delivered, jsonData.ios_pending]
        ]);

        var options = {
            chart: {
                title: '',
                subtitle: 'Push message delivered and pending status device wise'
            },
            bars: 'horizontal' // Required for Material Bar Charts.
        };

        var chart = new google.charts.Bar(document.getElementById(divID));

        chart.draw(data, options);
    }
}

function pushProgressDonutChart(jsonData, title, divID) {
    google.load("visualization", "1", {packages: ["corechart"], callback: drawDonutChart1});
    function drawDonutChart1() {

        var data = new google.visualization.arrayToDataTable([
            ['Push', 'Total User'],
            ['Total Push', jsonData.total],
            ['Pending Push', jsonData.pending]
        ]);

        var options = {
            pieHole: 0.4
        };

        var chart = new google.visualization.PieChart(document.getElementById(divID));
        chart.draw(data, options);
    }
}
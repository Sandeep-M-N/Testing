/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "SSn_Academics_people"], "isController": false}, {"data": [0.0, 500, 1500, "SSN_Scholarships"], "isController": false}, {"data": [0.0, 500, 1500, "SSN_alumni"], "isController": false}, {"data": [0.0, 500, 1500, "SSN_reasearch_centre"], "isController": false}, {"data": [0.0, 500, 1500, "SSN_contact_us"], "isController": false}, {"data": [0.0, 500, 1500, "SSN_iqac"], "isController": false}, {"data": [0.0, 500, 1500, "SSN_placements"], "isController": false}, {"data": [0.0, 500, 1500, "SSN_about_founder"], "isController": false}, {"data": [0.0, 500, 1500, "SSN_carrers"], "isController": false}, {"data": [0.0, 500, 1500, "SSN-Homepage"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10, 10, 100.0, 110.69999999999997, 13, 766, 40.5, 696.9000000000002, 766.0, 766.0, 8.873114463176575, 47.38884344498669, 1.1178044587400178], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["SSn_Academics_people", 1, 1, 100.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 182.58568548387098, 5.418346774193548], "isController": false}, {"data": ["SSN_Scholarships", 1, 1, 100.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 75.46875, 1.8359375], "isController": false}, {"data": ["SSN_alumni", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 435.39663461538464, 10.516826923076923], "isController": false}, {"data": ["SSN_reasearch_centre", 1, 1, 100.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 110.98345588235294, 2.8530943627450984], "isController": false}, {"data": ["SSN_contact_us", 1, 1, 100.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 182.58568548387098, 4.158266129032258], "isController": false}, {"data": ["SSN_iqac", 1, 1, 100.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 113.203125, 2.51953125], "isController": false}, {"data": ["SSN_placements", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 404.296875, 8.858816964285714], "isController": false}, {"data": ["SSN_about_founder", 1, 1, 100.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 226.40625, 6.2890625], "isController": false}, {"data": ["SSN_carrers", 1, 1, 100.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 48.349417892156865, 0.0], "isController": false}, {"data": ["SSN-Homepage", 1, 1, 100.0, 766.0, 766, 766, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 7.389237924281984, 0.17720912206266318], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (ssn.edu.in)", 1, 10.0, 10.0], "isController": false}, {"data": ["403/Forbidden", 9, 90.0, 90.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10, 10, "403/Forbidden", 9, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (ssn.edu.in)", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["SSn_Academics_people", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SSN_Scholarships", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SSN_alumni", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SSN_reasearch_centre", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SSN_contact_us", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SSN_iqac", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SSN_placements", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SSN_about_founder", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SSN_carrers", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (ssn.edu.in)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SSN-Homepage", 1, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Request 101 Neena Kochhar NKOCHHAR 515.123.4568 21-SEP-05 AD_VP 17000  -   100 90"], "isController": false}, {"data": [1.0, 500, 1500, "Request 127 James Landry JLANDRY 650.124.1334 14-JAN-07 ST_CLERK 2400  -   120 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 136 Hazel Philtanker HPHILTAN 650.127.1634 06-FEB-08 ST_CLERK 2200  -   122 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 117 Sigal Tobias STOBIAS 515.127.4564 24-JUL-05 PU_CLERK 2800  -   114 30"], "isController": false}, {"data": [1.0, 500, 1500, "Request 138 Stephen Stiles SSTILES 650.121.2034 26-OCT-05 ST_CLERK 3200  -   123 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 105 David Austin DAUSTIN 590.423.4569 25-JUN-05 IT_PROG 4800  -   103 60"], "isController": false}, {"data": [1.0, 500, 1500, "Request 206 William Gietz WGIETZ 515.123.8181 07-JUN-02 AC_ACCOUNT 8300  -   205 110"], "isController": false}, {"data": [1.0, 500, 1500, "Request 205 Shelley Higgins SHIGGINS 515.123.8080 07-JUN-02 AC_MGR 12008  -   101 110"], "isController": false}, {"data": [1.0, 500, 1500, "Request 132 TJ Olson TJOLSON 650.124.8234 10-APR-07 ST_CLERK 2100  -   121 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 131 James Marlow JAMRLOW 650.124.7234 16-FEB-05 ST_CLERK 2500  -   121 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 134 Michael Rogers MROGERS 650.127.1834 26-AUG-06 ST_CLERK 2900  -   122 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 202 Pat Fay PFAY 603.123.6666 17-AUG-05 MK_REP 6000  -   201 20"], "isController": false}, {"data": [1.0, 500, 1500, "Request 126 Irene Mikkilineni IMIKKILI 650.124.1224 28-SEP-06 ST_CLERK 2700  -   120 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 123 Shanta Vollman SVOLLMAN 650.123.4234 10-OCT-05 ST_MAN 6500  -   100 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 139 John Seo JSEO 650.121.2019 12-FEB-06 ST_CLERK 2700  -   123 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 103 Alexander Hunold AHUNOLD 590.423.4567 03-JAN-06 IT_PROG 9000  -   102 60"], "isController": false}, {"data": [1.0, 500, 1500, "Request 204 Hermann Baer HBAER 515.123.8888 07-JUN-02 PR_REP 10000  -   101 70"], "isController": false}, {"data": [1.0, 500, 1500, "Request 114 Den Raphaely DRAPHEAL 515.127.4561 07-DEC-02 PU_MAN 11000  -   100 30"], "isController": false}, {"data": [1.0, 500, 1500, "Request 108 Nancy Greenberg NGREENBE 515.124.4569 17-AUG-02 FI_MGR 12008  -   101 100"], "isController": false}, {"data": [1.0, 500, 1500, "Request 198 Donald OConnell DOCONNEL 650.507.9833 21-JUN-07 SH_CLERK 2600  -   124 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 203 Susan Mavris SMAVRIS 515.123.7777 07-JUN-02 HR_REP 6500  -   101 40"], "isController": false}, {"data": [1.0, 500, 1500, "Request 110 John Chen JCHEN 515.124.4269 28-SEP-05 FI_ACCOUNT 8200  -   108 100"], "isController": false}, {"data": [1.0, 500, 1500, "Request 125 Julia Nayer JNAYER 650.124.1214 16-JUL-05 ST_CLERK 3200  -   120 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 106 Valli Pataballa VPATABAL 590.423.4560 05-FEB-06 IT_PROG 4800  -   103 60"], "isController": false}, {"data": [1.0, 500, 1500, "Request 120 Matthew Weiss MWEISS 650.123.1234 18-JUL-04 ST_MAN 8000  -   100 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 137 Renske Ladwig RLADWIG 650.121.1234 14-JUL-03 ST_CLERK 3600  -   123 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 100 Steven King SKING 515.123.4567 17-JUN-03 AD_PRES 24000  -    -  90"], "isController": false}, {"data": [1.0, 500, 1500, "Request 130 Mozhe Atkinson MATKINSO 650.124.6234 30-OCT-05 ST_CLERK 2800  -   121 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 107 Diana Lorentz DLORENTZ 590.423.5567 07-FEB-07 IT_PROG 4200  -   103 60"], "isController": false}, {"data": [1.0, 500, 1500, "Request 118 Guy Himuro GHIMURO 515.127.4565 15-NOV-06 PU_CLERK 2600  -   114 30"], "isController": false}, {"data": [1.0, 500, 1500, "Request 201 Michael Hartstein MHARTSTE 515.123.5555 17-FEB-04 MK_MAN 13000  -   100 20"], "isController": false}, {"data": [1.0, 500, 1500, "Request 119 Karen Colmenares KCOLMENA 515.127.4566 10-AUG-07 PU_CLERK 2500  -   114 30"], "isController": false}, {"data": [1.0, 500, 1500, "Request 113 Luis Popp LPOPP 515.124.4567 07-DEC-07 FI_ACCOUNT 6900  -   108 100"], "isController": false}, {"data": [1.0, 500, 1500, "Request 124 Kevin Mourgos KMOURGOS 650.123.5234 16-NOV-07 ST_MAN 5800  -   100 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 133 Jason Mallin JMALLIN 650.127.1934 14-JUN-04 ST_CLERK 3300  -   122 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 140 Joshua Patel JPATEL 650.121.1834 06-APR-06 ST_CLERK 2500  -   123 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 116 Shelli Baida SBAIDA 515.127.4563 24-DEC-05 PU_CLERK 2900  -   114 30"], "isController": false}, {"data": [1.0, 500, 1500, "Request 135 Ki Gee KGEE 650.127.1734 12-DEC-07 ST_CLERK 2400  -   122 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 102 Lex De Haan LDEHAAN 515.123.4569 13-JAN-01 AD_VP 17000  -   100 90"], "isController": false}, {"data": [1.0, 500, 1500, "Request 129 Laura Bissot LBISSOT 650.124.5234 20-AUG-05 ST_CLERK 3300  -   121 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 121 Adam Fripp AFRIPP 650.123.2234 10-APR-05 ST_MAN 8200  -   100 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 199 Douglas Grant DGRANT 650.507.9844 13-JAN-08 SH_CLERK 2600  -   124 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 115 Alexander Khoo AKHOO 515.127.4562 18-MAY-03 PU_CLERK 3100  -   114 30"], "isController": false}, {"data": [1.0, 500, 1500, "Request 112 Jose Manuel Urman JMURMAN 515.124.4469 07-MAR-06 FI_ACCOUNT 7800  -   108 100"], "isController": false}, {"data": [1.0, 500, 1500, "Request 104 Bruce Ernst BERNST 590.423.4568 21-MAY-07 IT_PROG 6000  -   103 60"], "isController": false}, {"data": [1.0, 500, 1500, "Request 128 Steven Markle SMARKLE 650.124.1434 08-MAR-08 ST_CLERK 2200  -   120 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 200 Jennifer Whalen JWHALEN 515.123.4444 17-SEP-03 AD_ASST 4400  -   101 10"], "isController": false}, {"data": [1.0, 500, 1500, "Request 109 Daniel Faviet DFAVIET 515.124.4169 16-AUG-02 FI_ACCOUNT 9000  -   108 100"], "isController": false}, {"data": [1.0, 500, 1500, "Request 122 Payam Kaufling PKAUFLIN 650.123.3234 01-MAY-03 ST_MAN 7900  -   100 50"], "isController": false}, {"data": [1.0, 500, 1500, "Request 111 Ismael Sciarra ISCIARRA 515.124.4369 30-SEP-05 FI_ACCOUNT 7700  -   108 100"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50, 0, 0.0, 228.66, 105, 355, 224.0, 341.0, 347.15, 355.0, 44.05286343612335, 0.0, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Request 101 Neena Kochhar NKOCHHAR 515.123.4568 21-SEP-05 AD_VP 17000  -   100 90", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.0, 0.0], "isController": false}, {"data": ["Request 127 James Landry JLANDRY 650.124.1334 14-JAN-07 ST_CLERK 2400  -   120 50", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.0, 0.0], "isController": false}, {"data": ["Request 136 Hazel Philtanker HPHILTAN 650.127.1634 06-FEB-08 ST_CLERK 2200  -   122 50", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.0, 0.0], "isController": false}, {"data": ["Request 117 Sigal Tobias STOBIAS 515.127.4564 24-JUL-05 PU_CLERK 2800  -   114 30", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.0, 0.0], "isController": false}, {"data": ["Request 138 Stephen Stiles SSTILES 650.121.2034 26-OCT-05 ST_CLERK 3200  -   123 50", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 0.0, 0.0], "isController": false}, {"data": ["Request 105 David Austin DAUSTIN 590.423.4569 25-JUN-05 IT_PROG 4800  -   103 60", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 0.0, 0.0], "isController": false}, {"data": ["Request 206 William Gietz WGIETZ 515.123.8181 07-JUN-02 AC_ACCOUNT 8300  -   205 110", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.0, 0.0], "isController": false}, {"data": ["Request 205 Shelley Higgins SHIGGINS 515.123.8080 07-JUN-02 AC_MGR 12008  -   101 110", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 0.0, 0.0], "isController": false}, {"data": ["Request 132 TJ Olson TJOLSON 650.124.8234 10-APR-07 ST_CLERK 2100  -   121 50", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 0.0, 0.0], "isController": false}, {"data": ["Request 131 James Marlow JAMRLOW 650.124.7234 16-FEB-05 ST_CLERK 2500  -   121 50", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.0, 0.0], "isController": false}, {"data": ["Request 134 Michael Rogers MROGERS 650.127.1834 26-AUG-06 ST_CLERK 2900  -   122 50", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.0, 0.0], "isController": false}, {"data": ["Request 202 Pat Fay PFAY 603.123.6666 17-AUG-05 MK_REP 6000  -   201 20", 1, 0, 0.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 0.0, 0.0], "isController": false}, {"data": ["Request 126 Irene Mikkilineni IMIKKILI 650.124.1224 28-SEP-06 ST_CLERK 2700  -   120 50", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 0.0, 0.0], "isController": false}, {"data": ["Request 123 Shanta Vollman SVOLLMAN 650.123.4234 10-OCT-05 ST_MAN 6500  -   100 50", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 0.0, 0.0], "isController": false}, {"data": ["Request 139 John Seo JSEO 650.121.2019 12-FEB-06 ST_CLERK 2700  -   123 50", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 0.0, 0.0], "isController": false}, {"data": ["Request 103 Alexander Hunold AHUNOLD 590.423.4567 03-JAN-06 IT_PROG 9000  -   102 60", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.0, 0.0], "isController": false}, {"data": ["Request 204 Hermann Baer HBAER 515.123.8888 07-JUN-02 PR_REP 10000  -   101 70", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 0.0, 0.0], "isController": false}, {"data": ["Request 114 Den Raphaely DRAPHEAL 515.127.4561 07-DEC-02 PU_MAN 11000  -   100 30", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.0, 0.0], "isController": false}, {"data": ["Request 108 Nancy Greenberg NGREENBE 515.124.4569 17-AUG-02 FI_MGR 12008  -   101 100", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 0.0, 0.0], "isController": false}, {"data": ["Request 198 Donald OConnell DOCONNEL 650.507.9833 21-JUN-07 SH_CLERK 2600  -   124 50", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.0, 0.0], "isController": false}, {"data": ["Request 203 Susan Mavris SMAVRIS 515.123.7777 07-JUN-02 HR_REP 6500  -   101 40", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 0.0, 0.0], "isController": false}, {"data": ["Request 110 John Chen JCHEN 515.124.4269 28-SEP-05 FI_ACCOUNT 8200  -   108 100", 1, 0, 0.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 0.0, 0.0], "isController": false}, {"data": ["Request 125 Julia Nayer JNAYER 650.124.1214 16-JUL-05 ST_CLERK 3200  -   120 50", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 0.0, 0.0], "isController": false}, {"data": ["Request 106 Valli Pataballa VPATABAL 590.423.4560 05-FEB-06 IT_PROG 4800  -   103 60", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 0.0, 0.0], "isController": false}, {"data": ["Request 120 Matthew Weiss MWEISS 650.123.1234 18-JUL-04 ST_MAN 8000  -   100 50", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.0, 0.0], "isController": false}, {"data": ["Request 137 Renske Ladwig RLADWIG 650.121.1234 14-JUL-03 ST_CLERK 3600  -   123 50", 1, 0, 0.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 0.0, 0.0], "isController": false}, {"data": ["Request 100 Steven King SKING 515.123.4567 17-JUN-03 AD_PRES 24000  -    -  90", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.0, 0.0], "isController": false}, {"data": ["Request 130 Mozhe Atkinson MATKINSO 650.124.6234 30-OCT-05 ST_CLERK 2800  -   121 50", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.0, 0.0], "isController": false}, {"data": ["Request 107 Diana Lorentz DLORENTZ 590.423.5567 07-FEB-07 IT_PROG 4200  -   103 60", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.0, 0.0], "isController": false}, {"data": ["Request 118 Guy Himuro GHIMURO 515.127.4565 15-NOV-06 PU_CLERK 2600  -   114 30", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 0.0, 0.0], "isController": false}, {"data": ["Request 201 Michael Hartstein MHARTSTE 515.123.5555 17-FEB-04 MK_MAN 13000  -   100 20", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 0.0, 0.0], "isController": false}, {"data": ["Request 119 Karen Colmenares KCOLMENA 515.127.4566 10-AUG-07 PU_CLERK 2500  -   114 30", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 0.0, 0.0], "isController": false}, {"data": ["Request 113 Luis Popp LPOPP 515.124.4567 07-DEC-07 FI_ACCOUNT 6900  -   108 100", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.0, 0.0], "isController": false}, {"data": ["Request 124 Kevin Mourgos KMOURGOS 650.123.5234 16-NOV-07 ST_MAN 5800  -   100 50", 1, 0, 0.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 0.0, 0.0], "isController": false}, {"data": ["Request 133 Jason Mallin JMALLIN 650.127.1934 14-JUN-04 ST_CLERK 3300  -   122 50", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.0, 0.0], "isController": false}, {"data": ["Request 140 Joshua Patel JPATEL 650.121.1834 06-APR-06 ST_CLERK 2500  -   123 50", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 0.0, 0.0], "isController": false}, {"data": ["Request 116 Shelli Baida SBAIDA 515.127.4563 24-DEC-05 PU_CLERK 2900  -   114 30", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.0, 0.0], "isController": false}, {"data": ["Request 135 Ki Gee KGEE 650.127.1734 12-DEC-07 ST_CLERK 2400  -   122 50", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.0, 0.0], "isController": false}, {"data": ["Request 102 Lex De Haan LDEHAAN 515.123.4569 13-JAN-01 AD_VP 17000  -   100 90", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 0.0, 0.0], "isController": false}, {"data": ["Request 129 Laura Bissot LBISSOT 650.124.5234 20-AUG-05 ST_CLERK 3300  -   121 50", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.0, 0.0], "isController": false}, {"data": ["Request 121 Adam Fripp AFRIPP 650.123.2234 10-APR-05 ST_MAN 8200  -   100 50", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.0, 0.0], "isController": false}, {"data": ["Request 199 Douglas Grant DGRANT 650.507.9844 13-JAN-08 SH_CLERK 2600  -   124 50", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.0, 0.0], "isController": false}, {"data": ["Request 115 Alexander Khoo AKHOO 515.127.4562 18-MAY-03 PU_CLERK 3100  -   114 30", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.0, 0.0], "isController": false}, {"data": ["Request 112 Jose Manuel Urman JMURMAN 515.124.4469 07-MAR-06 FI_ACCOUNT 7800  -   108 100", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.0, 0.0], "isController": false}, {"data": ["Request 104 Bruce Ernst BERNST 590.423.4568 21-MAY-07 IT_PROG 6000  -   103 60", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 0.0, 0.0], "isController": false}, {"data": ["Request 128 Steven Markle SMARKLE 650.124.1434 08-MAR-08 ST_CLERK 2200  -   120 50", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.0, 0.0], "isController": false}, {"data": ["Request 200 Jennifer Whalen JWHALEN 515.123.4444 17-SEP-03 AD_ASST 4400  -   101 10", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.0, 0.0], "isController": false}, {"data": ["Request 109 Daniel Faviet DFAVIET 515.124.4169 16-AUG-02 FI_ACCOUNT 9000  -   108 100", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 0.0, 0.0], "isController": false}, {"data": ["Request 122 Payam Kaufling PKAUFLIN 650.123.3234 01-MAY-03 ST_MAN 7900  -   100 50", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 0.0, 0.0], "isController": false}, {"data": ["Request 111 Ismael Sciarra ISCIARRA 515.124.4369 30-SEP-05 FI_ACCOUNT 7700  -   108 100", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 0.0, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

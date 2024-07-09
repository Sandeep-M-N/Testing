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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "result 135, Ki, Gee, KGEE, 650.127.1734, 12-DEC-07, ST_CLERK, 2400,  - , 122, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 111, Ismael, Sciarra, ISCIARRA, 515.124.4369, 30-SEP-05, FI_ACCOUNT, 7700,  - , 108, 100,"], "isController": false}, {"data": [1.0, 500, 1500, "result 112, Jose Manuel, Urman, JMURMAN, 515.124.4469, 07-MAR-06, FI_ACCOUNT, 7800,  - , 108, 100,"], "isController": false}, {"data": [1.0, 500, 1500, "result 107, Diana, Lorentz, DLORENTZ, 590.423.5567, 07-FEB-07, IT_PROG, 4200,  - , 103, 60,"], "isController": false}, {"data": [1.0, 500, 1500, "result 105, David, Austin, DAUSTIN, 590.423.4569, 25-JUN-05, IT_PROG, 4800,  - , 103, 60,"], "isController": false}, {"data": [1.0, 500, 1500, "result 126, Irene, Mikkilineni, IMIKKILI, 650.124.1224, 28-SEP-06, ST_CLERK, 2700,  - , 120, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 133, Jason, Mallin, JMALLIN, 650.127.1934, 14-JUN-04, ST_CLERK, 3300,  - , 122, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 106, Valli, Pataballa, VPATABAL, 590.423.4560, 05-FEB-06, IT_PROG, 4800,  - , 103, 60,"], "isController": false}, {"data": [1.0, 500, 1500, "result 101, Neena, Kochhar, NKOCHHAR, 515.123.4568, 21-SEP-05, AD_VP, 17000,  - , 100, 90,"], "isController": false}, {"data": [1.0, 500, 1500, "result 128, Steven, Markle, SMARKLE, 650.124.1434, 08-MAR-08, ST_CLERK, 2200,  - , 120, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 127, James, Landry, JLANDRY, 650.124.1334, 14-JAN-07, ST_CLERK, 2400,  - , 120, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 125, Julia, Nayer, JNAYER, 650.124.1214, 16-JUL-05, ST_CLERK, 3200,  - , 120, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 202, Pat, Fay, PFAY, 603.123.6666, 17-AUG-05, MK_REP, 6000,  - , 201, 20,"], "isController": false}, {"data": [1.0, 500, 1500, "result 136, Hazel, Philtanker, HPHILTAN, 650.127.1634, 06-FEB-08, ST_CLERK, 2200,  - , 122, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 124, Kevin, Mourgos, KMOURGOS, 650.123.5234, 16-NOV-07, ST_MAN, 5800,  - , 100, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 139, John, Seo, JSEO, 650.121.2019, 12-FEB-06, ST_CLERK, 2700,  - , 123, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 137, Renske, Ladwig, RLADWIG, 650.121.1234, 14-JUL-03, ST_CLERK, 3600,  - , 123, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 103, Alexander, Hunold, AHUNOLD, 590.423.4567, 03-JAN-06, IT_PROG, 9000,  - , 102, 60,"], "isController": false}, {"data": [1.0, 500, 1500, "result 206, William, Gietz, WGIETZ, 515.123.8181, 07-JUN-02, AC_ACCOUNT, 8300,  - , 205, 110,"], "isController": false}, {"data": [1.0, 500, 1500, "result 104, Bruce, Ernst, BERNST, 590.423.4568, 21-MAY-07, IT_PROG, 6000,  - , 103, 60,"], "isController": false}, {"data": [1.0, 500, 1500, "result 121, Adam, Fripp, AFRIPP, 650.123.2234, 10-APR-05, ST_MAN, 8200,  - , 100, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 113, Luis, Popp, LPOPP, 515.124.4567, 07-DEC-07, FI_ACCOUNT, 6900,  - , 108, 100,"], "isController": false}, {"data": [1.0, 500, 1500, "result 123, Shanta, Vollman, SVOLLMAN, 650.123.4234, 10-OCT-05, ST_MAN, 6500,  - , 100, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 109, Daniel, Faviet, DFAVIET, 515.124.4169, 16-AUG-02, FI_ACCOUNT, 9000,  - , 108, 100,"], "isController": false}, {"data": [1.0, 500, 1500, "result 116, Shelli, Baida, SBAIDA, 515.127.4563, 24-DEC-05, PU_CLERK, 2900,  - , 114, 30,"], "isController": false}, {"data": [1.0, 500, 1500, "result 131, James, Marlow, JAMRLOW, 650.124.7234, 16-FEB-05, ST_CLERK, 2500,  - , 121, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 110, John, Chen, JCHEN, 515.124.4269, 28-SEP-05, FI_ACCOUNT, 8200,  - , 108, 100,"], "isController": false}, {"data": [1.0, 500, 1500, "result 115, Alexander, Khoo, AKHOO, 515.127.4562, 18-MAY-03, PU_CLERK, 3100,  - , 114, 30,"], "isController": false}, {"data": [1.0, 500, 1500, "result 205, Shelley, Higgins, SHIGGINS, 515.123.8080, 07-JUN-02, AC_MGR, 12008,  - , 101, 110,"], "isController": false}, {"data": [1.0, 500, 1500, "result 122, Payam, Kaufling, PKAUFLIN, 650.123.3234, 01-MAY-03, ST_MAN, 7900,  - , 100, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 118, Guy, Himuro, GHIMURO, 515.127.4565, 15-NOV-06, PU_CLERK, 2600,  - , 114, 30,"], "isController": false}, {"data": [1.0, 500, 1500, "result 140, Joshua, Patel, JPATEL, 650.121.1834, 06-APR-06, ST_CLERK, 2500,  - , 123, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 138, Stephen, Stiles, SSTILES, 650.121.2034, 26-OCT-05, ST_CLERK, 3200,  - , 123, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 130, Mozhe, Atkinson, MATKINSO, 650.124.6234, 30-OCT-05, ST_CLERK, 2800,  - , 121, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 199, Douglas, Grant, DGRANT, 650.507.9844, 13-JAN-08, SH_CLERK, 2600,  - , 124, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 203, Susan, Mavris, SMAVRIS, 515.123.7777, 07-JUN-02, HR_REP, 6500,  - , 101, 40,"], "isController": false}, {"data": [1.0, 500, 1500, "result 134, Michael, Rogers, MROGERS, 650.127.1834, 26-AUG-06, ST_CLERK, 2900,  - , 122, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 117, Sigal, Tobias, STOBIAS, 515.127.4564, 24-JUL-05, PU_CLERK, 2800,  - , 114, 30,"], "isController": false}, {"data": [1.0, 500, 1500, "result 201, Michael, Hartstein, MHARTSTE, 515.123.5555, 17-FEB-04, MK_MAN, 13000,  - , 100, 20,"], "isController": false}, {"data": [1.0, 500, 1500, "result 200, Jennifer, Whalen, JWHALEN, 515.123.4444, 17-SEP-03, AD_ASST, 4400,  - , 101, 10,"], "isController": false}, {"data": [1.0, 500, 1500, "result 119, Karen, Colmenares, KCOLMENA, 515.127.4566, 10-AUG-07, PU_CLERK, 2500,  - , 114, 30,"], "isController": false}, {"data": [1.0, 500, 1500, "result 132, TJ, Olson, TJOLSON, 650.124.8234, 10-APR-07, ST_CLERK, 2100,  - , 121, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 120, Matthew, Weiss, MWEISS, 650.123.1234, 18-JUL-04, ST_MAN, 8000,  - , 100, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 108, Nancy, Greenberg, NGREENBE, 515.124.4569, 17-AUG-02, FI_MGR, 12008,  - , 101, 100,"], "isController": false}, {"data": [1.0, 500, 1500, "result 198, Donald, OConnell, DOCONNEL, 650.507.9833, 21-JUN-07, SH_CLERK, 2600,  - , 124, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 129, Laura, Bissot, LBISSOT, 650.124.5234, 20-AUG-05, ST_CLERK, 3300,  - , 121, 50,"], "isController": false}, {"data": [1.0, 500, 1500, "result 100, Steven, King, SKING, 515.123.4567, 17-JUN-03, AD_PRES, 24000,  - ,  - , 90,"], "isController": false}, {"data": [1.0, 500, 1500, "result 102, Lex, De Haan, LDEHAAN, 515.123.4569, 13-JAN-01, AD_VP, 17000,  - , 100, 90,"], "isController": false}, {"data": [1.0, 500, 1500, "result 114, Den, Raphaely, DRAPHEAL, 515.127.4561, 07-DEC-02, PU_MAN, 11000,  - , 100, 30,"], "isController": false}, {"data": [1.0, 500, 1500, "result 204, Hermann, Baer, HBAER, 515.123.8888, 07-JUN-02, PR_REP, 10000,  - , 101, 70,"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50, 0, 0.0, 227.0800000000001, 103, 354, 221.0, 334.09999999999997, 342.79999999999995, 354.0, 43.327556325823224, 0.0, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["result 135, Ki, Gee, KGEE, 650.127.1734, 12-DEC-07, ST_CLERK, 2400,  - , 122, 50,", 1, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 0.0, 0.0], "isController": false}, {"data": ["result 111, Ismael, Sciarra, ISCIARRA, 515.124.4369, 30-SEP-05, FI_ACCOUNT, 7700,  - , 108, 100,", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 0.0, 0.0], "isController": false}, {"data": ["result 112, Jose Manuel, Urman, JMURMAN, 515.124.4469, 07-MAR-06, FI_ACCOUNT, 7800,  - , 108, 100,", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.0, 0.0], "isController": false}, {"data": ["result 107, Diana, Lorentz, DLORENTZ, 590.423.5567, 07-FEB-07, IT_PROG, 4200,  - , 103, 60,", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.0, 0.0], "isController": false}, {"data": ["result 105, David, Austin, DAUSTIN, 590.423.4569, 25-JUN-05, IT_PROG, 4800,  - , 103, 60,", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.0, 0.0], "isController": false}, {"data": ["result 126, Irene, Mikkilineni, IMIKKILI, 650.124.1224, 28-SEP-06, ST_CLERK, 2700,  - , 120, 50,", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.0, 0.0], "isController": false}, {"data": ["result 133, Jason, Mallin, JMALLIN, 650.127.1934, 14-JUN-04, ST_CLERK, 3300,  - , 122, 50,", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.0, 0.0], "isController": false}, {"data": ["result 106, Valli, Pataballa, VPATABAL, 590.423.4560, 05-FEB-06, IT_PROG, 4800,  - , 103, 60,", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.0, 0.0], "isController": false}, {"data": ["result 101, Neena, Kochhar, NKOCHHAR, 515.123.4568, 21-SEP-05, AD_VP, 17000,  - , 100, 90,", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.0, 0.0], "isController": false}, {"data": ["result 128, Steven, Markle, SMARKLE, 650.124.1434, 08-MAR-08, ST_CLERK, 2200,  - , 120, 50,", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.0, 0.0], "isController": false}, {"data": ["result 127, James, Landry, JLANDRY, 650.124.1334, 14-JAN-07, ST_CLERK, 2400,  - , 120, 50,", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.0, 0.0], "isController": false}, {"data": ["result 125, Julia, Nayer, JNAYER, 650.124.1214, 16-JUL-05, ST_CLERK, 3200,  - , 120, 50,", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 0.0, 0.0], "isController": false}, {"data": ["result 202, Pat, Fay, PFAY, 603.123.6666, 17-AUG-05, MK_REP, 6000,  - , 201, 20,", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 0.0, 0.0], "isController": false}, {"data": ["result 136, Hazel, Philtanker, HPHILTAN, 650.127.1634, 06-FEB-08, ST_CLERK, 2200,  - , 122, 50,", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 0.0, 0.0], "isController": false}, {"data": ["result 124, Kevin, Mourgos, KMOURGOS, 650.123.5234, 16-NOV-07, ST_MAN, 5800,  - , 100, 50,", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 0.0, 0.0], "isController": false}, {"data": ["result 139, John, Seo, JSEO, 650.121.2019, 12-FEB-06, ST_CLERK, 2700,  - , 123, 50,", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.0, 0.0], "isController": false}, {"data": ["result 137, Renske, Ladwig, RLADWIG, 650.121.1234, 14-JUL-03, ST_CLERK, 3600,  - , 123, 50,", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 0.0, 0.0], "isController": false}, {"data": ["result 103, Alexander, Hunold, AHUNOLD, 590.423.4567, 03-JAN-06, IT_PROG, 9000,  - , 102, 60,", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 0.0, 0.0], "isController": false}, {"data": ["result 206, William, Gietz, WGIETZ, 515.123.8181, 07-JUN-02, AC_ACCOUNT, 8300,  - , 205, 110,", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.0, 0.0], "isController": false}, {"data": ["result 104, Bruce, Ernst, BERNST, 590.423.4568, 21-MAY-07, IT_PROG, 6000,  - , 103, 60,", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 0.0, 0.0], "isController": false}, {"data": ["result 121, Adam, Fripp, AFRIPP, 650.123.2234, 10-APR-05, ST_MAN, 8200,  - , 100, 50,", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 0.0, 0.0], "isController": false}, {"data": ["result 113, Luis, Popp, LPOPP, 515.124.4567, 07-DEC-07, FI_ACCOUNT, 6900,  - , 108, 100,", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.0, 0.0], "isController": false}, {"data": ["result 123, Shanta, Vollman, SVOLLMAN, 650.123.4234, 10-OCT-05, ST_MAN, 6500,  - , 100, 50,", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 0.0, 0.0], "isController": false}, {"data": ["result 109, Daniel, Faviet, DFAVIET, 515.124.4169, 16-AUG-02, FI_ACCOUNT, 9000,  - , 108, 100,", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 126.0, 7.936507936507936, 0.0, 0.0], "isController": false}, {"data": ["result 116, Shelli, Baida, SBAIDA, 515.127.4563, 24-DEC-05, PU_CLERK, 2900,  - , 114, 30,", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.0, 0.0], "isController": false}, {"data": ["result 131, James, Marlow, JAMRLOW, 650.124.7234, 16-FEB-05, ST_CLERK, 2500,  - , 121, 50,", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 0.0, 0.0], "isController": false}, {"data": ["result 110, John, Chen, JCHEN, 515.124.4269, 28-SEP-05, FI_ACCOUNT, 8200,  - , 108, 100,", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 0.0, 0.0], "isController": false}, {"data": ["result 115, Alexander, Khoo, AKHOO, 515.127.4562, 18-MAY-03, PU_CLERK, 3100,  - , 114, 30,", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.0, 0.0], "isController": false}, {"data": ["result 205, Shelley, Higgins, SHIGGINS, 515.123.8080, 07-JUN-02, AC_MGR, 12008,  - , 101, 110,", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 0.0, 0.0], "isController": false}, {"data": ["result 122, Payam, Kaufling, PKAUFLIN, 650.123.3234, 01-MAY-03, ST_MAN, 7900,  - , 100, 50,", 1, 0, 0.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 0.0, 0.0], "isController": false}, {"data": ["result 118, Guy, Himuro, GHIMURO, 515.127.4565, 15-NOV-06, PU_CLERK, 2600,  - , 114, 30,", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.0, 0.0], "isController": false}, {"data": ["result 140, Joshua, Patel, JPATEL, 650.121.1834, 06-APR-06, ST_CLERK, 2500,  - , 123, 50,", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.0, 0.0], "isController": false}, {"data": ["result 138, Stephen, Stiles, SSTILES, 650.121.2034, 26-OCT-05, ST_CLERK, 3200,  - , 123, 50,", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 0.0, 0.0], "isController": false}, {"data": ["result 130, Mozhe, Atkinson, MATKINSO, 650.124.6234, 30-OCT-05, ST_CLERK, 2800,  - , 121, 50,", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.0, 0.0], "isController": false}, {"data": ["result 199, Douglas, Grant, DGRANT, 650.507.9844, 13-JAN-08, SH_CLERK, 2600,  - , 124, 50,", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 0.0, 0.0], "isController": false}, {"data": ["result 203, Susan, Mavris, SMAVRIS, 515.123.7777, 07-JUN-02, HR_REP, 6500,  - , 101, 40,", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 0.0, 0.0], "isController": false}, {"data": ["result 134, Michael, Rogers, MROGERS, 650.127.1834, 26-AUG-06, ST_CLERK, 2900,  - , 122, 50,", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.0, 0.0], "isController": false}, {"data": ["result 117, Sigal, Tobias, STOBIAS, 515.127.4564, 24-JUL-05, PU_CLERK, 2800,  - , 114, 30,", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 0.0, 0.0], "isController": false}, {"data": ["result 201, Michael, Hartstein, MHARTSTE, 515.123.5555, 17-FEB-04, MK_MAN, 13000,  - , 100, 20,", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.0, 0.0], "isController": false}, {"data": ["result 200, Jennifer, Whalen, JWHALEN, 515.123.4444, 17-SEP-03, AD_ASST, 4400,  - , 101, 10,", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.0, 0.0], "isController": false}, {"data": ["result 119, Karen, Colmenares, KCOLMENA, 515.127.4566, 10-AUG-07, PU_CLERK, 2500,  - , 114, 30,", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.0, 0.0], "isController": false}, {"data": ["result 132, TJ, Olson, TJOLSON, 650.124.8234, 10-APR-07, ST_CLERK, 2100,  - , 121, 50,", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 0.0, 0.0], "isController": false}, {"data": ["result 120, Matthew, Weiss, MWEISS, 650.123.1234, 18-JUL-04, ST_MAN, 8000,  - , 100, 50,", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.0, 0.0], "isController": false}, {"data": ["result 108, Nancy, Greenberg, NGREENBE, 515.124.4569, 17-AUG-02, FI_MGR, 12008,  - , 101, 100,", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 0.0, 0.0], "isController": false}, {"data": ["result 198, Donald, OConnell, DOCONNEL, 650.507.9833, 21-JUN-07, SH_CLERK, 2600,  - , 124, 50,", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.0, 0.0], "isController": false}, {"data": ["result 129, Laura, Bissot, LBISSOT, 650.124.5234, 20-AUG-05, ST_CLERK, 3300,  - , 121, 50,", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.0, 0.0], "isController": false}, {"data": ["result 100, Steven, King, SKING, 515.123.4567, 17-JUN-03, AD_PRES, 24000,  - ,  - , 90,", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.0, 0.0], "isController": false}, {"data": ["result 102, Lex, De Haan, LDEHAAN, 515.123.4569, 13-JAN-01, AD_VP, 17000,  - , 100, 90,", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.0, 0.0], "isController": false}, {"data": ["result 114, Den, Raphaely, DRAPHEAL, 515.127.4561, 07-DEC-02, PU_MAN, 11000,  - , 100, 30,", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.0, 0.0], "isController": false}, {"data": ["result 204, Hermann, Baer, HBAER, 515.123.8888, 07-JUN-02, PR_REP, 10000,  - , 101, 70,", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 0.0, 0.0], "isController": false}]}, function(index, item){
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

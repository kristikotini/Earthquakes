var te_dhena = "";
// Script per ndryshimin nga map-tabel dhe anasjelltas
for (var i = 0; i < earthQuakePoints.length; i++) {
    var data = earthQuakePoints[i][0];
    var ora = earthQuakePoints[i][1];
    var qendra = earthQuakePoints[i][3];
    var magnituda = earthQuakePoints[i][2];
    var thellesia = earthQuakePoints[i][6];
    te_dhena +=
        '<tr>' +
        '<td style="visibility:hidden" ></td>' +
        '<td>' + data + '</td>' +
        '<td>' + ora + '</td>' +
        '<td>' + qendra + '</td>' +
        '<td>' + magnituda + '</td>' +
        '<td>' + magnituda + '</td>' +
        '</tr>';
}
var myTable =
    '<table id="dt-all-checkbox" class="table text-center" cellspacing="0" width="100%">' +
    '<thead>' +
    '<tr>' +
    ' <th style="visibility:hidden" ></th>' +
    ' <th class="th-sms" >Data</th>' +
    ' <th class="th-sms">Ora</th>' +
    ' <th class="th-sms">Qendra</th>' +
    ' <th class="th-sms">Magnituda</th>' +
    ' <th class="th-sms">Thellesia</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' +
    //fillon data jon
    te_dhena +
    '</tbody>' +
    '</table>';

$("#tabela").append(myTable);
var clicked_tabel = false;

$("#table-icon").button().click(function (event) {
    if (clicked_tabel) {
        clicked_tabel = false;
        $('#table-icon').css('color', 'inherit');
    }
    else {
        clicked_tabel = true;
        $('#table-icon').css('color', 'blue');
    }
    $("#tabela").toggle(600);

});


// layer.options opens only when clicked
$(".leaflet-control-layers-toggle").on("mouseover", function () {
    //this will make sure that layer popup menu
    //not opens when mouseover
    event.stopPropagation();
});

// js i tabeles (2) - Checkbox version
$(document).ready(function () {
    $('#dt-all-checkbox').dataTable({

        columnDefs: [{
            orderable: false,
            className: 'select-checkbox select-checkbox-all',
            targets: 0

        }],
        select: {
            style: 'multi',
            selector: 'td:first-child'

        }
    });
});
//hapja modul ne laod te faqes
$(document).ready(function () {
    $("#centralModalInfo").modal('show');
});
//Mbushja modulit termeti fundit
var mag = earthQuakePoints[0][2];
if (mag > 4) {
    ngjyraModul = "#ff3547";
    c = "danger";
    c2 = "modal-" + c;
    c3 = "btn-" + c;
} else if (mag < 3) {
    ngjyraModul = "#33b5e5";
    c = "info";
    c2 = "modal-" + c
    c3 = "btn-" + c;
} else {
    ngjyraModul = "#fb3";
    c = "warning";
    c2 = "modal-" + c
    c3 = "btn-" + c;
}
var info = earthQuakePoints[0][0] + " <br> " + earthQuakePoints[0][1] + "<br>" + earthQuakePoints[0][3] + "<br> Thellesia: " + earthQuakePoints[0][6] + " km<br> <spam style='color:" + ngjyraModul + ";font-weight: 900;'> Magnituda: " + mag + "</spam>";
$("#infoTermet").append(info);
$("#llojiModulit").addClass(c2);
$("#butonModuli").addClass(c3);
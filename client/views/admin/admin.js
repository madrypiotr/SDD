Template.adminTemplate.helpers({
    usersCount: function () {
        return Users.find().count();
    },
    rodzajeCount: function () {
        return Rodzaj.find().count();
    },
    parametryCount: function () {
        return Parametr.find().count();
    },
    tematyCount: function () {
        return Temat.find().count();
    },
    raportyCount: function () {
        return Raport.find().count();
    },
    kwestieCount: function () {
        return Kwestia.find({czyAktywny: true}).count();
    }
});

function builtColumn() {
    $('#container-column').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: TXV.STAT_SYSTEM
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: [
                '',
                TXV.NR_OF_USERS,
                TXV.NR_OF_PARAMS,
                TXV.NR_OF_TYPES
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: TXV.NUMBER
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [
            {
                name: TXV.USERS,
                data: [Users.find().count()]
            },
            {
                name: TXV.TYPES,
                data: [Rodzaj.find().count()]
            },
            {
                name: TXV.PARAMS,
                data: [Parametr.find().count()]
            },
            {
                name: TXV.THREADS,
                data: [Temat.find().count()]
            },
            {
                name: TXV.REPORTS,
                data: [Raport.find().count()]
            },
            {
                name: TXV.ISSUES,
                data: [Kwestia.find({czyAktywny: true}).count()]
            }
        ]
    });
}
/*
 * Call the function to built the chart when the template is rendered
 */
Template.columnDemo.rendered = function () {
    builtColumn();
};
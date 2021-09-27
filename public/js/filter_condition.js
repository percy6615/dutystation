import zhdata from "./official/data_tw.js";
var isSelectedCountries = new Map();
var tempCountries = new Set();
tempCountries.add("大安區");
isSelectedCountries.set("台北市", tempCountries)


$(document).ready(function() {
    var lastSelected = $('#city option:selected').val();
    $('#city').multiselect({
        onChange: function(option, checked, select) {
            var countryselect = document.getElementById("country");
            if (isSelectedCountries.has(lastSelected)) {
                var tempCountries = new Set();
                for (var s of countryselect.options) {
                    if (s.selected) {
                        tempCountries.add(s.value);
                    }
                }
                isSelectedCountries.set(lastSelected, tempCountries);
            }
            lastSelected = $('#city').val()
            selectaction($('#city').val())
            $("#country").multiselect('rebuild');
        }
    });
});

$(document).ready(function() {
    $('#country').multiselect({
        numberDisplayed: 2,
        onChange: function(option, checked, select) {
            // alert('Changed option ' + $(option).val() + '.');
            console.log($(option))
            if (isSelectedCountries.has($('#city').val())) {
                var tempCountries = isSelectedCountries.get($('#city').val());
                if (checked) {
                    tempCountries.add($(option).val());
                } else {
                    tempCountries.delete($(option).val())
                }
            }

            initareapane(isSelectedCountries)
        }
    });
});


initCity();
selectaction("台北市");

function selectaction(setCity) {
    var cityselect = document.getElementById("city");
    var countryselect = document.getElementById("country");
    var tempCountries = new Set();
    if (isSelectedCountries.has(setCity)) {
        tempCountries = isSelectedCountries.get(setCity);
    }
    var cityNum = getCityNum(setCity);
    if (cityNum != -1) {
        $("#country").empty();
        for (var i = 0; i < zhdata['districts'][cityNum][0].length; i++) {
            var area = zhdata["districts"][cityNum][0][i];
            var isSelected = false;
            for (var s of tempCountries) {
                if (area == s) {
                    isSelected = true;
                    break;
                }
            }
            if (isSelected) {
                countryselect.add(new Option(area, area, true, true), i);
            } else {
                countryselect.add(new Option(area, area), i);
            }
        }
    }
    initareapane(isSelectedCountries);
}

function getCityNum(setCity) {
    for (var i = 0; i < zhdata["counties"].length; i++) {
        if (setCity == zhdata["counties"][i]) {
            return i;
        }
    }
    return -1;
}

function initCity() {
    var cityselect = document.getElementById("city");
    for (var i = 0; i < zhdata["counties"].length; i++) {
        cityselect.add(new Option(zhdata["counties"][i], zhdata["counties"][i]), i);
        if (!isSelectedCountries.has(zhdata["counties"][i])) {
            isSelectedCountries.set(zhdata["counties"][i], new Set())
        }
    }
}

function inittaiwan() {
    var countryselect = document.getElementById("country");
    var tempCountries = new Set();

    if (isSelectedCountries.has(zhdata["counties"][0])) {
        tempCountries = isSelectedCountries.get(zhdata["counties"][0]);
    }
    for (var i = 0; i < zhdata['districts'][0][0].length; i++) {
        var area = zhdata["districts"][0][0][i];
        var isSelected = false;
        for (var s of tempCountries) {
            if (area == s) {
                isSelected = true;
                break;
            }
        }
        if (isSelected) {
            countryselect.add(new Option(area, area, true, true), i);
        } else {
            countryselect.add(new Option(area, area), i);
        }
    }

    initareapane(isSelectedCountries);

}

function initareapane(isSelectedCountries) {
    $("#areapane").empty();
    for (var i = 0; i < zhdata["counties"].length; i++) {
        if (isSelectedCountries.has(zhdata["counties"][i])) {
            tempCountries = isSelectedCountries.get(zhdata["counties"][i]);
            if (tempCountries.size > 0) {
                $("<a>", {
                    class: "list-group-item-heading list-group-item-action list-group-item-primary",
                    href: "#",
                    text: zhdata["counties"][i],
                }).appendTo("#areapane")
                for (var t of tempCountries) {
                    $("<a>", {
                        class: "list-group-item list-group-item-action",
                        href: "#",
                        text: t,
                    }).appendTo("#areapane")
                }
            }
        }
    }
}

var start = moment().subtract(29, 'days');
var end = moment();

function cb(start, end) {
    $('#reportrange span').html(start.format('YYYY/MM/DD ') + ' - ' + end.format('YYYY/MM/DD '));
}
var reportrange = $("#reportrange").daterangepicker({
    "alwaysShowCalendars": true,
    opens: "left",
    timePicker: true,
    startDate: start,
    endDate: end,
    cancelButtonClasses: "btn-danger",
    // ranges: {
    //     "今天": [moment(), moment()],
    //     "過去 7 天": [moment().subtract(6, "days"), moment()],
    //     "本月": [moment().startOf("month"), moment().endOf("month")],
    //     "上個月": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
    // },
    locale: {
        format: "YYYY-MM-DD hh:mm A",
        separator: " ~ ",
        applyLabel: "確定",
        cancelLabel: "清除",
        fromLabel: "開始日期",
        toLabel: "結束日期",
        customRangeLabel: "自訂日期區間",
        daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
        monthNames: ["1月", "2月", "3月", "4月", "5月", "6月",
            "7月", "8月", "9月", "10月", "11月", "12月"
        ],
        firstDay: 1
    }
}, cb);


$("#reportrange").on("cancel.daterangepicker", function(ev, picker) {
    $('#reportrange span').html("");
});
$('#reportrange').on('apply.daterangepicker', function(ev, picker) {
    console.log(picker.startDate.format('YYYY-MM-DD hh:mm A'));
    console.log(picker.endDate.format('YYYY-MM-DD hh:mm A'));
    cb(picker.startDate, picker.endDate);
});
// $('#reportrange').data('daterangepicker').setStartDate(moment('2014/03/01'));
// $('#reportrange').data('daterangepicker').setEndDate(moment('2014/03/31'));



cb(start, end);


var daterange = $("#reportrange").data('daterangepicker');
daterange.setMinDate = function(minDate) {
    if (typeof minDate === 'string')
        this.minDate = moment(minDate, this.locale.format);

    if (typeof minDate === 'object')
        this.minDate = moment(minDate);

    if (!this.timePicker)
        this.minDate = this.minDate.startOf('day');

    if (this.timePicker && this.timePickerIncrement)
        this.minDate.minute(Math.round(this.minDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

    if (this.minDate && this.startDate.isBefore(this.minDate)) {
        this.startDate = this.minDate.clone();
        if (this.timePicker && this.timePickerIncrement)
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
    }

    if (!this.isShowing)
        this.updateElement();

    this.updateMonthsInView();
}

daterange.setMaxDate = function(maxDate) {
    if (typeof maxDate === 'string')
        this.maxDate = moment(maxDate, this.locale.format);

    if (typeof maxDate === 'object')
        this.maxDate = moment(maxDate);

    if (!this.timePicker)
        this.maxDate = this.maxDate.startOf('day');

    if (this.timePicker && this.timePickerIncrement)
        this.maxDate.minute(Math.round(this.maxDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

    if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
        this.startDate = this.maxDate.clone();
        if (this.timePicker && this.timePickerIncrement)
            this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
    }

    if (!this.isShowing)
        this.updateElement();

    this.updateMonthsInView();
}

daterange.setMinDate(start);
daterange.setMaxDate(end);
import MapClass from "/js/map/map_class.js";
import zhdata from "./official/data_tw.js";


$(function() {
    var mapClass = new MapClass();

    $("#sysmap").on("click", function(e) {

        clickMenu(".map");

    });

    $("#sysalbum").on("click", function(e) {
        clickMenu(".album");
        showImages();
    });

    $("#syschart").on("click", function(e) {
        clickMenu(".chart");
    });


    $("#sysprofile").on("click", function(e) {
        clickMenu(".profile");
    });

    $("#sysproject").on("click", function(e) {
        createprojectmodal();
        $("#exampleModalScrollable").modal()
    });

    $(".sidebar-nav > .sidebar-item").on("click", function() {
        $(".sidebar-nav > .sidebar-item.active").removeClass('active')
        $(this).addClass('active')
    });

    $(".sidebar-nav + .sidebar-item + .sidebar-item.active + .sidebar-link").on("click", function() {
        $(".sidebar-nav + .sidebar-item  + .sidebar-item.active").removeClass('active');
        $(this).addClass('active');
        console.log($(this))
    });

    $("#orgmanager").on("click", function(e) {
        clickMenu(".org");
        $(' #s1 ').trigger("click");
        $('#s1').tab('show');
    });

    $("#permanager").on("click", function(e) {
        clickMenu(".org");
        $(' #s2 ').trigger("click");
        $('#s2').tab('show');
    });

    $("#jobmanager").on("click", function(e) {
        clickMenu(".org");
        $(' #s3 ').trigger("click");
        $('#s3').tab('show');
    });

    $("#fullscreen").on("click", function(e) {
        var content = document.getElementById('whole');
        if ((document.fullscreen)) {
            //退出全屏
            var el = document,
                cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
                wscript;

            if (typeof cfs != "undefined" && cfs) {
                cfs.call(el);
                return;
            }

            if (typeof window.ActiveXObject != "undefined") {
                wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                }
            }
        } else {
            //進入全屏
            var rfs = content.requestFullScreen || content.webkitRequestFullScreen || content.mozRequestFullScreen || content.msRequestFullScreen,
                wscript;

            if (typeof rfs != "undefined" && rfs) {
                rfs.call(content);
                return;
            }

            if (typeof window.ActiveXObject != "undefined") {
                wscript = new ActiveXObject("WScript.Shell");
                if (wscript) {
                    wscript.SendKeys("{F11}");
                }
            }
        }
    });

    $(".toggle-check-input").on('change', function() {
        var isopen = mapClass.satelliteMap();
        this.checked = isopen;
        if (this.checked) {
            $("#lb_satellite").css("color", "white");
        } else {
            $("#lb_satellite").css("color", "black");
        }
    });

    $("#online-header").on("click", function(e) {
        var clientHeight = $("#online-content").height()
        if (clientHeight > 0) {
            $("#online-content").animate({
                height: "0px",
            }, 250);
        } else {
            $("#online-content").animate({
                height: "125px",
            }, 500);
        }
    });
    $("#popup-closer").on("click", function(e) {
        mapClass.overlay.setVisible(false);
    })
    $("#disasterreport").on("click", function(e) {
        fixedElementanimate()
    });

    $("#filterdata").on("click", function(e) {
        createfiltermodal();
        $("#exampleModalScrollable").modal()
    });

    $("#filterdataicon").on("click", function(e) {
        createfiltermodal();
        $("#exampleModalScrollable").modal()
    });

    // var start = new Date();
    // // set end date to max one year period:
    // var end = new Date(new Date().setYear(start.getFullYear() + 1));

    // $("#datepicker1").datepicker({
    //     changeMonth: true,
    //     changeYear: true,
    //     step: 5,
    //     multidate: true,
    //     closeOnDateSelect: true
    //         // showOn:"both"
    // });
    // $("#datepicker1").datepicker('option', 'maxDate', end);
    // $("#datepicker1").datepicker('option', 'minDate', start);
    // $("#datepicker1").datepicker('setDate', new Date());
    // $("#datepicker1").on("change", function(e) {
    //     console.log(123)
    // });
    // $("#btn1").click(function(e) {
    //     $("#datepicker1").datepicker("show");
    // });


    // https://codepen.io/kolibanuch/pen/QXveqV

    $.contextMenu({
        selector: '.map',
        callback: function(key, options) {
            // var m = "clicked: " + key;
            // window.console && console.log(m) || alert(m);
            // console.log(options)
            if (key == "refresh") {
                mapClass.getMap().updateSize()
                mapClass.overlay.setPosition(undefined);
            } else if (key == "rotate") {
                var angle = mapClass.getMap().getView().getRotation();
                mapClass.getMap().getView().setRotation(angle + Math.PI / 2)
            } else if (key == "quit") {
                mapClass.getMap().getView().setRotation(0)
            }
        },
        items: {

            "refresh": {
                name: "更新",
                icon: "fas fa-retweet"
            },
            "rotate": {
                name: "向右90度",
                icon: "fas fa-infinity"
            },
            "sep1": "---------",
            "quit": {
                name: "Quit",
                icon: function() {
                    return 'context-menu-icon context-menu-icon-quit';
                }
            }
        }

    });
    $("#syshelp").on("click", function(e) {

    });
    // window._map = _map
    window.mapClass = mapClass

});



var isSelectedCountries = new Map();
var tempCountries = new Set();
// tempCountries.add("大安區");
// isSelectedCountries.set("台北市", tempCountries)


function selectaction(isSelectedCountries, setCity) {
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

function initCity(isSelectedCountries) {
    var cityselect = document.getElementById("city");
    for (var i = 0; i < zhdata["counties"].length; i++) {
        cityselect.add(new Option(zhdata["counties"][i], zhdata["counties"][i]), i);
        if (!isSelectedCountries.has(zhdata["counties"][i])) {
            isSelectedCountries.set(zhdata["counties"][i], new Set())
        }
    }
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


function createfiltermodal() {
    if ($("#exampleModalScrollable > div").find(".modal-content").length > 0) {
        $("#exampleModalScrollable > div").empty();
    }
    var header = $("<div>", {
            class: "modal-header"
        }).append($("<h3>", {
            class: "modal-title",
            id: "exampleModalScrollableTitle",
            text: "條件設定"
        }))
        .append($("<button>", {
            class: "close",
            "data-dismiss": "modal",
            "aria-label": "Close",
            html: ' <span aria-hidden="true">&times;</span>'
        }));
    var body = $("<div>", {
            class: "modal-body"
        }).append($("<h6>", {
            style: "color:gray",
            text: "時間區間"
        })).append($("<div>", {
            id: "reportrange",
            style: "background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc; width: 100%;margin-left:10px;",
            html: '<i class="fa fa-calendar"></i>&nbsp; <span></span> <i class="fa fa-caret-down"></i>'
        })).append("<hr></hr>")
        .append($("<h6>", {
            style: "color:gray",
            text: "區域"
        })).append($("<span>", {
            style: "font-size: 12px;color:dimgray;margin-left:10px;",
            html: '縣市: <select id="city" style="font-size:13px"></select>'
        })).append($("<span>", {
            style: "font-size: 12px;color:dimgray;margin-left:10px;",
            html: ' 區域: <select id="country" multiple="multiple" style="padding:5px;height: 50px;font-size:13px"></select>'
        })).append("</br>")
        .append($("<h7>", {
            style: "font-size: 12px;color:dimgray;margin-left:10px;",
            text: "所選擇區域:"
        })).append($("<div>", {
            id: "areapane",
            class: "list-group scrollbar-style",
            style: "margin-top: 5px; overflow: auto;max-height:150px;border-style:double;margin-left:10px;"
        }));
    var foot = $("<div>", {
        class: "modal-footer"
    }).append($("<button>", {
        class: "btn btn-secondary",
        "data-dismiss": "modal",
        id: "modalreportcancel",
        text: "關閉",
    })).append($("<button>", {
        class: "btn btn-primary",
        id: "modalreportconfirm",
        text: "發佈",
    }))
    var content = $("<div>", {
        class: "modal-content"
    }).append(header).append(body).append(foot);
    $("#exampleModalScrollable > div").append(content);

    var start = moment().subtract(7, 'days');
    var end = moment();
    createcalendar(start, end, start, end);


    initCity(isSelectedCountries);
    selectaction(isSelectedCountries, "台北市");



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
            selectaction(isSelectedCountries, $('#city').val())
            $("#country").multiselect('rebuild');
        }
    });

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




}

function createcalendar(start, end, mindate, maxdate) {

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

    var daterange = reportrange.data('daterangepicker');
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

    $("#reportrange").on("cancel.daterangepicker", function(ev, picker) {
        $('#reportrange span').html("");
    });
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
        // console.log(picker.startDate.format('YYYY-MM-DD hh:mm A'));
        // console.log(picker.endDate.format('YYYY-MM-DD hh:mm A'));
        cb(picker.startDate, picker.endDate);
    });

    daterange.setMinDate(mindate);
    daterange.setMaxDate(maxdate);
    cb(start, end);
}

function createprojectmodal() {

    if ($("#exampleModalScrollable > div").find(".modal-content").length > 0) {
        $("#exampleModalScrollable > div").empty();
    }
    var header = $("<div>", {
            class: "modal-header"
        }).append($("<h3>", {
            class: "modal-title",
            id: "exampleModalScrollableTitle",
            text: "發佈專案"
        }))
        .append($("<button>", {
            class: "close",
            "data-dismiss": "modal",
            "aria-label": "Close",
            html: ' <span aria-hidden="true">&times;</span>'
        }));

    var body = $("<div>", {
        class: "modal-body"
    });

    var foot = $("<div>", {
        class: "modal-footer"
    }).append($("<button>", {
        class: "btn btn-secondary",
        "data-dismiss": "modal",
        id: "modalreportcancel",
        text: "關閉",
    })).append($("<button>", {
        class: "btn btn-primary",
        id: "modalreportconfirm",
        text: "發佈",
    }))

    var content = $("<div>", {
        class: "modal-content"
    }).append(header).append(body).append(foot);

    $("#exampleModalScrollable > div").append(content);

    $("#modalreportcancel").on("click", function(e) {
        //TODO
    });

    $("#modalreportconfirm").on("click", function(e) {
        //TODO
    });
}

function fixedElementanimate() {
    var position = $('.fixedElement').position();
    var percentLeft = position.left / $(window).width() * 100;
    var percentTop = position.top / $(window).height() * 100;

    if (percentTop > 60) {
        $(".fixedElement").animate({
            top: "20%",
        }, 250);
    } else {
        $(".fixedElement").animate({
            top: "100%",
        }, 100);
    }
}



function clickMenu(type) {
    if ($(type).is(":hidden")) {
        $("main > div").css("display", "none");
        $(type).fadeIn();
        $(type).fadeIn("slow");
        $(type).fadeIn("10000");
        $(type).css("display", "block");
    }

}
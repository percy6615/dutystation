import MapClass from "/js/map/map_class.js";



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
        $("#exampleModalScrollable").modal()
    });

    $(".sidebar-item").on("click", function() {
        $(".sidebar-item.active").removeClass('active')
        $(this).addClass('active')
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
        if (isFullscreenEnabled()) {
            exitFullScreen();
        } else {
            fullScreen(content);
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
        fun()
    });
    $("#datepicker1").datepicker({
        changeMonth: true,
        changeYear: true
    });
    $("#datepicker1").datepicker('setDate', new Date());
    $("#datepicker1").on("change", function(e) {
        console.log(123)
    });
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
            // copy: {
            //     name: "Copy",
            //     icon: "copy"
            // },
            // "paste": {
            //     name: "Paste",
            //     icon: "paste"
            // },
            // "delete": {
            //     name: "Delete",
            //     icon: "delete"
            // },
            "sep1": "---------",
            "quit": {
                name: "Quit",
                icon: function() {
                    return 'context-menu-icon context-menu-icon-quit';
                }
            }
        }

    });

    // window._map = _map
    window.mapClass = mapClass

})

function fun() {
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

//進入全屏
function fullScreen(el) {
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
        wscript;

    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
    }

    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript) {
            wscript.SendKeys("{F11}");
        }
    }
}

//退出全屏
function exitFullScreen() {
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
}

function isFullscreenEnabled() {
    return (document.fullscreen);
}
import MapClass from "/js/map/map_class.js";



$(function () {
  var mapClass = new MapClass();

  $("#sysmap").on("click", function (e) {

    clickMenu(".map");

  })

  $("#syschart").on("click", function (e) {
    clickMenu(".org");
  });

  $("#profile").on("click", function (e) {

  });

  $(".sidebar-item").on("click", function () {
    $(".sidebar-item.active").removeClass('active')
    $(this).addClass('active')
  });

  $("#orgmanager").on("click", function (e) {
    clickMenu(".org");
    $(' #s1 ').trigger("click");
    $('#s1').tab('show');
  });

  $("#permanager").on("click", function (e) {
    clickMenu(".org");
    $(' #s2 ').trigger("click");
    $('#s2').tab('show');
  });

  $("#jobmanager").on("click", function (e) {
    clickMenu(".org");
    $(' #s3 ').trigger("click");
    $('#s3').tab('show');
  });

  $("#bigsmall").on("click", function (e) {
    var content = document.getElementById('whole');
    if (isFullscreenEnabled()) {
      exitFullScreen();
    } else {
      fullScreen(content);
    }
  });

  $(".toggle-check-input").on('change', function () {
    var isopen = mapClass.satelliteMap();
    this.checked = isopen;
    if (this.checked) {
      $("#lb_satellite").css("color", "white");
    } else {
      $("#lb_satellite").css("color", "black");
    }
  });

  $("#online-header").on("click", function (e) {
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
  })
})

// window._map = _map
// window.mapClass = mapClass
function clickMenu(type) {
  if ($(type).is(":hidden")) {
    $("main > div").css("display", "none");
    $(type).fadeIn();
    $(type).fadeIn("slow");
    $(type).fadeIn("10000");
    $(type).css("display", "block");
  }

}


// $('#myTab a').on('click', function (e) {
//   e.preventDefault()
//   $(this).tab('show')
//   $(this).click();
// })







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


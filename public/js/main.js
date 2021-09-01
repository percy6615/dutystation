import MapClass from "/js/map/map_class.js";
var mapClass = new MapClass();
var _map = mapClass.getMap();


$(document).ready(function () {

  $("#manager").on("click", function (e) {

    clickMenu(".map");
    
  })

  $("#profile").on("click", function (e) {

    clickMenu(".org");
  });

  $("#setting").on("click", function (e) {

  });

  $(".sidebar-item").click(function () {
    $(".sidebar-item.active").removeClass('active')
    $(this).addClass('active')
  });

  $("#floatLayerSetting").on("click", function (e) {

  });


  $(".toggle-check-input").change(function () {
    var isopen = mapClass.satelliteMap();
    this.checked = isopen;
    if (this.checked) {
      $("#lb_satellite").css("color", "white");

    } else {
      $("#lb_satellite").css("color", "black");
    }
  });
 $("#online-header").on("click",function(e){
  var clientHeight = document.getElementById('online-content').clientHeight;

  if (clientHeight > 0) {
    $("#online-content").animate({
      height: "0px",
    }, 500);
  } else {
    $("#online-content").animate({
      height: "100px",
    }, 1000);
  }
 })
})

// window._map = _map
// window.mapClass = mapClass
function clickMenu(type) {
  $("main > div").css("display", "none");
  $(type).fadeIn();
  $(type).fadeIn("slow");
  $(type).fadeIn("10000");
  $(type).css("display", "block");
}


// $('#myTab a').on('click', function (e) {
//   e.preventDefault()
//   $(this).tab('show')
//   $(this).click();
// })








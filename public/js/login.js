(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$(".toggle-password").click(function() {

	  $(this).toggleClass("fa-eye fa-eye-slash");
	  var input = $($(this).attr("toggle"));
	  if (input.attr("type") == "password") {
	    input.attr("type", "text");
	  } else {
	    input.attr("type", "password");
	  }
	});

})(jQuery);

$(document).ready(function(){
	
	if(Cookies.get("remember")=="true"){
		// $("#remember").prop("checked",true);
		console.log(Cookies.get("username"));
		console.log(Cookies.get("password"));
		$("#username-field").val(Cookies.get("username"));
		 $("#password-field").val(Cookies.get("password"));
	}else{
		$("#remember").prop("checked",false);
	}
});

$("#btn_login").on("click",function(){
	remember();
	return true;
});

$("#remember").on("change",function(){
	remember();
	// return true;
});

function remember(){
	var checkd = $("#remember").prop("checked");
	if(checkd == "checked" || checkd){
		var username = $("#username-field").val();
		var password = $("#password-field").val();
		Cookies.set("remember",true,{expires:30});
		Cookies.set("username",username,{expires:30});
		Cookies.set("password",password,{expires:30});
	}else{
		Cookies.set("remember",false,{expires:30});
		Cookies.set("username","",{expires:30});
		Cookies.set("password","",{expires:30});
	}
}

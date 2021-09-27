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
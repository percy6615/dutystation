import zhdata from "./official/data_tw.js";
var isSelectedCountries = new Map();
var tempCountries = new Set();
// tempCountries.add("大安區");
// isSelectedCountries.set("台北市", tempCountries)


$(document).ready(function() {
    var lastSelected = $('#city option:selected').val();
    $('#city').multiselect({
        onChange: function(option, checked, select) {
            var countryselect = document.getElementById("country");

            if (isSelectedCountries.has(lastSelected)) {
                var tempCountries = new Set();
                for (var s of countryselect.options) {
                    tempCountries.add(s.value);
                }
                isSelectedCountries.set(lastSelected, tempCountries);
            }
            // $('#country option').remove();
            removeOption(countryselect);

            $("#country").multiselect('rebuild');
        }
    });
});

$(document).ready(function() {
    $('#country').multiselect({
        numberDisplayed: 4,
        onChange: function(option, checked, select) {
            alert('Changed option ' + $(option).val() + '.');
        }
    });
});

function removeOption(myselect) {
    var length = myselect.length;
    var index = 0;

    for (var i = length - 1; i >= index; i--) {
        myselect[i].remove();
    }
}
inittaiwan();

function inittaiwan() {
    var cityselect = document.getElementById("city");
    var countryselect = document.getElementById("country");
    var tempCountries = new Set();
    for (var i = 0; i <
        zhdata["counties"].length; i++) {
        cityselect.add(new Option(zhdata["counties"][i], zhdata["counties"][i]), i);
        if (!isSelectedCountries.has(zhdata["counties"][i])) {
            isSelectedCountries.set(zhdata["counties"][i], new Set())
        }
    }
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
}
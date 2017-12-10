function getDataForCity(method, position) {
    var url = '';
    switch (method) {
        case 1:
            var city = $('#search-input').val();
            url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=e1f9f02ede94a68151d5da6526adf447';
            break;
        case 2:
            var pos = position;
            url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&units=metric&APPID=e1f9f02ede94a68151d5da6526adf447';
            break;
        default:
            alert('Invalid method id in getDataForCity function');
    }

    $.get(url, function (data) {
        $('#cityName').html(data.name);
        $('#state').html(getCountryName(data.sys.country));

        var date = new Date(data.dt * 1000);
        $('#dateTime').html(date.toUTCString());

        $('#weather-description img').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
        $('#weather-description span').html(data.weather[0].description);
        $('.max').html(data.main.temp_max);
        $('.min').html(data.main.temp_min);
        $('#temp-value').html(parseInt(data.main.temp));

        $('#could-coverage .details-info').html(data.clouds.all);
        $('#pressure .details-info').html(data.main.pressure);
        var vis = parseFloat(data.visibility).toFixed(2) / 1000;
        $('#visibility .details-info').html(vis);
        $('#humidity .details-info').html(data.main.humidity);

        var sunrise = new Date(data.sys.sunrise * 1000);
        $('#sunrise .details-info').html(formatNumber(sunrise.getHours()) + ':' + formatNumber(sunrise.getMinutes()) + ':' + formatNumber(sunrise.getSeconds()));

        var sunset = new Date(data.sys.sunset * 1000);
        $('#sunrise .details-info').html(formatNumber(sunrise.getHours()) + ':' + formatNumber(sunrise.getMinutes()) + ':' + formatNumber(sunrise.getSeconds()));
        $('#sunset .details-info').html(formatNumber(sunset.getHours()) + ':' + formatNumber(sunset.getMinutes()) + ':' + formatNumber(sunset.getSeconds()));

        $('#degrees .details-info').html(data.wind.deg);
        $('#speed .details-info').html(data.wind.speed);

        var latitude = data.coord.lat;
        var longitude = data.coord.lon;

        $('.map img').attr('src', 'https://maps.googleapis.com/maps/api/staticmap?center=' + latitude + ',' + longitude + '&zoom=13&scale=1&size=640x400&maptype=roadmap&key=AIzaSyB1clf7Qj9njxltXBOESK2xqKsydWjqLhs&format=png&visual_refresh=true');
    })
}

function getCountryName(countryCode) {

    var index = 0;
    var found;
    var entry;
    for (index = 0; index < countries.length; ++index) {
        entry = countries[index];
        if (entry.code == countryCode) {
            found = entry.name;
            break;
        }
    }
    return found;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    getDataForCity(2, position);
}

function formatNumber(n) {
    return n > 9 ? "" + n : "0" + n;
}

$('#btn-search').on('click', function (event) {
    getDataForCity(1);
});
$('#btn-locate').on('click', function (event) {
    getLocation();
});

$(function () {
    getLocation();
})


var citiesNames = new Array();
Object.keys(cities).forEach(function (key) {
    //get the value of name
    var val = cities[key]["name"];
    //push the name string in the array
    citiesNames.push(val);
});

$('#search-input').autocomplete({
    source: function (request, response) {
        var results = $.ui.autocomplete.filter(citiesNames, request.term);
        if (results.length > 10) {
            response(results.slice(0, 10));
        } else {
            response(results);
        }

    },
    minLength: 4,
    delay: 400,
    select: function (event, ui) {
        // To be searched with ID for more precision
        var index = citiesNames.indexOf(ui.item.value);
        //console.log(cities[index].id);
    }
});



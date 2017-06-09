
var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];


function setImage(weathertype){
	img_urls = {
		"rain": 'img/rain.jpg',
		"snow": 'img/snowflake.jpg',
		"wind": 'img/wind.jpg',
		"clear-day": "img/clear-day.jpg",
		"clear-night": "img/clear-night.jpg",
		"partly-cloudy-day": "img/cloudy_day.jpg",
		"partly-cloudy-night": "img/cloudy-night.jpg",
		"cloudy": "img/cloudy_day.jpg",
		"fog": "img/fog.jpg",
		"sleet": "img/sleet.jpg"
	}
	$(document.body).css({
	"background": 'url(' + img_urls[weathertype] + ') no-repeat',
	"background-size": 'cover'
	});		
}

function getLatLong(){
	 return $.ajax({
			method: "GET",
			url: "https://freegeoip.net/json/"	
	})
}


function fillDayData(day, dayData){
	var daySelect = "#" + day + " > p > span";
	// $(daySelect + ".temperature_value").text(dayData.temperature);
	var date =  new Date(dayData.time*1000);
	$(daySelect + ".date_value").text(date.toString().slice(0,16));
	$(daySelect + ".summary_value").text(dayData.summary);
	$(daySelect + ".pressure_value").text(dayData.pressure);
	$(daySelect + ".humidity_value").text(dayData.humidity);
}


function getWeather(coordinates){
	var weatherAPIKey = "a85838678a70f528a5a7e69c73908506";
	var weatherurl = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/"
	$.ajax({
		method: "GET",
		url: weatherurl + weatherAPIKey + "/" + coordinates[0] + "," + coordinates[1] + "?units=si",
		success: function(data){
			console.log(data);

			// Set values for current tab
			var currentTabSelector = "#current > p > span";
			$(currentTabSelector + ".temperature_value").text(data.currently.temperature);						// String.fromCharCode(176) == degree symbol
			$(currentTabSelector + ".summary_value").text(data.currently.summary);
			$(currentTabSelector + ".pressure_value").text(data.currently.pressure);
			$(currentTabSelector + ".humidity_value").text(data.currently.humidity);
			$(currentTabSelector + ".timezone_value").text(data.timezone);

			var date = new Date(data.currently.time*1000);
			$(currentTabSelector + ".date_value").text(date.toString().slice(0,16));
			$(currentTabSelector + ".time_value").text(date.toString().slice(16,25));



			//Set values for over the week tab	
			var today = new Date(data.daily.data["0"].time*1000);	
			var todayIndex = today.getDay();
			for(var i = 0; i<7;i++){
				fillDayData(days[(todayIndex+i)%7], data.daily.data[i]);
			};


			//fade in data and set background image
			$("#fetch_data").fadeOut("slow", function(){
				$("#weather").fadeIn("slow");
			});
			setImage(data.currently.icon);
				
		}
	})
}


function celsiusToFahrenheit(celsius){
	return Math.round(((celsius*9/5) + 32)*100)/100;
}

function fahrenheitToCelsius(fahrenheit){
	return Math.round(((fahrenheit-32)/1.8)*100)/100;
}

$(document).ready(function(){

	var loading = true;
	var dots = 1
	var loader = setInterval(function(){
		if (loading===true){
			$("#loading").text(".".repeat((dots%4)+1));
			dots += 1;
		}
	}, 500)

	getLatLong().done(function(data){
		getWeather([data.latitude, data.longitude]);
	})

	$(document.body).on("click", ".convert", function(){
		var grandParentid = $(this).parent().parent().attr('id');
		$(this).text(function(index, text){
			if (text==="C"){
				$("#" + grandParentid + " > p > span.temperature_value").text(function(index, text){
					return celsiusToFahrenheit(parseFloat(text))
				})	
				return "F";
			} else {
				$("#" + grandParentid + " > p > span.temperature_value").text(function(index, text){
					return fahrenheitToCelsius(parseFloat(text));
				})
				return "C";
			}
		})
	})
})

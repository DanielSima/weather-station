//I've used resources from:
//https://www.chartjs.org/doc
//https://github.com/cferdinandi/smooth-scroll
//https://materializecss.com/getting-started.html
//https://www.w3schools.com/
//https://stackoverflow.com/

var primaryColor = '#3949ab';
var secondaryColor = 'rgba(57, 73, 172, 0.15)';
var database;
var data = [[], [], [], [], [], []];
var labels = [[], [], [], [], [], []];
var getcharts = []; //charts in html
var charts = []; //objects in js
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var table = document.getElementById("table");
getcharts[0] = document.getElementById('myChart1').getContext('2d');
getcharts[1] = document.getElementById('myChart2').getContext('2d');
getcharts[2] = document.getElementById('myChart3').getContext('2d');
getcharts[3] = document.getElementById('myChart4').getContext('2d');
getcharts[4] = document.getElementById('myChart5').getContext('2d');
getcharts[5] = document.getElementById('myChart6').getContext('2d');

//get json from php from database
var oReq = new XMLHttpRequest();
oReq.open("get", "db.php", true);
oReq.send();

//this will execute when data is loaded
oReq.onreadystatechange = function () {
	if (oReq.readyState === 4) {

		//convert it to array
		database = JSON.parse(this.responseText);

		//do stuff with data
		SimplifyData(database);

		//set the image
		document.getElementById('mainImage').src = LoadImage();

		//set current data at the top of the page
		document.getElementById('currentTemp').innerHTML = "Current temperature is " + data[0][23] + "°C";
		document.getElementById('currentHum').innerHTML = "Current humidity is " + data[1][23] + "RH";

		//fill charts
		for (i = 0; i < 6; i++) {
			AddData(charts[i], labels[i], data[i]);
		}

		//create table
		CreateTable(table);

		//disconnect
		oReq.abort();
	}
};

//all below should load without waiting for data

//initialize hamburger menu (for every device eve though it is used only on phone)
document.addEventListener('DOMContentLoaded', function () {
	var elems = document.querySelectorAll('.sidenav');
	var instances = M.Sidenav.init(elems, {
		inDuration: 350,
		outDuration: 350,
		edge: 'right',
		draggable: true
	});
});

//initialize all charts (without data)
for (i = 0; i < 6; i++) {
	charts[i] = new Chart(getcharts[i], {
		type: 'line',
		data: {
			//labels: fill after loaded with AddData()
			datasets: [{
				label: "Temperature",
				backgroundColor: secondaryColor,
				borderColor: primaryColor,
				//data: fill after loaded with AddData()
			}]
		},
		options: {
			responsive: true,
			tooltips: {
				callbacks: {
					label: (item) => `${item.yLabel} °C`,
				},
			},
			scales: {
				yAxes: [{
					ticks: {
						callback: function (value, index, values) {
							return value + '°C';
						}
					}
				}]
			}
		}
	});
}

//change every second chart to humidity
for (i = 0; i < 6; i++) {
	if (i == 1 || i == 3 || i == 5) {
		charts[i].data.datasets[0].label = 'Humidity';
		charts[i].options.tooltips.callbacks.label = (item) => `${item.yLabel} RH`;
		charts[i].options.scales.yAxes[0].ticks.callback = function (value, index, values) {
			return value + ' RH'
		};
		charts[i].update();
	}
}

//initialize smooth scrolling
var scroll = new SmoothScroll('a[href*="#"]', {

	//for offset
	header: "nav",

	speed: 500,
	speedAsDuration: true,
	easing: 'easeInOutCubic',

	//another offset
	offset: function (anchor, toggle) {
		return 10
	},
});

//functions below
function CreateTable(table) {
	for (i = 0; i < database[0].length; i++) {

		//this appends at the end of table
		table.insertRow(-1);

		for (j = 0; j < 3; j++) {
			table.rows[i + 1].insertCell(j).innerHTML = database[0][i][j];
		}
	}
}

function GetDayOfWeek(date) {
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'short'
	}).format(date);
}

//I have totally not made this, it was probably Stephen Hawking RIP or some one as smart as him
function GetNumberWithOrdinal(n) {
	var s = ["th", "st", "nd", "rd"],
		v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

//dont even try to figure out whats going on here
//to put it simply it takes the raw data from database and format it, reorder it and similiar stuff
function SimplifyData(database) {

	//database[select][row][column]
	for (i = 0; i < database[0].length; i++) {
		//23 - i so its correctly ordered
		labels[0][23 - i] = new Date(database[0][i][0]).getHours() + ":00";
		data[0][23 - i] = database[0][i][1];
		labels[1] = labels[0];
		data[1][23 - i] = database[0][i][2];
	}
	for (i = 0; i < database[1].length; i++) {
		labels[2][41 - i] = GetDayOfWeek(new Date(database[1][i][0]));
		data[2][41 - i] = database[1][i][1];
		labels[3] = labels[2];
		data[3][41 - i] = database[1][i][2];
	}
	for (i = 0; i < database[2].length; i++) {
		labels[4][30 - i] = GetNumberWithOrdinal(new Date(database[2][i][0]).getDate()); //number of day
		data[4][30 - i] = database[2][i][1];
		labels[5] = labels[4];
		data[5][30 - i] = database[2][i][2];
	}
}

//adding data to charts
function AddData(chart, label, data) {
	chart.data.labels = label;
	chart.data.datasets.forEach((dataset) => {
		dataset.data = data;
	});
	chart.update();
}

//select image
//keep in mind that its not accurate because its based purely on time, temperature and humidity
function LoadImage() {
	day = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
	src = "/weather_icons/unknown.png";
	temp = data[0][23];
	hum = data[1][23];
	if (day.includes(new Date(database[0][0][0]).getHours())) {
		if (temp <= 0 && hum <= 50) {
			src = "/weather_icons/snow-day.png";
		} else if (temp <= 0 && hum > 50) {
			src = "/weather_icons/rain-snow-day.png";
		} else if (temp <= 15 && hum <= 50) {
			src = "/weather_icons/mostly-cloudy.png";
		} else if (temp <= 15 && hum > 50) {
			src = "/weather_icons/rainy-day.png";
		} else if (temp <= 50 && hum <= 50) {
			src = "/weather_icons/clear-day.png";
		} else if (temp <= 50 && hum > 50) {
			src = "/weather_icons/thunder-day.png";
		}
	} else {
		if (temp <= 0 && hum <= 50) {
			src = "/weather_icons/snow-night.png";
		} else if (temp <= 0 && hum > 50) {
			src = "/weather_icons/rain-snow-night.png";
		} else if (temp <= 15 && hum <= 50) {
			src = "/weather_icons/mostly-cloudy-night.png";
		} else if (temp <= 15 && hum > 50) {
			src = "/weather_icons/rainy-night.png";
		} else if (temp <= 50 && hum <= 50) {
			src = "/weather_icons/clear-night.png";
		} else if (temp <= 50 && hum > 50) {
			src = "/weather_icons/thunder-night.png";
		}
	}
	return src;
}

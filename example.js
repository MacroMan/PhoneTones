/*
 * Ajax function. Don't use this in production
 */
function ajax(url, callback) {
	var xmlhttp;
	// compatible with IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			callback(xmlhttp.responseText);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}


/*
 * Example starts here
 */
var tones = new PhoneTones();

tones.on('step-reset', function (repeats) {
	if (repeats >= 3) {
		tones.stop();
	}
});

ajax('tones.json', function (data) {
	var json = JSON.parse(data);
	tones.play(json.uk.tones.info);
});

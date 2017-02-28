function PhoneTones(tone) {
	_this = this;

	var ringContext = new (window.AudioContext || window.webkitAudioContext)();
	var modulators = [], carriers = [];
	modulators[0] = new Modulator(0);
	carriers[0] = new Carrier(0);
	modulators[0].gain.connect(carriers[0].osc.frequency);

	modulators[1] = new Modulator(0);
	carriers[1] = new Carrier(0);
	modulators[1].gain.connect(carriers[1].osc.frequency);

	function Carrier(freq) {
		this.gain = ringContext.createGain();
		this.gain.gain.value = 0;
		this.osc = ringContext.createOscillator();
		this.osc.type = 'sine';
		this.osc.frequency.value = freq;
		this.osc.connect(this.gain);
		this.gain.connect(ringContext.destination);
		this.osc.start(0);
	}

	function Modulator(freq) {
		this.gain = ringContext.createGain();
		this.gain.gain.value = 100;
		this.osc = ringContext.createOscillator();
		this.osc.type = 'sine';
		this.osc.frequency.value = freq;
		this.osc.connect(this.gain);
		this.osc.start(0);
	}

	function setFrequency(frequency) {
		channels = frequency.toString().split('+');
		for (var i in channels) {
			var parts = channels[i].toString().split('*');
			modulators[i].osc.frequency.value = (parts[1]) ? parts[1] : 0;
			carriers[i].osc.frequency.value = parts[0];
		}
	}

	function start() {
		carriers[0].gain.gain.value = 1;
		carriers[1].gain.gain.value = 1;
	}

	this.stop = function () {
		fireEvent('stop');
		carriers[0].gain.gain.value = 0;
		carriers[1].gain.gain.value = 0;
		setFrequency('0*0+0*0');
		clearTimeout(timer);
		steps = [];
		step = 0;
		repeat = 0;
	};

	var steps = [], step = 0, repeat = 0, timer;
	_this.step = 0;
	_this.repeat = 0;
	this.play = function (tone) {
		fireEvent('play');
		steps = tone.toString().split(',');
		step = 0;
		repeat = 0;
		setFrequency('0*0+0*0');
		start();
		next();

		function next() {
			if (!steps[step]) {
				// Start again if no steps left
				repeat++;
				fireEvent('repeat', repeat);
				step = 0;
				if (!steps[step]) {
					// Exit if there are no steps left
					fireEvent('end');
					_this.stop();
					return;
				}
			}

			fireEvent('step', step, repeat);
			var split = steps[step].toString().split('/');
			var frequency = split[0];
			var time = split[1];

			if (frequency.substring(0, 1) == '!') {
				steps.shift();
			} else {
				step++;
			}

			setFrequency('0*0+0*0');
			setFrequency(frequency.replace('!', ''));

			if (time) {
				timer = setTimeout(function () {
					next();
				}, time);
			}
		}
	};

	if (tone) {
		this.play(tone);
	}

	var listeners = {};
	this.on = function (event, callback) {
		if (typeof listeners[event] == "undefined") {
			listeners[event] = [];
		}

		if (typeof callback == 'function') {
			listeners[event].push(callback);
		}
	};
	this.off = function (event, callback) {
		if (listeners[event] instanceof Array) {
			var listens = listeners[event];
			if (callback) {
				for (var i = 0, len = listens.length; i < len; i++) {
					if (listens[i] === callback) {
						listens.splice(i, 1);
						break;
					}
				}
			} else {
				listens = [];
			}
		}
	};
	function fireEvent(event, arg1, arg2) {
		console.log(event, arg1, arg2);
		if (listeners[event] instanceof Array) {
			var listens = listeners[event];
			for (var i = 0, len = listens.length; i < len; i++) {
				listens[i].call(this, arg1, arg2);
			}
		}
	}

}

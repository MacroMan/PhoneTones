## Synopsis

A Javascript library for generating dial tones natively in the browser.
It closely emulates the tones used by differing PSTN networks around the globe.

## Code Example

    new PhoneTones(data.us.tones.ring); // Play the US ring tone from tones.json


## Installation

Include PhoneTones.js in your page

## API Reference

### Construction
    PhoneTones([tone_pattern])
If `tone_pattern` is provided, it calls play automatically.

### Properties
    step - Step is the current step of the tone pattern
    repeat - Repeat is how many time the tone pattern has been played

### Methods
    play(tone_pattern) - Use a tone pattern from tones.json or see below
	stop() - Stops the tone playing and mutes the audio channel
    on(event, callback) - Subscribe to an event, see below
    off(event[, callback]) - Unsubscribe from an event. If no callback is provided, then all hooks are removed

### Events
    on('play', function() {}) - Playing starts
    on('stop', function() {}) - Playing stops
    on('step', function(number) {}) - Fired at the start of each step - Number is the current step of the tone pattern
    on('repeat', function(number) {}) - Fired at the start of each repeat - Number is how many times the tone has repeated
    on('end', function() {}) - The generator has run out of steps to play - A stop event will also be fired


## Tone Patterns
The tone pattern itself is defined by a comma-separated sequence of elements.
Each element consist of a frequency (f) with an optional duration (in ms)
attached to it (f/duration). The frequency component may be a mixture of two
frequencies (f1+f2) or a frequency modulated by another frequency (f1*f2).
If the list element starts with a !, that element is NOT repeated,
therefore, only if all elements start with !, the tonelist is time-limited,
all others will repeat indefinitely.

concisely:

    element = [!]freq[+|*freq2][/duration]
    tonelist = element[,element]*

The above text and pattern format has been taken from Asterisk

UK Ring Example:

    400+450/400,0/200,400+450/400,0/2000
    400+450/400 - Play 2 sine waves at 400Hz & 450Hz for 400ms
    0/200 - Play silence for 200 ms
    400+450/400 - Play 2 sine waves at 400Hz & 450Hz for 400ms
    0/2000 - Play silence for 2000ms

US Ring Example:

    440+480/2000,0/4000
    440+480/2000 - Play 2 sine waves at 440Hz & 480Hz for 2000ms
    0/4000 - Play silence for 4000ms

There are far more exotic patterns in the tones.json file and I encourage you to have a look and a listen

## License

BSD 2-Clause License - See LICENSE

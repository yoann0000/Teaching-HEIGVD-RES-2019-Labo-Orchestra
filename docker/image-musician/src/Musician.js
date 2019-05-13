const dgram = require('dgram');
const protocol = require('./protocol');
const uuid = require('uuid');
const s = dgram.createSocket('udp4');

const INSTRUMENTS = new Map([
	['piano', 'ti-ta-ti'],
	['trumpet', 'pouet'],
	['flute', 'trulu'],
	['violin', 'gzi-gzi'],
	['drum', 'boum-boum'],
]);

function Musician(instrument) {
	this.id = uuid.v4();
	this.sound = INSTRUMENTS.get(instrument);

	Musician.prototype.update = function() {
		const json = {
			uuid: this.id,
			sound: this.sound,
			timestamp: Date.now(),
		};

		const payload = JSON.stringify(json);

		let message = new Buffer(payload);
		s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + s.address().port);
		});
	};
	
	setInterval(this.update.bind(this), 1000);
}

const instrument = process.argv[2];

new Musician(instrument);
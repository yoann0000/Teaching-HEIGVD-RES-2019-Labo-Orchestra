const protocol = require('./protocol');
const dgram = require('dgram');
const uuid = require('uuid');
const s = dgram.createSocket('udp4');

const instruments = new Map([
	['piano', 'ti-ta-ti'],
	['trumpet', 'pouet'],
	['flute', 'trulu'],
	['violin', 'gzi-gzi'],
	['drum', 'boum-boum'],
]);

function Musician(instrument) {
	this.id = uuid.v4();
	this.sound = instruments.get(instrument);

	Musician.prototype.update = function() {
		const info = {
			uuid: this.id,
			sound: this.sound,
			timestamp: Date.now(),
		};

		const payload = JSON.stringify(info);

		s.send(payload, 0, payload.length, protocol.PROTOCOL_PORT,
			protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
				console.log("Sending payload : " + payload + " via port : " + s.address().port);
			});
	};
	
	setInterval(this.update.bind(this), 1000);
}

const instrument = process.argv[2];

new Musician(instrument);
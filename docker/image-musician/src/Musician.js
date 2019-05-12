var dgram = require('dgram');
var protocol = require('./protocol');
const uuid = require('uuid');

var s = dgram.createSocket('udp4');

function Musician(instrument) {
	this.id = uuid.v4();

	switch (instrument) {
		case 'piano':
			this.sound = 'ti-ta-ti';
			break;
		case 'trumpet':
			this.sound = 'pouet';
			break;
		case 'flute':
			this.sound = 'trulu';
			break;
		case 'violin':
			this.sound = 'gzi-gzi';
			break;
		case 'drum':
			this.sound = 'boum-boum';
			break;
		default:
			console.log('Unknown instrument');
			process.exit(1);
		}

	Musician.prototype.update = function() {
		var json = {
			uuid: this.id,
			sound: this.sound,
			timestamp: Date.now(),
		};

		message = new Buffer(payload);
		s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + s.address().port);
		});
	}
	
	setInterval(this.update.bind(this), 500);
}

var instrument = process.argv[2];

new Musician(instrument);
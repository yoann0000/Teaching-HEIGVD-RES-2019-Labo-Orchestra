var protocol = require('./protocol');
var dgram = require('dgram');
const moment = require('moment');

const instrument = new Map();
instrum.set("ti-ta-ti","piano");
instrum.set("pouet","trumpet");
instrum.set("trulu","flute");
instrum.set("gzi-gzi","violin");
instrum.set("boum-boum","drum");

var map = new Map();
var timeMap = new Map();

const s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

s.on('message', function(msg, source) {

    const jmessage = JSON.parse(msg);
	
    const uid = jmessage['id'];
    const instrum = instrument.get(jmessage['sound']);
	const timestamp = jmessage['timestamp'];
	
    const json = {
        uuid: uid,
        instrument: instrum,
        activeSince: timestamp
    };

    if(!map.has(uid))
        map.set(uid,json);

    timeMap.set(uid,Date.now());

	console.log("Data has arrived: " + uid + "  " + instru + ". Source port: " + source.port);
});

const net = require('net');

const server = net.createServer(function (socket) {
    const jsonres = [];

    map.forEach(function (v, k) {
        const start = timeMap.get(k);
        const end = Date.now();

        if (end - start < 5000) {
            jsonres.push(v);
        }
    });
    const jsonPretty = JSON.stringify(jsonres, null, 2);

    socket.write(jsonPretty);
    socket.pipe(socket);
    socket.end();
});

server.listen(2205);
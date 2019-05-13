const protocol = require('./protocol');
const dgram = require('dgram');

const instrumentMap = new Map([
    ['ti-ta-ti', 'piano'],
    ['pouet', 'trumpet'],
    ['trulu', 'flute'],
    ['gzi-gzi', 'violin'],
    ['boum-boum', 'drum'],
]);

let musicians = [];
const s = dgram.createSocket('udp4');

s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

s.on('message', function(msg, source) {

    const jmessage = JSON.parse(msg);
	
    const uuid = jmessage.uuid;
    const instrument = instrumentMap.get(jmessage.sound);
	const timestamp = jmessage.timestamp;

    for (let i = 0; i < musicians.length; i++) {
        if (musicians[i].uuid === uuid) {
            musicians[i].instrument = instrument;
            musicians[i].activeSince = activeSince;
            return;
        }
    }
    musicians.push({
        uuid: uuid,
        instrument: instrument,
        activeSince: timestamp,
    });

    console.log("Data has arrived : " + msg + ". Source port : " + source.port);
});

const net = require('net');

const server = net.createServer(function(socket) {
    const orchestra = [];
    for (let i = 0; i < musicians.length; i++) {

        if (Date.now() - musicians[i].activeSince <= 5000) {
            orchestra.push({
                uuid: musicians[i].uuid,
                instrument: musicians[i].instrument,
                activeSince: new Date(musicians[i].activeSince),
            });
        }
    }
    const payload = JSON.stringify(orchestra);

    socket.write(payload);
    socket.pipe(socket);
    socket.end();
});

server.listen(2205);
const protocol = require('./protocol');
const dgram = require('dgram');

const instrumentMap = new Map();
instrumentMap.set("ti-ta-ti","piano");
instrumentMap.set("pouet","trumpet");
instrumentMap.set("trulu","flute");
instrumentMap.set("gzi-gzi","violin");
instrumentMap.set("boum-boum","drum");

let map = new Map();
let timeMap = new Map();

const s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

s.on('message', function(msg, source) {

    const jmessage = JSON.parse(msg);
	
    const uuid = jmessage['id'];
    const instrument = instrumentMap.get(jmessage['sound']);
	const timestamp = jmessage['timestamp'];
	
    const json = {
        uuid: uuid,
        instrument: instrument,
        activeSince: timestamp
    };

    if(!map.has(uuid))
        map.set(uuid,json);

    timeMap.set(uuid,Date.now());

	console.log("Data has arrived: " + uuid + "  " + instrument + ". Source port: " + source.port);
});

const net = require('net');

const server = net.createServer(function (socket) {
    const json = [];

    map.forEach(function (v, k) {
        const start = timeMap.get(k);
        const end = Date.now();

        if (end - start < 5000) {
            json.push(v);
        }
    });
    const jsonPretty = JSON.stringify(json, null, 2);

    socket.write(jsonPretty);
    socket.pipe(socket);
    socket.end();
});

server.listen(2205);
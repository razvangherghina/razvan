import mongo from './mongo';
import validations from './validations';
import lazy from 'lazy.js';

export default (() => {
  const __ = {};
  const connections = {};

  // is in range of the screen
  const isInRange = (coord, lat, long) => {
    if ((lat < coord.minLat) || (lat > coord.maxLat)) {
      return;
    }
    if ((long < coord.minLong) || (long > coord.maxLong)) {
      return;
    }
    return true;
  };

  // on new donor
  const newDonor = async (donor) => {
    // if donor is valid
    if (!validations.isDonorValid(donor)) {
      return;
    }
    // update the db donor
    await mongo.upsertDonor(donor);
    // if there are connections with coordinates of the donor
    // update donor
    // foreach coordinates in current donor coordinates
    console.log(connections, lazy(connections).values());
    lazy(connections).values()
      .filter(conn => conn && conn.coordinates && isInRange(conn.coordinates, donor.lat, donor.long)).forEach(conn => {
        conn.socket.emit('donors', donor);
      });
    // thatsocket.emit('donor',donor);
  };

  // on socket connect
  __.onConnect = async (socket) => {
    console.log(`Socket ${socket.id} has connected!`);
    // register the new connection
    connections[socket.id] = { socket };
    // when new coordinates arrive I give data back for that coordinates
    socket.on('coordinates', async (coordinates) => {
      // if coordinates are valid
      if (!validations.isCoordinatesValid(coordinates)) {
        return;
      }
      // update coordinates in connection
      connections[socket.id].coordinates = coordinates;
      // emmiting new data
      socket.emit('donors', await mongo.getAllDonors(coordinates));
    });

    // when new donor arrive
    socket.on('donor', newDonor);
    // when socket disconnect throw away the connection object
    socket.on('disconnect', function () {
      console.log(`Socket ${socket.id} has disconnected!`);
      connections[socket.io] = undefined;
    });
  };

  return Object.freeze(__);
})();


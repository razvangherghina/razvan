import randomstring from 'randomstring';
export default (() => {
  const __ = {};
  __.isCoordinatesValid = (coordinates) => {
    if (!coordinates.minLat) {
      return;
    }
    if (!coordinates.minLong) {
      return;
    }
    if (!coordinates.maxLat) {
      return;
    }
    if (!coordinates.maxLong) {
      return;
    }
    return coordinates;
  };
  __.isDonorValid = (donor) => {
    if (!donor.link) {
      donor.link = randomstring.generate();
    }
    if (!donor.firstname) {
      return;
    }
    if (!donor.lastname) {
      return;
    }
    if (!donor.email) {
      return;
    }
    if (!donor.phone) {
      return;
    }
    if (!donor.group) {
      return;
    }
    if (!donor.address) {
      return;
    }
    if (!donor.ip) {
      return;
    }
    if (!donor.lat) {
      return;
    }
    if (!donor.long) {
      return;
    }
    return donor;
  };

  return Object.freeze(__);
})();


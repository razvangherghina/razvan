import { MongoClient } from 'mongodb';
import connectionString from '../config/mongodb.config';
console.log(connectionString);

export default (() => {
  const __ = {};

  // write an user to db
  __.upsertDonor = async(donor) => {
    const db = await MongoClient.connect(connectionString);
    const Donors = db.collection('donors');
    const res = await Donors.updateOne({ email: donor.email }, { $set: donor }, { upsert: true });
    db.close();
    return res;
  };

  __.getAllDonors = async(coordinates) => {
    const db = await MongoClient.connect(connectionString);
    const Users = db.collection('donors');
    const res = await Users.find({}).toArray();
    db.close();
    return res;
  };
  return Object.freeze(__);
})();

// created by Sundeep Dayalan at 2024/04/18 18:58.
// Website:  www.sundeepdayalan.in
// Email: contact@sundeepdayalan.in
require('dotenv').config();
const MongoConnectionString = `mongodb://skybms:12345678@${process.env.MONGODB_HOST}:27017/?authSource=${process.env.MONGODB_NAME}`;
// 204.236.220.172

//mongo db collections
const collection_arduino_raw_data = "arduino_data";


function getTimestamp() {
    return new Date(Date.now());
}


function getFormattedTimestamp(timestamp) {
    // Convert the timestamp to a Date object
  const date = new Date(timestamp);

  // Set the time zone to Denver
  const options = { timeZone: 'America/Denver' };

  // Format the date and time as required
  const formattedDate = date.toLocaleString('en-US', options);

  return formattedDate;
  }

function getTimestampHumanReadableFormat() {
    return new Date(Date.now()).toLocaleString("en-US", { timeZone: 'America/Denver' });
    // return new Date().toUTCString();
    // return new Date(Date.now());

}


 

module.exports = {
    MongoConnectionString,
    collection_arduino_raw_data,
    getTimestamp,
    getTimestampHumanReadableFormat,
    getFormattedTimestamp: getFormattedTimestamp



};
// Sep 21, 2023	Available	$9.69 / $10.00	Sep 30, 2024
// Dec 08, 2022	Expired	$18.00 / $18.00	Mar 31, 2023
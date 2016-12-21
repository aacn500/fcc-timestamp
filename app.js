'use strict';

const querystring = require('querystring');
const express = require('express');

const PORT = process.env.PORT || 80;
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

let app = express();

function sendDateResponse(response, theDate) {
  let unix;
  let natural;

  if (isNaN(theDate)) {
    unix = null;
    natural = null;
  } else {
    // remove the last 3 digits to convert ms to s
    unix = theDate.getTime().toString().slice(0, -3);
    let month = MONTHS[theDate.getUTCMonth()];
    let day = theDate.getUTCDate();
    let year = theDate.getUTCFullYear();
    natural = `${month} ${day}, ${year}`;
  }
  let retObj = {unix, natural};
  response.send(JSON.stringify(retObj));
}

// http://www.gnuterrypratchett.com/#nodejs
app.use(function clacksOverhead(_, res, next) {
  res.set('X-Clacks-Overhead', 'GNU Terry Pratchett');
  next();
});

app.get(/^\/[\d]+$/, function unixTime(req, res) {
  let thispath = req.path;
  // slice to remove leading /
  // add '000' because Date constructor expects milliseconds since epoch,
  // but we expect users to provide seconds since epoch
  let unixAsNumber = Number(thispath.slice(1) + '000');
  let theDate = new Date(unixAsNumber);
  sendDateResponse(res, theDate);
});

app.get(/\/.+/, function other(req, res) {
  let thispath = querystring.unescape(req.path);
  // slice to remove leading /
  let theDate = new Date(thispath.slice(1));
  sendDateResponse(res, theDate);
});

app.get('/', function index(req, res) {
  res.render('index.pug');
});

app.listen(PORT, function() {
  console.log('process is listening on port ' + PORT);
});

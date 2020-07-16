var axios = require('axios');
var querystring = require('querystring');
var response_code = require('./smsResponse.json');

function sendSMS({ number, text, time }) {
  this.API_ID = 'FCC82B2E-2F6E-5C9E-4850-E7D83B1E0305'
  this.isTest =  'TRUE';
  var params = {
    api_id: this.API_ID,
    to: number,
    msg: text,
    time: time,
    json: 1,
    test: +this.isTest
  };

  return axios.get(`https://sms.ru/sms/send?${querystring.stringify(params)}`);
}

module.exports = sendSMS;
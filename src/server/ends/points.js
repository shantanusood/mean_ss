const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const fetch = require('node-fetch');
var fs = require('fs');
global.Headers = fetch.Headers;

app.route('/api/testService').get((req, res) => {
  fetch('http://192.168.1.157:8080/spring-mongodb-0.0.1-SNAPSHOT/findAllBooks', {
    headers: new Headers({
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin':'*'
    })
  })
  .then(res => res.json())
  .then(json => res.send(json));
})

app.listen(3200, () => {
  console.log('App listening at 3200')
});

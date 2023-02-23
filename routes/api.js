var express = require('express');
var router = express.Router();
const client = require('../library/mt5/client');


router.get('/tick/last', function (req, res, next) {
  const { symbols, trans_id } = req.query;
  if (!client.connected) {
    res.status(400).json([])
    return;
  }
  client.Get(`/api/tick/last?symbol=${symbols}&trans_id=${trans_id}`, function (error, response, body) {
    const data = client.ParseBodyJSON(error, response, body, null)
    res.json(data);
  });
});

router.get('/tick/stat', function (req, res, next) {
  const { symbols, trans_id } = req.query;
  if (!client.connected) {
    res.status(400).json([])
    return;
  }
  client.Get(`/api/tick/stat?symbol=${symbols}&trans_id=${trans_id}`, function (error, response, body) {
    const data = client.ParseBodyJSON(error, response, body, null)
    res.json(data);
  });
});

router.get('/tick/history', function (req, res, next) {
  const { symbols, trans_id } = req.query;
  if (!client.connected) {
    res.status(400).json([])
    return;
  }
  client.Get(`/api/tick/history?symbol=EURUSD&from=1574351000&to=1668055795&data=dba`, function (error, response, body) {
    const data = client.ParseBodyJSON(error, response, body, null)
    res.json(data.answer);
  });
});

router.get('/chart/get', function (req, res, next) {
  let { symbol, from, to, data } = req.query;
  if (!client.connected) {
    res.status(400).json([])
    return;
  }
  from = parseInt(from) + (3 * 60 * 60)
  to = parseInt(to) + (3 * 60 * 60)
  // console.log(to)
  client.Get(`/api/chart/get?symbol=${symbol}&from=${from}&to=${to}&data=${data}`, function (error, response, body) {
    const data = client.ParseBodyJSON(error, response, body, null)
    res.json(data.answer);
  });
});

router.get('/symbol/get', function (req, res, next) {
  const { symbol } = req.query;
  if (!client.connected) {
    res.status(400).json([])
    return;
  }
  client.Get(`/api/symbol/get?symbol=${symbol}`, function (error, response, body) {
    const data = client.ParseBodyJSON(error, response, body, null)
    res.json(data.answer);
  });
});

router.get('/symbol/mask', function (req, res, next) {
  const { symbols, mask } = req.query;
  if (!client.connected) {
    res.status(400).json([])
    return;
  }
  client.Get(`/api/symbol/get?mask=${mask}`, function (error, response, body) {
    const data = client.ParseBodyJSON(error, response, body, null)
    res.json(data.answer);
  });
});

router.get('/time/server', function (req, res, next) {
  if (!client.connected) {
    res.status(400).json([])
    return;
  }
  client.Get(`/api/time/server`, function (error, response, body) {
    const data = client.ParseBodyJSON(error, response, body, null)
    const { time } = data.answer;
    res.json({
      time: parseInt(time.split(' ')[0])
    });
  });
});

module.exports = router;

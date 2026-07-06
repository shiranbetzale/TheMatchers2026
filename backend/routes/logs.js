const express = require('express');
const {requireAuth} = require('../middleware/auth');
const {listLogs} = require('../services/logStore');

const router = express.Router();

router.get('/', requireAuth(['admin']), (_req, res) => {
  res.json({logs: listLogs()});
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.post('/games', (req, res, next) => {
  res.json({
    game: {
      id: 'some-short-id',
    },
  });
});

router.get('/games/:id', (req, res, next) => {
  res.json({
    game: {
      id: req.params.id,
    },
  });
});

module.exports = router;

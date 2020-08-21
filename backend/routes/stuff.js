const express = require('express');
const router = express.Router();

const stuffCtrl = require ('../controllers/stuff');

router.post('/sauces', stuffCtrl.createSauce);
router.get('/:id', stuffCtrl.getOneSauce);
router.get('/', stuffCtrl.getAllSauce);

module.exports = router;
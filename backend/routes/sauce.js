const express = require('express');
const router = express.Router();

const sauceCtrl = require ('../controllers/sauce');
const auth = require('../middleware/auth');

router.post('/', auth, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.put('/:id', auth, sauceCtrl.modifySauce);

module.exports = router;
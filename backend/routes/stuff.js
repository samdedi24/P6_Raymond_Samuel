const express = require('express');
const router = express.Router();

const stuffCtrl = require ('../controllers/stuff');
const auth = require('../middleware/auth');

router.get('/', auth, stuffCtrl.getAllSauces);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.post('/', auth, stuffCtrl.createSauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.put('/:id', auth, stuffCtrl.modifySauce);



module.exports = router;
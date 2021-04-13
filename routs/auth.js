const authControler = require("../controllers/auth")
const express= require("express")
const router = express.Router();
router.post('/register', authControler.register);

router.post('/login', authControler.login);

router.post('/personal', authControler.personal);


router.post('/userPage', authControler.userPage);






module.exports = router;




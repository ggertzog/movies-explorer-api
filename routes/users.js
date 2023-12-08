const router = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { userInfoValidate } = require('../middlewares/requestValidation');

router.get('/me', getUserInfo);
router.patch('/me', userInfoValidate, updateUserInfo);

module.exports = router;
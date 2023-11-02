const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload');

const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const usersController = require('../controllers/UsersController');
const UserAvatarController = require('../controllers/UserAvatarController');

const usersRouter = Router();
const upload = multer(uploadConfig.MULTER);

const userAvatarController = new UserAvatarController();

usersRouter.post('/create', usersController.create);
usersRouter.get('/showAll', ensureAuthenticated, usersController.showAll);
usersRouter.get('/:id', ensureAuthenticated, usersController.show);
usersRouter.delete('/:id', ensureAuthenticated, usersController.delete);
usersRouter.put('/', ensureAuthenticated, usersController.update);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

module.exports = { usersRouter };

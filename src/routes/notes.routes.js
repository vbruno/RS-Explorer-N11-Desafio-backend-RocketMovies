const { Router } = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const movieNotesController = require('../controllers/MovieNotesController');

const movieNotesRouter = Router();

movieNotesRouter.get('/', (req, res) => {
  res.json({ msg: 'Rota OK - notes' });
});

movieNotesRouter.use(ensureAuthenticated);

movieNotesRouter.post('/create', movieNotesController.create);
movieNotesRouter.get('/showAll', movieNotesController.showAll);
movieNotesRouter.get('/index', movieNotesController.index);
movieNotesRouter.get('/show/:idMovie', movieNotesController.show);
movieNotesRouter.delete('/:id', movieNotesController.delete);
movieNotesRouter.put('/:id', movieNotesController.update);

module.exports = { movieNotesRouter };

const { Router } = require('express');
const { usersRouter } = require('./users.routes');
const { movieNotesRouter } = require('./notes.routes');
const { sessionsRoutes } = require('./sessions.routes');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/movies', movieNotesRouter);
routes.use('/sessions', sessionsRoutes);

module.exports = { routes };

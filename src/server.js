require('express-async-errors');
require('dotenv/config');

const cors = require('cors');
const express = require('express');

const AppError = require('./utils/AppError');
const { routes } = require('./routes');
const { UPLOADS_FOLDER } = require('./configs/upload');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', express.static(UPLOADS_FOLDER));

app.use(routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

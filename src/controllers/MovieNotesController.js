const dayjs = require('dayjs');
const AppError = require('../utils/AppError');

const knex = require('../database/knex');

class MovieNotesController {
  async create(req, res) {
    const {
      title, description, rating, tags,
    } = req.body;

    const { id } = req.user;

    if (!title || !description || !rating || !tags) {
      throw new AppError('Missing body parameter', 400);
    }

    if (rating < 0 || rating > 5) {
      throw new AppError('Rating must be between 0 and 5', 400);
    }

    const userExists = await knex('users').where({ id });

    if (!userExists) {
      throw new AppError('User not found', 400);
    }

    if (!tags) {
      throw new AppError('Missing tags', 400);
    }

    const [movieNote] = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id: id,
    }).returning('*');

    const tagsInsert = tags.map((name) => ({
      movieNote_id: movieNote.id,
      user_id: id,
      name,
    }));

    await knex('movie_tags').insert(tagsInsert);

    return res.json({ ...movieNote, tags: tagsInsert });
  }

  async showAll(req, res) {
    const { id } = req.user;

    const idExists = await knex('movie_notes').where({ id });

    if (!idExists) {
      throw new AppError('Movie note not found', 400);
    }

    const movieNote = await knex('movie_notes')
      .select([
        'movie_notes.id',
        'movie_notes.title',
        'movie_notes.description',
        'movie_notes.rating',
      ])
      .where({ user_id: id });

    const tags = await knex('movie_tags')
      .select(['movie_tags.id', 'movie_tags.name', 'movie_tags.movieNote_id'])
      .where({ user_id: id })
      .orderBy('name');

    const movieWithTags = movieNote.map((movie) => {
      const movieTags = tags.filter((tag) => tag.movieNote_id === movie.id);

      return {
        ...movie,
        tags: movieTags,
      };
    });

    return res.json(movieWithTags);
  }

  async show(req, res) {
    const { idMovie } = req.params;
    const { id } = req.user;

    const idExists = await knex('movie_notes').where({ id });

    if (!idExists) {
      throw new AppError('Movie note not found', 400);
    }

    const movieNote = await knex('movie_notes')
      .select(['movie_notes.*', 'users.name as user_name', 'users.avatar as user_avatar'])
      .where({ 'movie_notes.id': idMovie })
      .innerJoin('users', 'users.id', 'movie_notes.user_id')
      .first();

    const tags = await knex('movie_tags')
      .select(['movie_tags.id', 'movie_tags.name', 'movie_tags.movieNote_id'])
      .where({ user_id: id })
      .orderBy('name');

    const movieTags = tags.filter((tag) => tag.movieNote_id === movieNote.id);

    console.log({ ...movieNote, tags: movieTags });

    return res.json({ ...movieNote, tags: movieTags });
  }

  async index(req, res) {
    const { id } = req.user;
    const { title } = req.query;

    const idExists = await knex('movie_notes').where({ id });

    if (!idExists) {
      throw new AppError('Movie note not found', 400);
    }

    const movieNote = await knex('movie_notes')
      .select([
        'movie_notes.id',
        'movie_notes.title',
        'movie_notes.description',
        'movie_notes.rating',
      ])
      .where({ user_id: id })
      .whereLike('movie_notes.title', `%${title}%`);

    const tags = await knex('movie_tags')
      .select('movie_tags.id', 'movie_tags.name', 'movie_tags.movieNote_id')
      .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.movieNote_id')
      .whereLike('movie_notes.title', `%${title}%`);

    const movieWithTags = movieNote.map((movie) => {
      const movieTags = tags.filter((tag) => tag.movieNote_id === movie.id);

      return {
        ...movie,
        tags: movieTags,
      };
    });

    return res.json(movieWithTags);
  }

  async delete(req, res) {
    const { id } = req.params;

    const result = await knex('movie_notes').where({ id }).del();

    return res.json(result);
  }

  async update(req, res) {
    const { id } = req.params;
    const {
      title, description, rating,
    } = req.body;

    const [movieNoteExists] = await knex('movie_notes').where({ id });

    if (!movieNoteExists) {
      throw new AppError('Movie note not found', 400);
    }
    if (rating) {
      if (rating < 0 || rating > 5) {
        throw new AppError('Rating must be between 0 and 5', 400);
      }
    }

    const [movieNote] = await knex('movie_notes').where({ id }).update({
      title: title ?? movieNoteExists.title,
      description: description ?? movieNoteExists.description,
      rating: rating ?? movieNoteExists.rating,
      update_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }).returning('*');

    return res.json(movieNote);
  }
}

module.exports = new MovieNotesController();

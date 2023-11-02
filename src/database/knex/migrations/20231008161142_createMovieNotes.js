exports.up = (knex) => knex.schema.createTable('movie_notes', (table) => {
  table.increments('id');

  table.string('title');
  table.string('description');
  table.integer('rating');

  table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');

  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('update_at').default(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('movie_notes');

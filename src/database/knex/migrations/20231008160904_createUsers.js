exports.up = (knex) => knex.schema.createTable('users', (table) => {
  table.increments('id');

  table.string('name');
  table.string('email');
  table.string('password');
  table.string('avatar');

  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('update_at').default(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('users');

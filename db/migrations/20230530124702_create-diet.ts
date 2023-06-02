import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema
  .createTable('user', (table) => {
    table.uuid('id').primary().index()
    table.string('name').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
  .createTable('diet', (table)=> {
    table.uuid('id').primary().index()
    table.text('Meal').index().notNullable()
    table.text('Description').notNullable()
    table.enum('onDiet',['yes', 'no']).defaultTo('yes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user').dropTable('diet')
}


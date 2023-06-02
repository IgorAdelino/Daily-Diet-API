import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', (table) =>{
    table.uuid('session_id').unique().after('id').index()
  }).alterTable('diet', (table) => {
    table.uuid('meal_session_id').references('session_id').inTable('user')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', (table)=> {
    table.dropColumn('session_id')
  }).alterTable('diet', (table)=> {
    table.dropColumn('meal_session_id')
  })
}


import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meal: {
      id?: string
      Meal: string
      description: string
      onDiet: string
      created_at: string
      session_id?: string
    }
  }
}
import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import {z} from 'zod'
import { checkSessionExists } from "../middlewares/check-session-exists";
import { SequencyOnDiet } from "../utils/bestSequency";

export async function DietRoutes(app: FastifyInstance){

  app.post('/', {preHandler: [checkSessionExists]}, async(request, reply)=> {
    let sessionId = request.cookies.sessionId

    const createMealBodySchema = z.object({
      meal: z.string(),
      description: z.string(),
      onDiet: z.enum(['yes', 'no']).default('yes')
      
    })
    const {meal, description, onDiet} = createMealBodySchema.parse(request.body)

    await knex('diet')
    .insert({id: randomUUID(), meal: meal, description: description, onDiet: onDiet, meal_session_id: sessionId})
    return reply.status(201).send()
  })

  app.get('/',{preHandler: [checkSessionExists]}, async (request) => {
    const {sessionId} = request.cookies
    
    const user = await knex('user').where('session_id', sessionId).select('*')
    const mealList = await knex('diet').where('meal_session_id', sessionId).select('*')
    const totalMeals = mealList.length
    const totalMealsOnDiet = mealList.filter(meal => meal.onDiet === "yes").length
    const totalMealsOffDiet = mealList.filter(meal => meal.onDiet === "no").length
    const bestSequencyOnDiet = SequencyOnDiet(mealList)

    return {user, totalMeals, totalMealsOnDiet, totalMealsOffDiet, bestSequencyOnDiet, mealList}
  })

  app.get('/:id',{preHandler: [checkSessionExists]}, async(request, reply)=> {
    const {sessionId} = request.cookies
    const getMealParamsSchema = z.object({
      id: z.string().uuid()
    })
    const {id} = getMealParamsSchema.parse(request.params)

    const meal = await knex('diet').where({
      meal_session_Id: sessionId,
      id,
    }).first()

    if(!meal){
      return reply.status(404).send()
    }

    return {meal}
  })
  
  app.delete('/:id',{preHandler: [checkSessionExists]}, async(request, reply)=> {
    const {sessionId} = request.cookies
    const getMealParamsSchema = z.object({
      id: z.string().uuid()
    })
    const {id} = getMealParamsSchema.parse(request.params)

    const meal = await knex('diet').where({
      meal_session_id: sessionId,
      id,
    }).first().delete()
    if(!meal){
      return reply.status(404).send()
    }

    return {message: "Deleted meal!", meal}
  })

  app.patch('/:id',{preHandler: [checkSessionExists]}, async(request,reply)=> {
    const {sessionId} = request.cookies
    const getMealParamsSchema = z.object({
      id: z.string().uuid()
    })
    const createMealBodySchema = z.object({
      meal: z.string(),
      description: z.string(),
      onDiet: z.enum(['yes', 'no']).default('yes')
      
    })
    const {meal, description, onDiet} = createMealBodySchema.parse(request.body)
    const {id} = getMealParamsSchema.parse(request.params)

    const mealSearch = await knex('diet').where({
      meal_session_id: sessionId,
      id,
    }).first().update({
      meal,
      description,
      onDiet
    })
    if(!mealSearch){
      return reply.status(404).send()
    }

    return {message: "Updated meal!", mealSearch}
  })



}
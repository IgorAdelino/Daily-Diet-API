import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import {z} from 'zod'
import { checkSessionExists } from "../middlewares/check-session-exists";

export async function UserRoutes(app: FastifyInstance){

  app.post('/', async(request, reply)=> {
    let sessionId = request.cookies.sessionId
    

    if(sessionId){
      const userSearch = await knex('user').where('session_id', sessionId).returning('*')
      if(userSearch.length>0){
        return reply.status(401).send({Message: 'User is already logged in'})
      }
    }
    
    if(!sessionId){
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {path: '/', maxAge: 100 * 60 * 60 * 7})
    }

    const createMealBodySchema = z.object({
      name: z.string()
    })

    const {name} = createMealBodySchema.parse(request.body)

    await knex('user').insert({id: randomUUID(), name: name, session_id: sessionId})
    return reply.status(201).send()
  })
  
  app.get('/',{preHandler: [checkSessionExists]}, async (request, reply) => {
    const {sessionId} = request.cookies
    
    const userList = await knex('user').where('session_id', sessionId).select()

    return {userList}
  })

  app.get('/:id',{preHandler: [checkSessionExists]}, async(request, reply)=> {
    const {sessionId} = request.cookies
    const getUserParamsSchema = z.object({
      id: z.string().uuid()
    })
    const {id} = getUserParamsSchema.parse(request.params)

    const user = await knex('user').where({
      session_Id: sessionId,
      id,
    }).first()

    if(!user){
      return reply.status(404).send()
    }

    return {user}
  })

  app.patch('/:id',{preHandler: [checkSessionExists]}, async(request, reply)=> {
    const {sessionId} = request.cookies
    const getUserParamsSchema = z.object({
      id: z.string().uuid()
    })
    const createUserBodySchema = z.object({
      name: z.string()
    })

    const {name} = createUserBodySchema.parse(request.body)
    const {id} = getUserParamsSchema.parse(request.params)

    const userSearch = await knex('user').where({
      session_id: sessionId,
      id,
    }).first().update({
      name: name
    })

    if(!userSearch){
      return reply.status(404).send()
    }

    return reply.status(201).send( {message: "Updated user!", userSearch})
  })

  app.delete('/:id',{preHandler: [checkSessionExists]}, async(request, reply)=> {
    const {sessionId} = request.cookies
    const getUserParamsSchema = z.object({
      id: z.string().uuid()
    })
    const {id} = getUserParamsSchema.parse(request.params)

    const userSearch = await knex('user').where({
      session_id: sessionId,
      id,
    }).first().delete()

    const meal = await knex('diet').where({
      meal_session_id: sessionId,
    }).delete()

    if(!userSearch){
      return reply.status(404).send()
    }
    
    return {message: "Deleted user and meals!", meal, userSearch}
  })

}
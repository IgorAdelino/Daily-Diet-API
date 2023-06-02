import { fastify } from 'fastify'
import { DietRoutes } from './routes/dietRoutes'
import cookie from '@fastify/cookie'
import { UserRoutes } from './routes/userRoutes'

export const app = fastify()

app.register(cookie)
app.register(UserRoutes, {prefix: 'user'})
app.register(DietRoutes, {prefix: 'user/meals'})

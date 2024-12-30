import { BFFApiHandler, CustomApiHandler, MiddlewareType } from '@/types'
import { NextRequest } from 'next/server'

export const applyMiddlewares = <const Middlewares extends readonly MiddlewareType<any>[]>(
  middlewares: Middlewares,
  handler: BFFApiHandler<Middlewares>
) => {
  const handlerWithMiddlewares = middlewares.reduce((acc, middleware) => middleware(acc), handler as CustomApiHandler)

  return (request: NextRequest) => handlerWithMiddlewares(request, {})
}

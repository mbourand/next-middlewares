import { NextRequest, NextResponse } from 'next/server'

export type CustomApiHandler<Context extends object = {}> = (
  req: NextRequest,
  context: Context
) => Response | NextResponse | Promise<Response | NextResponse>

export type MiddlewareType<AddedContext extends object = {}> = <Context extends object>(
  handler: CustomApiHandler<Context & AddedContext>
) => CustomApiHandler<Context>

type _ApplyMiddleware<
  Handler extends CustomApiHandler,
  Middleware extends MiddlewareType
> = Handler extends CustomApiHandler<infer CurrentContext>
  ? Middleware extends MiddlewareType<infer AddedContext>
    ? CustomApiHandler<CurrentContext & AddedContext>
    : never
  : never

type _ApplyMiddlewares<
  Handler extends CustomApiHandler<any>,
  Middlewares extends readonly MiddlewareType[]
> = Middlewares extends readonly [infer FirstMiddleware, ...infer RestMiddlewares]
  ? FirstMiddleware extends MiddlewareType<any>
    ? RestMiddlewares extends MiddlewareType<any>[]
      ? _ApplyMiddlewares<_ApplyMiddleware<Handler, FirstMiddleware>, RestMiddlewares>
      : never
    : never
  : Handler

export type BFFApiHandler<Middlewares extends readonly MiddlewareType<any>[]> = _ApplyMiddlewares<
  CustomApiHandler,
  Middlewares
>

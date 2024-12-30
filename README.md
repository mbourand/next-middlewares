# Next Middleware

_Library adding support for route-level middlewares in Next's App Router routes_

## Usage

### Defining a middleware

A middleware is a function that takes a route handler as its parameter and returns a new handler that does what the middleware needs to do before calling the base handler.

There is an additionnal parameter for passing variables from the middleware to the handler that we will cover after

You can use the type `MiddlewareType` to get guidance and benefit from type inference when writing a middleware

```TS
export const withConsoleLog: MiddlewareType = (handler) => {
	return (request, context) => {
		console.log('Middleware called!!')
		return handler(request, context)
	}
}
```

### Passing variables from middlewares to the route handler

You can pass variables to the route handler by using the context parameter of the handler

When you add one or more variables to the context, you need to specify what variable you're going to add in the generic parameter of `MiddlewareType`

```TS
export const withUsername: MiddlewareType<{ username: string }> = (handler) => {
  return (req, context) => {
    return handler(req, { ...context, username: 'mbourand' })
  }
}
```

### Advanced parametric middleware

A natural extension of this approach is that you can return a strongly-typed middleware dynamically from a function call

Here I will take as an example a middleware that takes a zod schema as a parameter to validate that the body of a request is valid before passing to the route handler

```TS
export const withBody = <T extends z.ZodSchema<any>>(schema: T) => {
  const middleware: MiddlewareType<{ body: z.infer<T> }> = (handler) => {
    return (req, context) => {
      try {
        const body = schema.parse(req.body)
        return handler(req, { ...context, body })
      } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
      }
    }
  }

  return middleware
}
```

## Using the middlewares

To apply the middlewares to a Route Handler, it is almost like writing a normal route with Next, except that you can call the `applyMiddlewares` function

```TS
// route.ts
const BodySchema = z.object({ message: z.string() })

//                                                     Type-safe retrieval of the variables added by the middlewares
//                                                                                     |
//                         Choosing the middlewares                                    |
//                                       v                                             v
export const GET = applyMiddlewares([withUsername, withBody(BodySchema)], (request, { username, body }) => {
  return NextResponse.json({ message: `${username}: ${body.message}` })
})
```

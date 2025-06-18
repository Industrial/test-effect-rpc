import { UsersLive } from '@/rpc/handlers'
import { UserRpcs } from '@/rpc/request'
import { HttpApp } from '@effect/platform'
import { RpcSerialization, RpcServer } from '@effect/rpc'
import { Effect } from 'effect'


const RpcWebHandler = RpcServer.toHttpApp(UserRpcs)
  .pipe(Effect.map(HttpApp.toWebHandler))
  .pipe(Effect.provide(UsersLive))
  .pipe(Effect.provide(RpcSerialization.layerJson))

export const POST = async (request: Request): Promise<Response> => {
  try {
    console.log('NextJS Route: Preparing to call handler.')

    const handler = await Effect.runPromise(RpcWebHandler.pipe(Effect.scoped))

    console.log('NextJS Route: Handler initialized. Calling with request.', {
      url: request.url,
      method: request.method,
    })

    const response = await handler(request)

    console.log('NextJS Route: Handler returned response.', {
      status: response.status,
    })

    return response
  } catch (error) {
    console.error('NextJS Route: Error calling handler', error)
    return new Response('Error in handler', { status: 500 })
  }
}

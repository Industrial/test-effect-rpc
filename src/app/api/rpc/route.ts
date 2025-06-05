import { RpcWebHandler } from '@/rpc/server'
import { Effect } from 'effect'

const initializeHandler = RpcWebHandler.pipe(Effect.scoped, Effect.runPromise)

export const POST = async (request: Request): Promise<Response> => {
  console.log('NextJS Route: Preparing to call handler.')
  const handler = await initializeHandler
  console.log('NextJS Route: Handler initialized. Calling with request.', {
    url: request.url,
    method: request.method,
  })
  try {
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

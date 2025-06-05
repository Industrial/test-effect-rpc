import { FetchHttpClient } from '@effect/platform'
import { RpcClient, RpcSerialization } from '@effect/rpc'
import { Effect, Layer } from 'effect'
import { MinimalPingRpc } from './request'

export const ProtocolLive = RpcClient.layerProtocolHttp({
  url: 'http://localhost:3000/api/rpc',
}).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerJson]))

export class PingClient extends Effect.Service<PingClient>()('PingClient', {
  scoped: RpcClient.make(MinimalPingRpc),
}) {}

const program = Effect.gen(function* () {
  const client = yield* PingClient
  yield* Effect.log('client (PingClient)', client)
  const result = yield* client.Ping({})
  yield* Effect.log('Ping result', result)
  return result
}).pipe(Effect.scoped)

program
  .pipe(
    Effect.provide(PingClient.Default),
    Effect.provide(ProtocolLive),
    Effect.runPromise,
  )
  .then(console.log)
  .catch(console.error)

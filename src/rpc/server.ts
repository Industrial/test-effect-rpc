import { HttpApp } from '@effect/platform'
import { RpcSerialization, RpcServer } from '@effect/rpc'
import { Effect } from 'effect'
import { MinimalPingRpc } from './request'

export const MinimalPingLive = MinimalPingRpc.toLayer(
  Effect.gen(function* () {
    return {
      Ping: () => Effect.succeed('pong'),
    }
  }),
)

export const RpcWebHandler = RpcServer.toHttpApp(MinimalPingRpc)
  .pipe(Effect.map(HttpApp.toWebHandler))
  .pipe(Effect.provide(MinimalPingLive))
  .pipe(Effect.provide(RpcSerialization.layerJson))

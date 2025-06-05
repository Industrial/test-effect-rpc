import { Rpc, RpcGroup } from '@effect/rpc'
import { Schema } from 'effect'

export class MinimalPingRpc extends RpcGroup.make(
  Rpc.make('Ping', {
    success: Schema.String,
  }),
) {}

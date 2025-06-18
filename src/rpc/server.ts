// server.ts
import { HttpRouter } from "@effect/platform"
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { RpcSerialization, RpcServer } from "@effect/rpc"
import { Layer } from "effect"
import { UsersLive } from "./handlers.js"
import { UserRpcs } from "./request.js"

// Create the RPC server layer
const RpcLayer = RpcServer.layer(UserRpcs).pipe(Layer.provide(UsersLive))

// Choose the protocol and serialization format
const HttpProtocol = RpcServer.layerProtocolHttp({
  path: "/api/rpc"
}).pipe(Layer.provide(RpcSerialization.layerNdjson))

// Create the main server layer
const Main = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLayer),
  Layer.provide(HttpProtocol),
  Layer.provide(BunHttpServer.layer({ port: 3000 }))
)

BunRuntime.runMain(Layer.launch(Main))
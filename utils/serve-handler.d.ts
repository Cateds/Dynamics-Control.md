declare module "serve-handler" {
  import type { IncomingMessage, ServerResponse } from "node:http";
  interface Options {
    public?: string;
    cleanUrls?: boolean;
    [key: string]: unknown;
  }
  function serveHandler(
    req: IncomingMessage,
    res: ServerResponse,
    options?: Options,
  ): Promise<void>;
  export = serveHandler;
}

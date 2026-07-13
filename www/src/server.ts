import { env } from "cloudflare:workers";
import handler, {
  createServerEntry,
} from "@tanstack/react-start/server-entry";
import { handleAgentRequest } from "./lib/agent-readiness";

export default createServerEntry({
  fetch(request) {
    return handleAgentRequest(
      request,
      (htmlRequest) => handler.fetch(htmlRequest),
      (assetRequest) => env.ASSETS.fetch(assetRequest),
    );
  },
});

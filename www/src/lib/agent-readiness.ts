type MediaPreference = {
  type: string;
  subtype: string;
  quality: number;
  index: number;
};

const DISCOVERY_LINKS = [
  '</sitemap.xml>; rel="sitemap"',
  '</llms.txt>; rel="describedby"',
  '</.well-known/agent-skills/index.json>; rel="describedby"',
];

function parseAccept(accept: string): MediaPreference[] {
  return accept.split(",").flatMap((entry, index) => {
    const [mediaRange, ...parameters] = entry.trim().split(";");
    const [type, subtype] = mediaRange.toLowerCase().split("/");
    if (!type || !subtype) return [];

    const qualityParameter = parameters
      .map((parameter) => parameter.trim())
      .find((parameter) => parameter.startsWith("q="));
    const parsedQuality = qualityParameter
      ? Number(qualityParameter.slice(2))
      : 1;
    const quality = Number.isFinite(parsedQuality)
      ? Math.min(1, Math.max(0, parsedQuality))
      : 0;

    return [{ type, subtype, quality, index }];
  });
}

function preferenceFor(
  preferences: MediaPreference[],
  type: string,
  subtype: string,
): MediaPreference | undefined {
  return preferences
    .filter(
      (preference) =>
        (preference.type === "*" || preference.type === type) &&
        (preference.subtype === "*" || preference.subtype === subtype),
    )
    .sort((left, right) => {
      const leftSpecificity = Number(left.type !== "*") + Number(left.subtype !== "*");
      const rightSpecificity =
        Number(right.type !== "*") + Number(right.subtype !== "*");
      return rightSpecificity - leftSpecificity || left.index - right.index;
    })[0];
}

export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;

  const preferences = parseAccept(accept);
  const markdown = preferenceFor(preferences, "text", "markdown");
  if (!markdown || markdown.quality === 0) return false;

  const html = preferenceFor(preferences, "text", "html");
  if (!html || html.quality === 0) return true;
  if (markdown.quality !== html.quality) {
    return markdown.quality > html.quality;
  }

  return markdown.index < html.index;
}

export function markdownAssetPath(pathname: string): string | null {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (normalizedPath === "/") {
    return "/.well-known/markdown/index.md";
  }
  if (normalizedPath !== "/docs" && !normalizedPath.startsWith("/docs/")) {
    return null;
  }

  const docsPath = normalizedPath === "/docs" ? "/docs/index" : normalizedPath;
  return `/.well-known/markdown${docsPath}.md`;
}

export function addAgentHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const link of DISCOVERY_LINKS) headers.append("link", link);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

type ResponseFetcher = (request: Request) => Response | Promise<Response>;

export async function handleAgentRequest(
  request: Request,
  fetchHtml: ResponseFetcher,
  fetchAsset: ResponseFetcher,
): Promise<Response> {
  const pathname = new URL(request.url).pathname;
  const canFetchAsset = request.method === "GET" || request.method === "HEAD";

  if (canFetchAsset && pathname.startsWith("/.well-known/")) {
    return addAgentHeaders(await fetchAsset(request));
  }

  const assetPath = markdownAssetPath(pathname);
  const canServeMarkdown =
    canFetchAsset &&
    assetPath !== null &&
    prefersMarkdown(request.headers.get("accept"));

  if (canServeMarkdown) {
    const assetUrl = new URL(assetPath, request.url);
    const assetResponse = await fetchAsset(new Request(assetUrl, request));
    if (assetResponse.ok) {
      const headers = new Headers(assetResponse.headers);
      headers.set("content-type", "text/markdown; charset=utf-8");
      const vary = new Set(
        (headers.get("vary") ?? "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      );
      vary.add("Accept");
      headers.set("vary", [...vary].join(", "));

      return addAgentHeaders(
        new Response(assetResponse.body, {
          status: assetResponse.status,
          statusText: assetResponse.statusText,
          headers,
        }),
      );
    }
  }

  return addAgentHeaders(await fetchHtml(request));
}

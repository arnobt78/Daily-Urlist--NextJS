import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; UrllistBot/1.0; +https://urlist.com)",
      },
    });

    // if (!response.ok) {
    //   throw new Error(
    //     `Failed to fetch URL: ${response.status} ${response.statusText}`
    //   );
    // }
    if (!response.ok) {
      // If forbidden or error, return minimal fallback metadata
      if ([400, 403, 500].includes(response.status)) {
        return NextResponse.json({
          title: new URL(url).hostname,
          description: null,
          image: null,
          favicon: null,
          siteName: new URL(url).hostname,
          error: `No metadata available (HTTP ${response.status})`,
        });
      }
      throw new Error(
        `Failed to fetch URL: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    // Simple regex-based metadata extraction
    const getMetaContent = (name: string): string | null => {
      const match =
        html.match(
          new RegExp(
            `<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']+)["']`,
            "i"
          )
        ) ||
        html.match(
          new RegExp(
            `<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']${name}["']`,
            "i"
          )
        );
      return match ? match[1] : null;
    };

    const getTitle = (): string => {
      const ogTitle = getMetaContent("og:title");
      const twitterTitle = getMetaContent("twitter:title");
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

      return (
        ogTitle ||
        twitterTitle ||
        (titleMatch && titleMatch[1]) ||
        (h1Match && h1Match[1]) ||
        new URL(url).hostname
      );
    };

    const getFavicon = (): string | null => {
      const iconMatch =
        html.match(
          /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i
        ) ||
        html.match(
          /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:icon|shortcut icon)["']/i
        );
      if (!iconMatch) return null;
      let favicon = iconMatch[1];
      const urlObj = new URL(url);
      if (favicon.startsWith("//")) {
        favicon = `${urlObj.protocol}${favicon}`;
      } else if (favicon.startsWith("/")) {
        favicon = `${urlObj.protocol}//${urlObj.host}${favicon}`;
      } else if (!favicon.startsWith("http")) {
        favicon = `${urlObj.protocol}//${urlObj.host}/${favicon}`;
      }
      return favicon;
    };

    const metadata = {
      title: getTitle(),
      description:
        getMetaContent("og:description") ||
        getMetaContent("twitter:description") ||
        getMetaContent("description"),
      image: getMetaContent("og:image") || getMetaContent("twitter:image"),
      favicon: getFavicon(),
      siteName:
        getMetaContent("og:site_name") ||
        getMetaContent("application-name") ||
        new URL(url).hostname,
    };

    return NextResponse.json(metadata);
  } catch (error: unknown) {
    console.error("Error fetching metadata:", error);
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Failed to fetch metadata: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        : "Failed to fetch metadata";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

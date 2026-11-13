import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const categories = [
  "animals", "art-and-design", "cartoons", "computers", "food-and-drinks",
  "logos", "miscellaneous", "movies", "music", "nature", "people", "plants",
  "space", "sports-and-outdoors", "television", "toys", "vehicles", "video-games",
];

function decodeHtml(value: string): string {
  const named: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");
}

function extractArt(html: string): string[] {
  return [...html.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi)]
    .map((match) => decodeHtml(match[1]).replace(/\r/g, "").trim())
    .filter((art) => art.length > 18 && art.split("\n").length > 1 && !/ASCII Art Archive/i.test(art));
}

export async function GET() {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const source = `https://www.asciiart.eu/${category}`;

  try {
    const response = await fetch(source, {
      cache: "no-store",
      headers: { "User-Agent": "Gestalt ASCII Art Widget" },
    });
    if (!response.ok) throw new Error(`ASCIIArt.eu returned ${response.status}`);
    const art = extractArt(await response.text());
    if (!art.length) throw new Error("No ASCII artwork found");
    return NextResponse.json({
      art: art[Math.floor(Math.random() * art.length)],
      category: category.replaceAll("-", " "),
      source,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load ASCII art." }, { status: 502 });
  }
}

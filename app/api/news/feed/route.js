import { NextResponse } from "next/server";
import { TOPICS, topicByKey } from "@/lib/news/topics";
import { fetchTopic } from "@/lib/news/rss";

export const revalidate = 3600;
// Article-image lookups add a few seconds on a cold read; keep headroom.
export const maxDuration = 60;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("topic");
  // ?fresh=1 bypasses the link-resolver cache, for debugging.
  const fresh = searchParams.get("fresh") === "1";
  const topic = key ? topicByKey(key) : null;
  if (key && !topic) {
    return NextResponse.json({ error: `Unknown topic: ${key}` }, { status: 400 });
  }

  try {
    if (topic) {
      const items = await fetchTopic(topic, { fresh });
      const withImage = items.filter((it) => it.image).length;
      return NextResponse.json({
        topic: topic.key,
        fetchedAt: new Date().toISOString(),
        diagnostics: { items: items.length, withImage, resolve: items.resolveStats || null },
        items,
      });
    }
    // No topic: return counts for every topic so the sidebar can show them.
    const all = await Promise.all(TOPICS.map((t) => fetchTopic(t)));
    const counts = Object.fromEntries(TOPICS.map((t, i) => [t.key, all[i].length]));
    return NextResponse.json({ counts, fetchedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ error: `Feed fetch failed: ${err.message}` }, { status: 502 });
  }
}

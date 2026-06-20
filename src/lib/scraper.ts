import { WorkshopMap, StrategySpot, ColorLayer } from "@/types";

interface ScrapedWorkshopItem {
  id: string;
  title: string;
  author: string;
  authorLink: string;
  thumbnail: string;
  overviewImage: string;
  steamUrl: string;
  subscribers: number;
  fileSize: string;
  posted: string;
  updated: string;
  description: string;
}


export async function scrapeWorkshopItem(
  id: string
): Promise<ScrapedWorkshopItem | null> {
  const url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) return null;
    const html = await res.text();

    const titleMatch = html.match(
      /<div class="workshopItemTitle">([^<]+)<\/div>/
    );
    if (!titleMatch) return null;
    const title = titleMatch[1].trim();

    const ogImageMatch = html.match(
      /<meta property="og:image" content="([^"]+)"/
    );
    const thumbnail = ogImageMatch
      ? ogImageMatch[1].replace(/\?.*$/, "")
      : "";

    const authorMatch = html.match(
      /<a class="workshopItemAuthor"[^>]*href="([^"]*)"[^>]*>[\s\S]*?<img[^>]*alt="([^"]*)"/
    );
    let author = "Unknown";
    let authorLink = "";
    if (authorMatch) {
      authorLink = authorMatch[1].startsWith("http")
        ? authorMatch[1]
        : `https://steamcommunity.com${authorMatch[1]}`;
      author = authorMatch[2];
    } else {
      const altMatch = html.match(
        /Created by[\s\S]*?avatar_medium[^"]*"[^"]*"[^>]*>[\s\S]*?alt="([^"]*)"/
      );
      const simpleAuthor = html.match(
        /Created by[\s\S]*?alt="([^"]+)"/
      );
      if (simpleAuthor) author = simpleAuthor[1];
    }

    const subscribersMatch = html.match(
      /(\d[\d,]*)\s*Current Subscribers/
    );
    const subscribers = subscribersMatch
      ? parseInt(subscribersMatch[1].replace(/,/g, ""))
      : 0;

    const fileSizeMatch = html.match(
      /File Size[\s\S]*?<div[^>]*>([^<]+)<\/div>/
    );
    const fileSize = fileSizeMatch ? fileSizeMatch[1].trim() : "";

    const postedMatch = html.match(
      /Posted[\s\S]*?<div[^>]*>([^<]+)<\/div>/
    );
    const posted = postedMatch ? postedMatch[1].trim() : "";

    const updatedMatch = html.match(
      /Updated[\s\S]*?<div[^>]*>([^<]+)<\/div>/
    );
    const updated = updatedMatch ? updatedMatch[1].trim() : "";

    const previewMatches = html.matchAll(
      /<img[^>]*src="([^"]+)"[^>]*class="preview_img"[^>]*>/g
    );
    const previews = [...previewMatches].map((m) =>
      m[1].replace(/\?.*$/, "")
    );
    const overviewImage = previews[0] || thumbnail;

    const descMatch = html.match(/class="workshopItemDescription">([\s\S]*?)<\/div>/);
    const description = descMatch
      ? descMatch[1].replace(/<[^>]*>/g, "").trim()
      : "";

    return {
      id,
      title,
      author,
      authorLink,
      thumbnail,
      overviewImage,
      steamUrl: url,
      subscribers,
      fileSize,
      posted,
      updated,
      description,
    };
  } catch {
    return null;
  }
}

export function itemToMap(item: ScrapedWorkshopItem): WorkshopMap {
  const id = `ws-${item.id}`;
  const tags = inferTags(item.title, item.description);
  const spotCount = Math.floor(Math.random() * 3) + 2;
  const spots: StrategySpot[] = generateSpots(spotCount, id, item.title);

  return {
    id,
    title: item.title,
    author: item.author,
    authorLink: item.authorLink,
    thumbnail: item.thumbnail,
    overviewImage: item.overviewImage,
    steamWorkshopUrl: item.steamUrl,
    tags,
    spotCount,
    popularity: item.subscribers * 10,
    subscribers: item.subscribers,
    fileSize: item.fileSize,
    createdAt: item.posted,
    updatedAt: item.updated,
    spots,
  };
}

const TAG_KEYWORDS: [string, string[]][] = [
  ["經典IP改編", ["minecraft", "mario", "cs2", "simpson", "spongebob", "pokemon", "doom", "luigi", "nintendo", "stampy", "west hunt", "bikini"]],
  ["迷宮", ["maze", "labyrinth", "迷宮"]],
  ["室內", ["indoor", "house", "room", "kitchen", "lobby", "dining", "nightclub", "corridor", "hall", "office", "building"]],
  ["室外", ["outdoor", "field", "garden", "forest", "nature", "park", "outside", "yard"]],
  ["復古像素", ["retro", "pixel", "arcade", "8bit", "16bit"]],
  ["高難度", ["challenge", "hard", "difficult", "hell", "nightmare", "insane"]],
];

function inferTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];
  for (const [tag, keywords] of TAG_KEYWORDS) {
    if (keywords.some((k) => text.includes(k))) {
      tags.push(tag);
    }
  }
  if (tags.length === 0) tags.push("室內");
  return tags.slice(0, 3);
}

const HIDER_DESCRIPTIONS = [
  "貼合牆面紋理，與背景融為一體",
  "利用角落陰影完美遮蔽身形",
  "蹲伏於家具後方，調整顏色至一致",
  "攀附於天花板橫樑，對齊木紋走向",
  "躲在大型物件後，利用顏色混入環境",
  "緊貼垂直管線，利用金屬反光混淆視線",
  "藏身於植栽之間，將身體染為草綠",
  "利用入口處的天然陰影帶遮蔽",
  "在開闊區域中蹲下，模擬地面材質",
  "背靠柱子，將身體色調整為柱面色",
];

const STYLE_NOTES = [
  "使用 3 號畫筆，以 45 度斜角畫出木紋條紋",
  "使用填充工具 + 柔邊筆刷，模仿牆面斑駁質感",
  "先上底色，再用 2 號畫筆補垂直細線對齊牆縫",
  "用噴槍模式輕掃邊緣，讓輪廓模糊自然融入",
  "需使用 3 色漸層：底部最深、頂部最亮，模仿立體感",
  "使用方格筆刷打出 4x4 瓷磚格紋後再填充",
  "先填深色底色，再用乾筆刷水平橫掃製造木紋",
  "建議使用 5 號筆刷大面積塗底色，再補暗部陰影",
  "對齊背景幾何線條，使用尺規工具輔助繪製",
  "重點是邊緣羽化處理，用低透明度噴槍修邊",
];

const COLOR_PALETTES: ColorLayer[][] = [
  [
    { label: "底色", hex: "#A3C1AD", rgb: "163, 193, 173" },
    { label: "條紋色", hex: "#2F4F4F", rgb: "47, 79, 79" },
  ],
  [
    { label: "底色", hex: "#D2691E", rgb: "210, 105, 30" },
    { label: "陰影色", hex: "#8B4513", rgb: "139, 69, 19" },
  ],
  [
    { label: "底色", hex: "#4A4A4A", rgb: "74, 74, 74" },
    { label: "亮面色", hex: "#7A7A7A", rgb: "122, 122, 122" },
    { label: "縫線色", hex: "#2A2A2A", rgb: "42, 42, 42" },
  ],
  [
    { label: "底色", hex: "#F5DEB3", rgb: "245, 222, 179" },
    { label: "木紋色", hex: "#8B6B3A", rgb: "139, 107, 58" },
  ],
  [
    { label: "底色", hex: "#6B4226", rgb: "107, 66, 38" },
    { label: "深溝色", hex: "#3E2723", rgb: "62, 39, 35" },
    { label: "亮緣色", hex: "#8B6914", rgb: "139, 105, 20" },
  ],
  [
    { label: "底色", hex: "#556B2F", rgb: "85, 107, 47" },
    { label: "斑點色", hex: "#3A5A1A", rgb: "58, 90, 26" },
  ],
];

const DISCOVERERS: { name: string; url: string }[] = [
  { name: "CommunitySpotter", url: "https://twitch.tv/communityspotter" },
  { name: "HideMaster", url: "https://youtube.com/@hidemaster" },
  { name: "CamouflagePro", url: "https://twitter.com/camopro" },
  { name: "StealthGamer", url: "https://twitch.tv/stealthgamer" },
  { name: "NinjaHider", url: "https://youtube.com/@ninjahider" },
];

function generateColors(): ColorLayer[] {
  return COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
}

function generateSpots(count: number, mapId: string, mapTitle: string): StrategySpot[] {
  const spots: StrategySpot[] = [];
  const usedPositions = new Set<string>();

  for (let i = 0; i < count; i++) {
    let x: number, y: number, key: string;
    do {
      x = Math.round((Math.random() * 75 + 5) * 10) / 10;
      y = Math.round((Math.random() * 75 + 5) * 10) / 10;
      key = `${x}-${y}`;
    } while (usedPositions.has(key));
    usedPositions.add(key);

    spots.push({
      id: `${mapId}-spot-${i + 1}`,
      name: `${["牆角", "陰影區", "家具後", "高處", "掩體後", "通道旁", "角落", "遮蔽處", "凹陷區", "裝飾旁"][i % 10]} #${i + 1}`,
      position: { x, y },
      description: HIDER_DESCRIPTIONS[i % HIDER_DESCRIPTIONS.length],
      colors: generateColors(),
      styleNote: STYLE_NOTES[i % STYLE_NOTES.length],
      stealthRating: Math.floor(Math.random() * 3) + 3,
      difficultyRating: Math.floor(Math.random() * 4) + 1,
      discoveredBy: DISCOVERERS[i % DISCOVERERS.length].name,
      discovererLink: DISCOVERERS[i % DISCOVERERS.length].url,
      successRate: Math.floor(Math.random() * 30) + 60,
      isApproved: true,
    });
  }

  return spots;
}

export async function batchScrapeWorkshop(
  ids: string[]
): Promise<WorkshopMap[]> {
  const results: WorkshopMap[] = [];
  const batchSize = 3;

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const items = await Promise.all(
      batch.map((id) => scrapeWorkshopItem(id))
    );
    for (const item of items) {
      if (item) {
        results.push(itemToMap(item));
      }
    }
  }

  return results;
}

export function extractWorkshopIds(html: string): string[] {
  const matches = html.matchAll(/sharedfiles\/filedetails\/\?id=(\d+)/g);
  return [...new Set([...matches].map((m) => m[1]))].slice(0, 50);
}

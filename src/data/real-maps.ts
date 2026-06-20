import { WorkshopMap, StrategySpot, ColorLayer } from "@/types";

const WS_BASE = "https://steamcommunity.com/sharedfiles/filedetails/?id=";

interface RawItem {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  authorLink: string;
  overviewImage?: string;
  subscribers?: number;
}

const RAW_WORKSHOP_ITEMS: RawItem[] = [
  {
    id: "3747352542",
    title: "Nightclub",
    thumbnail: "https://images.steamusercontent.com/ugc/18391351790237915437/EE4E67266CB8B4D4FF46C12E1C55064B33F0FB34/",
    author: "vegal",
    authorLink: "https://steamcommunity.com/id/OilCleaner",
    subscribers: 8232,
  },
  {
    id: "3746909981",
    title: "Viking Dining",
    thumbnail: "https://images.steamusercontent.com/ugc/15033394391515872304/8CF689C493762EEBB284344F9A34694D8A1A651D/",
    author: "RareKiwi",
    authorLink: "https://steamcommunity.com/id/rarekiwi",
    subscribers: 32994,
  },
  {
    id: "3746742291",
    title: "West Hunt Inspired Map",
    thumbnail: "https://images.steamusercontent.com/ugc/9998955506574600555/C493F88C39D095499AFAD7BE23A3512CE3FEF556/",
    author: "PidgePlum",
    authorLink: "https://steamcommunity.com/id/Purple_Pidge",
    subscribers: 70853,
  },
  {
    id: "3746928707",
    title: "Minecraft Stampy's lovely world",
    thumbnail: "https://images.steamusercontent.com/ugc/13187466222161513020/5462936896A58367341846FFA4D4E82E11966E10/",
    author: "RareKiwi",
    authorLink: "https://steamcommunity.com/id/rarekiwi",
    subscribers: 28900,
  },
  {
    id: "3747027518",
    title: "Strike Zone Bowling Alley",
    thumbnail: "https://images.steamusercontent.com/ugc/16727042222417414866/C9106BC819E82DDD31A284ED3D57278E1A5F009B/",
    author: "Cataclysm101",
    authorLink: "https://steamcommunity.com/id/Cataclysm101",
    subscribers: 15300,
  },
  {
    id: "3747451504",
    title: "CS2 Nuke",
    thumbnail: "https://images.steamusercontent.com/ugc/9307409107732855045/F25AAF7C2148B4CB6A35EAB58F228B0CD39210E1/",
    author: "Seto",
    authorLink: "https://steamcommunity.com/id/seto",
    subscribers: 19800,
  },
  {
    id: "3746014934",
    title: "Kitchen",
    thumbnail: "https://images.steamusercontent.com/ugc/9543737652085889784/1122D962F369BE4E0A4BDD4409C28516E9A9F0E7/",
    author: "Seto",
    authorLink: "https://steamcommunity.com/id/seto",
    subscribers: 12500,
  },
  {
    id: "3746941111",
    title: "Minecraft Lobby",
    thumbnail: "https://images.steamusercontent.com/ugc/11419641584122397837/D0EEFDBD56D25BD669763B61F72ABB1B9D9D34AE/",
    author: "RareKiwi",
    authorLink: "https://steamcommunity.com/id/rarekiwi",
    subscribers: 22100,
  },
  {
    id: "3747568245",
    title: "Retro Arcade",
    thumbnail: "https://images.steamusercontent.com/ugc/11739885369561036156/D47874287678B78366EE490F558E8B4A4DFCAEDD/",
    author: "acid_fox",
    authorLink: "https://steamcommunity.com/id/acid_fox",
    subscribers: 6700,
  },
  {
    id: "3747007393",
    title: "Luxury Mansion",
    thumbnail: "https://images.steamusercontent.com/ugc/9780146788290269499/E088104980E7923EAB3220B208361D6F671C49EC/",
    author: "Popunia",
    authorLink: "https://steamcommunity.com/id/popunia",
    subscribers: 18400,
  },
  {
    id: "3746878727",
    title: "Haunted Asylum",
    thumbnail: "https://images.steamusercontent.com/ugc/10102785980775473066/0A69F9949B84124A179A6D20C43A97DB7475169D/",
    author: "Popunia",
    authorLink: "https://steamcommunity.com/id/popunia",
    subscribers: 14300,
  },
  {
    id: "3744912042",
    title: "Japanese Dojo",
    thumbnail: "https://images.steamusercontent.com/ugc/11001156439713052174/D053E8BE6573452E55CCD278D3E682D8B3100BAA/",
    author: "Acid_fox",
    authorLink: "https://steamcommunity.com/id/acid_fox",
    subscribers: 12100,
  },
  {
    id: "3746796290",
    title: "Space Station",
    thumbnail: "https://images.steamusercontent.com/ugc/18082857313914868271/CD3C2CA82E738F5DDF61BA81556B5FE61AD826B0/",
    author: "NanoBuilder",
    authorLink: "https://steamcommunity.com/id/nanobuilder",
    subscribers: 9500,
  },
  {
    id: "3745677927",
    title: "Abandoned Hospital",
    thumbnail: "https://images.steamusercontent.com/ugc/10572325284563653737/C4210CE675EC0D6DE714A38F26092A00C1C11BE0/",
    author: "Seto",
    authorLink: "https://steamcommunity.com/id/seto",
    subscribers: 11200,
  },
];

const TAG_RULES: [RegExp, string][] = [
  [/minecraft|stampy/i, "經典IP改編"],
  [/cs2|nuke/i, "經典IP改編"],
  [/west hunt/i, "經典IP改編"],
  [/nightclub|kitchen|lobby|mansion|dojo|asylum|hospital|dining|bowling/i, "室內"],
  [/space|station/i, "室外"],
  [/retro|arcade/i, "復古像素"],
  [/haunted|asylum|abandoned/i, "高難度"],
];

function inferTags(title: string): string[] {
  const tags: string[] = [];
  for (const [pattern, tag] of TAG_RULES) {
    if (pattern.test(title)) tags.push(tag);
  }
  if (tags.length === 0) tags.push("室內");
  return [...new Set(tags)].slice(0, 3);
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

const DISCOVERERS: { name: string; url: string }[] = [
  { name: "CommunitySpotter", url: "https://twitch.tv/communityspotter" },
  { name: "HideMaster", url: "https://youtube.com/@hidemaster" },
  { name: "CamouflagePro", url: "https://twitter.com/camopro" },
  { name: "StealthGamer", url: "https://twitch.tv/stealthgamer" },
  { name: "NinjaHider", url: "https://youtube.com/@ninjahider" },
  { name: "ChameleonKing", url: "https://twitch.tv/chameleonking" },
  { name: "SpotFinder_ZH", url: "https://twitter.com/spotfinder_zh" },
  { name: "PigmentPro", url: "https://youtube.com/@pigmentpro" },
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

function generateColors(): ColorLayer[] {
  return COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
}

function generateSpots(count: number, mapId: string): StrategySpot[] {
  const spots: StrategySpot[] = [];
  const usedPositions = new Set<string>();

  for (let i = 0; i < count; i++) {
    let x: number, y: number, key: string;
    do {
      x = Math.round((Math.random() * 70 + 10) * 10) / 10;
      y = Math.round((Math.random() * 70 + 10) * 10) / 10;
      key = `${x}-${y}`;
    } while (usedPositions.has(key));
    usedPositions.add(key);

    const discoverer = DISCOVERERS[i % DISCOVERERS.length];

    spots.push({
      id: `${mapId}-spot-${i + 1}`,
      name: `${["陰暗角落", "家具遮蔽區", "高處橫樑", "壁龕陰影", "管線後方", "植栽叢中", "門後區域", "櫃子夾層", "裝飾物旁", "地形凹陷處"][i % 10]}`,
      position: { x, y },
      description: HIDER_DESCRIPTIONS[i % HIDER_DESCRIPTIONS.length],
      colors: generateColors(),
      styleNote: STYLE_NOTES[i % STYLE_NOTES.length],
      stealthRating: Math.floor(Math.random() * 3) + 3,
      difficultyRating: Math.floor(Math.random() * 4) + 1,
      discoveredBy: discoverer.name,
      discovererLink: discoverer.url,
      successRate: Math.floor(Math.random() * 35) + 60,
      isApproved: true,
      isAuthorPick: i < 2 && mapId.includes("ws-"),
    });
  }

  return spots;
}

function buildMaps(): WorkshopMap[] {
  return RAW_WORKSHOP_ITEMS.map((raw) => {
    const id = `ws-${raw.id}`;
    const tags = inferTags(raw.title);
    const spotCount = Math.min(tags.includes("高難度") ? 6 : tags.includes("迷宮") ? 5 : 4, 6);

    return {
      id,
      title: raw.title,
      author: raw.author,
      authorLink: raw.authorLink,
      thumbnail: raw.thumbnail,
      overviewImage: raw.overviewImage || raw.thumbnail,
      steamWorkshopUrl: `${WS_BASE}${raw.id}`,
      tags,
      spotCount,
      popularity: (raw.subscribers || 0) * 12,
      subscribers: raw.subscribers || 0,
      fileSize: "—",
      createdAt: "2026-06-17",
      updatedAt: "2026-06-19",
      spots: generateSpots(spotCount, id),
    };
  });
}

export const realMaps: WorkshopMap[] = buildMaps();

export function getRealMapById(id: string): WorkshopMap | undefined {
  return realMaps.find((m) => m.id === id);
}

export const realMapTags: string[] = [
  ...new Set(realMaps.flatMap((m) => m.tags)),
];

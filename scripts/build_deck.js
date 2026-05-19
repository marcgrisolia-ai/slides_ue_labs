const fs = require("fs");
const path = require("path");
const pptxgen = require("../.codex_node_deps/node_modules/pptxgenjs");
const sharp = require("../.codex_node_deps/node_modules/sharp");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const EXTRACTED = path.join(ROOT, "assets", "extracted");
const PROCESSED = path.join(ROOT, "assets", "processed");
const OUT = path.join(DIST, "UE_LABS_Presentation_2025_Redesigned.pptx");

const W = 13.333;
const H = 7.5;

const C = {
  bg: "080C0E",
  bg2: "10171B",
  panel: "111A1F",
  panel2: "172328",
  green: "3DCD58",
  green2: "17B83E",
  text: "F5F8F6",
  muted: "A8B4B1",
  muted2: "6F7B7A",
  line: "344148",
  line2: "4B5A61",
  white: "FFFFFF",
  black: "000000",
  red: "D32222",
  orange: "F08A00",
  blue: "188DCC",
};

const F = {
  title: "Aptos Display",
  body: "Aptos",
  mono: "Aptos",
};

const standardsByLab = {
  SU: [
    "IEC 62208",
    "ISO 12944-6",
    "ISO 4624",
    "IEC 60079-0",
    "EN 61386-1",
  ],
  ML: ["IEC 62208", "IEC 61439-1", "IEC 61439-5"],
  KP: [
    "IEC 62208",
    "ISO 12944-6",
    "UL 50 / CSA C22.2 Nº 94.1",
    "UL 50E / CSA C22.2 Nº 94.2",
    "UL 746 C",
  ],
};

const standardDescriptions = {
  "IEC 62208": "Empty enclosures for low-voltage switchgear and controlgear assemblies - General requirements",
  "ISO 12944-6": "Paints and varnishes — Corrosion protection of steel structures by protective paint systems — Part 6: Laboratory performance test methods",
  "ISO 4624": "Paints and varnishes — Pull-off test for adhesion",
  "IEC 60079-0": "Explosive atmospheres -- Part 0: Equipment - General requirements",
  "EN 61386-1": "Conduit systems for cable management -- Part 1: General requirements",
  "IEC 61439-1": "Low-voltage switchgear and controlgear assemblies - Part 1: General rules",
  "IEC 61439-5": "Low-voltage switchgear and controlgear assemblies - Part 5: Assemblies for power distribution in public networks",
  "UL 50 / CSA C22.2 Nº 94.1": "Enclosures for Electrical Equipment, Non-Environmental Considerations",
  "UL 50E / CSA C22.2 Nº 94.2": "Enclosures for Electrical Equipment, Environmental Considerations",
  "UL 746 C": "Standard for Polymeric Materials - Use in Electrical Equipment Evaluations",
};

function p(...parts) {
  return path.join(ROOT, ...parts);
}

function ensureDirs() {
  for (const dir of [DIST, PROCESSED, path.join(DIST, "thumbnails")]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function hero(src, dst, cropBottom = 0) {
  const input = path.join(EXTRACTED, src);
  const img = sharp(input).rotate();
  const meta = await img.metadata();
  let pipeline = sharp(input).rotate();
  if (cropBottom > 0 && meta.width && meta.height) {
    const h = Math.floor(meta.height * (1 - cropBottom));
    pipeline = pipeline.extract({ left: 0, top: 0, width: meta.width, height: h });
  }
  await pipeline
    .resize(1920, 1080, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.78, saturation: 0.84 })
    .sharpen({ sigma: 0.7 })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(PROCESSED, dst));
}

async function product(src, dst) {
  await sharp(path.join(EXTRACTED, src))
    .rotate()
    .resize(1100, 720, { fit: "inside", withoutEnlargement: true })
    .png({ quality: 94 })
    .toFile(path.join(PROCESSED, dst));
}

function writeSvgAssets() {
  const map = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900">
  <defs>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0v44" fill="none" stroke="#314047" stroke-width="1" opacity=".35"/>
    </pattern>
    <filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1400" height="900" fill="none"/>
  <rect x="0" y="0" width="1400" height="900" fill="url(#grid)" opacity=".42"/>
  <g fill="#263138" stroke="#5D6A70" stroke-width="3" opacity=".92">
    <path d="M653 108 732 136 798 125 863 166 949 178 1017 232 989 292 1054 353 1010 408 930 395 872 421 814 390 767 421 698 391 635 426 574 400 522 423 473 384 501 328 441 286 474 231 554 221 590 168Z"/>
    <path d="M417 391 508 412 569 460 560 529 489 541 419 496 379 431Z"/>
    <path d="M576 536 645 564 705 626 756 615 800 675 765 744 666 718 615 646Z"/>
    <path d="M812 459 904 472 957 540 930 611 837 606 785 536Z"/>
    <path d="M321 288 382 269 432 311 401 363 329 359Z"/>
  </g>
  <g stroke="#3DCD58" stroke-width="5" fill="none" filter="url(#glow)">
    <path d="M560 478 C610 430 665 410 725 398"/>
    <path d="M560 478 C530 518 512 556 500 600"/>
    <path d="M560 478 C596 521 636 565 686 602"/>
  </g>
  <g font-family="Aptos, Arial, sans-serif" font-weight="700" text-anchor="middle">
    <circle cx="725" cy="398" r="30" fill="#188DCC" stroke="#FFFFFF" stroke-width="4"/>
    <text x="725" y="408" fill="#fff" font-size="28">SU</text>
    <circle cx="500" cy="600" r="30" fill="#D32222" stroke="#FFFFFF" stroke-width="4"/>
    <text x="500" y="610" fill="#fff" font-size="28">KP</text>
    <circle cx="686" cy="602" r="30" fill="#F08A00" stroke="#FFFFFF" stroke-width="4"/>
    <text x="686" y="612" fill="#fff" font-size="28">ML</text>
  </g>
</svg>`;

  const environment = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0" stop-color="#080C0E"/>
      <stop offset=".55" stop-color="#10171B"/>
      <stop offset="1" stop-color="#080C0E"/>
    </linearGradient>
    <pattern id="diag" width="72" height="72" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <path d="M0 0H72" stroke="#344148" stroke-width="1" opacity=".28"/>
    </pattern>
  </defs>
  <rect width="1920" height="1080" fill="url(#fade)"/>
  <rect width="1920" height="1080" fill="url(#diag)" opacity=".55"/>
  <g fill="none" stroke="#3DCD58" stroke-width="3" opacity=".58">
    <path d="M138 836H414l76-92h292l86-102h314l108-132h386"/>
    <path d="M134 276h292l96 88h254l92 78h302l86 78h280"/>
    <circle cx="414" cy="836" r="10" fill="#3DCD58"/>
    <circle cx="782" cy="744" r="10" fill="#3DCD58"/>
    <circle cx="1182" cy="642" r="10" fill="#3DCD58"/>
    <circle cx="1656" cy="510" r="10" fill="#3DCD58"/>
  </g>
  <g stroke="#5D6A70" stroke-width="2" opacity=".52">
    <rect x="1140" y="184" width="314" height="202" rx="2" fill="none"/>
    <rect x="1210" y="248" width="314" height="202" rx="2" fill="none"/>
    <rect x="1280" y="312" width="314" height="202" rx="2" fill="none"/>
  </g>
</svg>`;

  fs.writeFileSync(path.join(PROCESSED, "ue_labs_network_map.svg"), map);
  fs.writeFileSync(path.join(PROCESSED, "environment_technical_field.svg"), environment);
}

async function prepareAssets() {
  ensureDirs();
  await hero("asset_032_image4.jpeg", "cover_hero.jpg");
  await hero("asset_014_image18.png", "capellades_hero.jpg", 0.16);
  await hero("asset_018_image21.png", "sarre_hero.jpg");
  await hero("asset_023_image26.png", "molins_hero.jpg", 0.16);
  await hero("asset_025_image28.jpeg", "product_portfolio_hero.jpg");
  await product("asset_029_image31.png", "product_spacial.png");
  await product("asset_028_image30.jpeg", "product_thalassa.png");
  await product("asset_030_image32.png", "product_climasys.png");
  await product("asset_024_image27.png", "ul_certificate.png");
  await product("asset_027_image3.png", "schneider_logo_green.png");
  await product("asset_026_image29.png", "schneider_logo_white.png");
  writeSvgAssets();
}

function addBg(slide, variant = 0) {
  slide.background = { color: C.bg };
  slide.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: C.bg }, line: { color: C.bg } });
  for (let x = 0.8; x < W; x += 0.8) {
    slide.addShape("line", {
      x, y: 0.72, w: 0, h: 5.88,
      line: { color: C.line, transparency: 86, pt: 0.45 },
    });
  }
  for (let y = 0.9; y < H - 0.65; y += 0.72) {
    slide.addShape("line", {
      x: 0.55, y, w: 12.2, h: 0,
      line: { color: C.line, transparency: 88, pt: 0.45 },
    });
  }
  const accentX = variant % 2 ? 10.95 : 0.55;
  slide.addShape("line", { x: accentX, y: 0.62, w: 1.6, h: 0, line: { color: C.green, pt: 2.0 } });
  slide.addShape("line", { x: accentX, y: 0.72, w: 0.72, h: 0, line: { color: C.green, transparency: 25, pt: 1.0 } });
}

function txt(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    margin: opts.margin ?? 0,
    breakLine: false,
    fit: opts.fit || "shrink",
    fontFace: opts.fontFace || F.body,
    fontSize: opts.fontSize || 18,
    color: opts.color || C.text,
    bold: opts.bold || false,
    italic: opts.italic || false,
    align: opts.align || "left",
    valign: opts.valign || "top",
    rotate: opts.rotate,
    charSpace: 0,
    paraSpaceAfterPt: opts.paraSpaceAfterPt || 0,
    breakLine: opts.breakLine,
  });
}

function label(slide, text, x, y, w, color = C.green) {
  txt(slide, text.toUpperCase(), x, y, w, 0.22, {
    fontFace: F.body,
    fontSize: 8.5,
    bold: true,
    color,
    fit: "shrink",
  });
}

function title(slide, kicker, main, sub) {
  if (kicker) label(slide, kicker, 0.72, 0.55, 4.6);
  txt(slide, main, 0.68, 0.83, 9.5, 0.55, {
    fontFace: F.title,
    fontSize: 34,
    bold: true,
    color: C.text,
    fit: "shrink",
  });
  if (sub) {
    txt(slide, sub, 0.72, 1.4, 9.0, 0.35, {
      fontSize: 14,
      color: C.muted,
      fit: "shrink",
    });
  }
}

function footer(slide, page) {
  slide.addShape("line", { x: 0.62, y: 7.05, w: 12.1, h: 0, line: { color: C.line2, transparency: 52, pt: 0.5 } });
  txt(slide, "© 2020 Schneider Electric, All Rights Reserved | Confidential Property of Schneider Electric", 0.68, 7.14, 7.4, 0.16, {
    fontSize: 5.8,
    color: C.muted2,
    fit: "shrink",
  });
  txt(slide, `Page ${page}`, 12.08, 7.14, 0.55, 0.16, {
    fontSize: 5.8,
    color: C.muted2,
    align: "right",
  });
}

function logo(slide, x, y, w, mode = "green") {
  const file = mode === "white" ? "schneider_logo_white.png" : "schneider_logo_green.png";
  slide.addImage({ path: path.join(PROCESSED, file), x, y, w, h: w * 0.277 });
}

function panel(slide, x, y, w, h, opts = {}) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: opts.color || C.panel, transparency: opts.transparency ?? 3 },
    line: { color: opts.line || C.line, transparency: opts.lineTransparency ?? 35, pt: opts.pt ?? 0.65 },
  });
}

function metric(slide, value, labelText, detail, x, y, w) {
  txt(slide, value, x, y, w, 0.54, {
    fontFace: F.title,
    fontSize: 36,
    bold: true,
    color: C.green,
  });
  slide.addShape("line", { x, y: y + 0.63, w: w * 0.68, h: 0, line: { color: C.green, pt: 1.5 } });
  txt(slide, labelText, x, y + 0.78, w, 0.38, {
    fontSize: 15,
    bold: true,
    color: C.text,
  });
  if (detail) {
    txt(slide, detail, x, y + 1.17, w, 0.55, {
      fontSize: 10.4,
      color: C.muted,
      fit: "shrink",
    });
  }
}

function node(slide, text, x, y, w, h, opts = {}) {
  panel(slide, x, y, w, h, { color: opts.fill || C.panel2, line: opts.line || C.line, lineTransparency: opts.lineTransparency ?? 20 });
  if (opts.accent) slide.addShape("rect", { x, y, w: 0.05, h, fill: { color: opts.accent }, line: { color: opts.accent } });
  txt(slide, text, x + 0.13, y + 0.11, w - 0.26, h - 0.18, {
    fontSize: opts.fontSize || 15,
    bold: opts.bold ?? true,
    color: opts.color || C.text,
    valign: "mid",
    fit: "shrink",
  });
}

function chip(slide, text, x, y, w, color = C.green) {
  slide.addShape("rect", {
    x, y, w, h: 0.28,
    fill: { color: C.bg2, transparency: 3 },
    line: { color, transparency: 8, pt: 0.7 },
  });
  txt(slide, text, x + 0.06, y + 0.045, w - 0.12, 0.16, {
    fontSize: 8.6,
    bold: true,
    color: C.text,
    fit: "shrink",
  });
}

function labBadge(slide, code, name, location, x, y, color) {
  slide.addShape("ellipse", { x, y, w: 0.62, h: 0.62, fill: { color }, line: { color: C.white, pt: 1.2 } });
  txt(slide, code, x, y + 0.16, 0.62, 0.22, {
    fontSize: 14,
    bold: true,
    color: C.white,
    align: "center",
  });
  txt(slide, name, x + 0.78, y + 0.03, 2.4, 0.26, {
    fontSize: 14,
    bold: true,
    color: C.text,
  });
  txt(slide, location, x + 0.78, y + 0.34, 2.4, 0.22, {
    fontSize: 10.5,
    color: C.muted,
  });
}

function addPhotoBg(slide, file) {
  slide.addImage({ path: path.join(PROCESSED, file), x: 0, y: 0, w: W, h: H });
  slide.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: C.black, transparency: 26 }, line: { color: C.black, transparency: 100 } });
  slide.addShape("rect", { x: 0, y: 0, w: 5.15, h: H, fill: { color: C.bg, transparency: 7 }, line: { color: C.bg, transparency: 100 } });
  slide.addShape("line", { x: 5.16, y: 0.7, w: 0, h: 5.95, line: { color: C.green, transparency: 15, pt: 1.5 } });
}

function addNotes(slide, notes) {
  if (notes) slide.addNotes(notes);
}

function buildSlides() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Schneider Electric";
  pptx.company = "Schneider Electric";
  pptx.subject = "UE Labs redesigned internal presentation";
  pptx.title = "UE LABS - Testing, certification & product validation network";
  pptx.lang = "en-US";
  pptx.theme = {
    headFontFace: F.title,
    bodyFontFace: F.body,
    lang: "en-US",
  };

  // 1. Cover
  {
    const s = pptx.addSlide();
    s.addImage({ path: path.join(PROCESSED, "cover_hero.jpg"), x: 0, y: 0, w: W, h: H });
    s.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: C.black, transparency: 22 }, line: { color: C.black, transparency: 100 } });
    s.addShape("rect", { x: 0, y: 0, w: 7.1, h: H, fill: { color: C.bg, transparency: 5 }, line: { color: C.bg, transparency: 100 } });
    s.addShape("line", { x: 0.72, y: 0.72, w: 2.2, h: 0, line: { color: C.green, pt: 2.1 } });
    logo(s, 10.7, 0.55, 1.55, "green");
    txt(s, "UE LABS", 0.72, 2.16, 5.8, 0.78, { fontFace: F.title, fontSize: 54, bold: true });
    txt(s, "Testing, certification & product validation network", 0.78, 3.02, 5.8, 0.44, { fontSize: 19, color: C.muted });
    s.addShape("line", { x: 0.78, y: 3.72, w: 3.55, h: 0, line: { color: C.green, pt: 1.4 } });
    txt(s, "Nuria Bas", 0.78, 5.18, 3.4, 0.28, { fontSize: 15, bold: true });
    txt(s, "UE CS&Q Director & Labs Director", 0.78, 5.52, 4.0, 0.24, { fontSize: 12.5, color: C.muted });
    footer(s, 1);
    addNotes(s, "Source cover facts preserved: UE LABS; presenter Nuria Bas; role UE CS&Q Director & Labs Director.");
  }

  // 2. At a glance
  {
    const s = pptx.addSlide();
    addBg(s, 1);
    title(s, "Network snapshot", "UE Labs at a glance", "Three local manufacturing-plant laboratories supporting validation, certification and quality.");
    s.addImage({ path: path.join(PROCESSED, "ue_labs_network_map.svg"), x: 0.55, y: 1.45, w: 5.55, h: 3.57 });
    panel(s, 0.72, 5.28, 5.0, 0.72, { transparency: 22, lineTransparency: 70 });
    txt(s, "One lab in each manufacturing plant: Sarre-Union, Molins de Rei & Capellades.", 0.95, 5.46, 4.48, 0.32, {
      fontSize: 12.5,
      color: C.muted,
      fit: "shrink",
    });
    metric(s, "3", "Labs", "Sarre-Union, Molins de Rei and Capellades", 6.42, 1.42, 2.0);
    metric(s, "7", "Lab Employees", "5 lab technicians, 1 Test & Expert Leader and Lab Manager", 8.9, 1.42, 3.25);
    metric(s, "3012", "Tests done in 2021", "", 6.42, 3.38, 2.8);
    metric(s, "1", "Lab accredited by UL since 1999", "", 9.58, 3.38, 2.9);
    panel(s, 6.42, 5.55, 5.8, 0.77, { transparency: 13, line: C.green, lineTransparency: 40 });
    txt(s, "Capellades Lab is CTDP by UL since 1999, File number DA307", 6.66, 5.77, 5.35, 0.28, {
      fontSize: 13.2,
      bold: true,
      color: C.text,
      fit: "shrink",
    });
    footer(s, 2);
    addNotes(s, "Source facts preserved: 3 Labs; 7 Lab Employees; 3012 tests done in 2021; 1 Lab accredited by UL since 1999; one lab in each manufacturing plant; 5 lab technicians, 1 Test & Expert Leader and Lab Manager; Capellades Lab is CTDP by UL since 1999, File number DA307.");
  }

  // 3. Where UE Labs fits
  {
    const s = pptx.addSlide();
    addBg(s, 0);
    title(s, "Schneider Electric organization", "Where UE Labs fits in Schneider Electric", "Universal Enclosures LoB is inside the Energy Management business structure.");
    const steps = [
      ["Energy Management", "Business"],
      ["Power Systems & Services", "Division"],
      ["ETO", "Engineering To Order LoB"],
      ["Universal Enclosures", "LoB"],
      ["UE Labs", "Validation network"],
    ];
    const x0 = 0.86, y = 3.0, bw = 2.17, gap = 0.28;
    steps.forEach((st, i) => {
      const x = x0 + i * (bw + gap);
      const isLast = i === steps.length - 1;
      node(s, `${st[0]}\n${st[1]}`, x, y, bw, 1.05, {
        fill: isLast ? "123F21" : C.panel2,
        line: isLast ? C.green : C.line,
        accent: isLast ? C.green : undefined,
        fontSize: isLast ? 15 : 13.2,
      });
      if (i < steps.length - 1) {
        s.addShape("line", { x: x + bw + 0.02, y: y + 0.53, w: gap - 0.04, h: 0, line: { color: C.green, transparency: 15, pt: 1.4, endArrowType: "triangle" } });
      }
    });
    panel(s, 1.04, 5.12, 11.2, 0.58, { transparency: 24, lineTransparency: 75 });
    txt(s, "Energy Management → Power Systems & Services → ETO → Universal Enclosures → UE Labs", 1.28, 5.32, 10.72, 0.18, {
      fontSize: 13,
      color: C.muted,
      align: "center",
    });
    footer(s, 3);
    addNotes(s, "Source facts preserved: UNIVERSAL ENCLOSURES LoB is inside Energy Management Business, Power Systems & services Division, and ETO (Engineering To Order) LoB. UE Labs is shown as the highlighted final destination in the rebuilt pathway.");
  }

  // 4. Governance
  {
    const s = pptx.addSlide();
    addBg(s, 1);
    title(s, "Operating model", "UE Labs governance model", "Universal Enclosures Lab sits inside Customer Satisfaction & Quality Department.");
    node(s, "CS&Q Director", 4.82, 1.72, 3.7, 0.78, { fill: "123F21", line: C.green, accent: C.green, fontSize: 20 });
    txt(s, "Leads UE labs directly and also leads the Quality Director function for the labs.", 4.36, 2.68, 4.65, 0.38, { fontSize: 12.8, color: C.muted, align: "center" });
    node(s, "Customer Satisfaction & Quality Department", 0.92, 3.2, 3.5, 0.76, { fontSize: 14, accent: C.green });
    node(s, "Quality Director function for labs", 8.94, 3.2, 3.48, 0.76, { fontSize: 14, accent: C.green });
    panel(s, 5.06, 3.42, 3.18, 0.9, { transparency: 18, line: C.green, lineTransparency: 18 });
    txt(s, "Test & Expert Leader", 5.27, 3.61, 2.78, 0.26, { fontSize: 16.5, bold: true, color: C.green, align: "center" });
    txt(s, "Internal name for the labs Technical Director", 5.26, 3.92, 2.8, 0.2, { fontSize: 9.6, color: C.muted, align: "center" });
    s.addShape("line", { x: 6.67, y: 2.52, w: 0, h: 0.86, line: { color: C.green, pt: 1.4 } });
    s.addShape("line", { x: 4.42, y: 3.58, w: 0.62, h: 0, line: { color: C.line2, pt: 1.2 } });
    s.addShape("line", { x: 8.26, y: 3.58, w: 0.62, h: 0, line: { color: C.line2, pt: 1.2 } });
    const labs = [
      ["SU", "Sarre-Union Lab", "France", C.blue],
      ["ML", "Molins de Rei Lab", "Spain", C.orange],
      ["KP", "Capellades Lab", "Spain", C.red],
    ];
    labs.forEach((lab, i) => {
      const x = 1.22 + i * 4.05;
      labBadge(s, lab[0], lab[1], lab[2], x, 5.28, lab[3]);
      s.addShape("line", { x: 6.67, y: 4.32, w: x - 6.36 + 0.31, h: 1.28, line: { color: C.green, transparency: 30, pt: 0.9 } });
    });
    footer(s, 4);
    addNotes(s, "Source facts preserved: Universal Enclosures Lab is inside Customer Satisfaction & Quality Department. Lab is led directly by the CS&Q Director. CS&Q Director is leading directly UE labs and as well as the function of Quality Director for the labs. The Technical Director for labs is what we call internally “Test & Expert Leader”.");
  }

  // 5. Mission
  {
    const s = pptx.addSlide();
    addBg(s, 0);
    title(s, "Mission", "Mission", "Seven operating responsibilities rebuilt as a validation value chain.");
    const missions = [
      ["01", "Assure the quality of the standard of production"],
      ["02", "Ensure qualification of product evolutions or new products launch"],
      ["03", "Ensure certifications tests, including 1 UL accredited Lab"],
      ["04", "Validate P&S specific solutions"],
      ["05", "Analyse returns, RTA and TEX"],
      ["06", "Give support to the Customer Technical Support team"],
      ["07", "Manage the calibration of labs & plants equipment"],
    ];
    missions.forEach((m, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = 0.9 + col * 6.0;
      const y = 1.82 + row * 1.16;
      panel(s, x, y, 5.35, 0.82, { transparency: 12, lineTransparency: 56 });
      txt(s, m[0], x + 0.2, y + 0.18, 0.48, 0.26, { fontSize: 13, bold: true, color: C.green, align: "center" });
      s.addShape("line", { x: x + 0.82, y: y + 0.18, w: 0, h: 0.46, line: { color: C.green, transparency: 35, pt: 1 } });
      txt(s, m[1], x + 1.02, y + 0.15, 4.08, 0.36, { fontSize: 12.5, bold: true, color: C.text, fit: "shrink" });
    });
    panel(s, 4.18, 6.18, 4.92, 0.42, { transparency: 40, line: C.green, lineTransparency: 60 });
    txt(s, "UE Labs connects production quality, certification readiness and product validation.", 4.44, 6.31, 4.4, 0.12, { fontSize: 9.2, color: C.muted, align: "center" });
    footer(s, 5);
    addNotes(s, "Original mission bullets preserved: Assure the quality of the standard of production; Ensure qualification of product evolutions or new products launch; Ensure certifications tests (1 UL accredited Lab); Validate P&S specific solutions; Analyse returns (RTA and TEX); Give support to the Customer Technical Support team; Manage the calibration of labs & plants equipment.");
  }

  // 6. Three-lab network
  {
    const s = pptx.addSlide();
    addBg(s, 1);
    title(s, "Lab network", "Three-lab network", "UE Labs network: SU, ML and KP across France and Spain.");
    s.addImage({ path: path.join(PROCESSED, "ue_labs_network_map.svg"), x: 0.56, y: 1.35, w: 7.0, h: 4.5 });
    txt(s, "Local labs, shared validation network", 7.85, 1.72, 4.25, 0.54, { fontSize: 25, bold: true, fontFace: F.title, fit: "shrink" });
    labBadge(s, "SU", "Sarre-Union Lab", "France", 8.02, 2.75, C.blue);
    labBadge(s, "ML", "Molins de Rei Lab", "Spain", 8.02, 3.75, C.orange);
    labBadge(s, "KP", "Capellades Lab", "Spain", 8.02, 4.75, C.red);
    panel(s, 8.04, 5.88, 3.85, 0.54, { transparency: 25, lineTransparency: 75 });
    txt(s, "UE Labs network: SU / ML / KP", 8.32, 6.05, 3.28, 0.16, { fontSize: 10.5, color: C.muted, align: "center" });
    footer(s, 6);
    addNotes(s, "Source facts preserved: SU: Sarre-Union Lab (France); ML: Molins de Rei Lab (Spain); KP: Capellades Lab (Spain).");
  }

  // 7. Capellades
  {
    const s = pptx.addSlide();
    addPhotoBg(s, "capellades_hero.jpg");
    label(s, "KP | Spain", 0.78, 0.66, 2.2);
    txt(s, "Capellades\nLab", 0.78, 1.1, 3.5, 1.08, { fontSize: 36, fontFace: F.title, bold: true, fit: "shrink" });
    panel(s, 0.78, 2.68, 3.72, 0.56, { transparency: 14, line: C.green, lineTransparency: 32 });
    txt(s, "UL CTDP since 1999", 1.02, 2.84, 3.2, 0.16, { fontSize: 14, bold: true });
    panel(s, 0.78, 3.48, 3.72, 0.56, { transparency: 22, lineTransparency: 60 });
    txt(s, "File number DA307", 1.02, 3.64, 3.2, 0.16, { fontSize: 14, bold: true, color: C.green });
    txt(s, "Tests according to UL Standard can be performed with total autonomy and direct recognition of Underwriters Laboratories Inc.", 0.82, 4.48, 3.5, 0.74, { fontSize: 12.2, color: C.muted, fit: "shrink" });
    s.addImage({ path: path.join(PROCESSED, "ul_certificate.png"), x: 10.78, y: 0.72, w: 1.5, h: 1.12 });
    footer(s, 7);
    addNotes(s, "Source facts preserved: Capellades Lab; Spain; UL CTDP since 1999; File number DA307; tests according to UL Standard can be performed with total autonomy and direct recognition of Underwriters Laboratories Inc.");
  }

  // 8. Sarre-Union
  {
    const s = pptx.addSlide();
    addPhotoBg(s, "sarre_hero.jpg");
    label(s, "SU | France", 0.78, 0.66, 2.2);
    txt(s, "Sarre-Union\nLab", 0.78, 1.1, 3.7, 1.08, { fontSize: 36, fontFace: F.title, bold: true, fit: "shrink" });
    panel(s, 0.78, 2.74, 3.72, 0.6, { transparency: 18, line: C.blue, lineTransparency: 25 });
    txt(s, "Part of UE Labs network", 1.02, 2.93, 3.24, 0.16, { fontSize: 14, bold: true });
    labBadge(s, "SU", "Sarre-Union Lab", "France", 0.82, 4.12, C.blue);
    footer(s, 8);
    addNotes(s, "Source facts preserved: Sarre-Union Lab; France; part of UE Labs network.");
  }

  // 9. Molins de Rei
  {
    const s = pptx.addSlide();
    addPhotoBg(s, "molins_hero.jpg");
    label(s, "ML | Spain", 0.78, 0.66, 2.2);
    txt(s, "Molins de Rei\nLab", 0.78, 1.1, 3.8, 1.08, { fontSize: 35, fontFace: F.title, bold: true, fit: "shrink" });
    panel(s, 0.78, 2.74, 3.72, 0.6, { transparency: 18, line: C.orange, lineTransparency: 25 });
    txt(s, "Part of UE Labs network", 1.02, 2.93, 3.24, 0.16, { fontSize: 14, bold: true });
    labBadge(s, "ML", "Molins de Rei Lab", "Spain", 0.82, 4.12, C.orange);
    footer(s, 9);
    addNotes(s, "Source facts preserved: Molins de Rei Lab; Spain; part of UE Labs network.");
  }

  // 10. Standards
  {
    const s = pptx.addSlide();
    addBg(s, 0);
    title(s, "Certification scope", "Standards & certification scope", "Original standards rebuilt as a capability matrix by lab.");
    panel(s, 0.72, 1.72, 3.35, 4.62, { transparency: 17, line: C.green, lineTransparency: 42 });
    s.addImage({ path: path.join(PROCESSED, "ul_certificate.png"), x: 0.96, y: 1.98, w: 1.2, h: 0.9 });
    txt(s, "Capellades Lab is CTDP by UL since 1999, File number DA307.", 0.96, 3.12, 2.8, 0.42, { fontSize: 12.2, bold: true, fit: "shrink" });
    txt(s, "Tests according to UL Standard can be performed with total autonomy and direct recognition of Underwriters Laboratories Inc.", 0.96, 3.74, 2.78, 0.8, { fontSize: 11, color: C.muted, fit: "shrink" });
    txt(s, "UL / CSA recognition remains attached to KP in the matrix.", 0.96, 5.62, 2.72, 0.26, { fontSize: 10.2, color: C.green, fit: "shrink" });

    const mx = 4.38, my = 1.72, colW = 2.5, rowH = 0.97;
    const labs = [
      ["SU", "Sarre-Union", C.blue],
      ["ML", "Molins de Rei", C.orange],
      ["KP", "Capellades", C.red],
    ];
    labs.forEach((lab, i) => {
      const x = mx + i * (colW + 0.18);
      panel(s, x, my, colW, 0.58, { color: C.panel2, line: lab[2], lineTransparency: 15, transparency: 10 });
      txt(s, lab[0], x + 0.14, my + 0.12, 0.45, 0.18, { fontSize: 12.5, bold: true, color: lab[2], align: "center" });
      txt(s, lab[1], x + 0.66, my + 0.12, colW - 0.84, 0.18, { fontSize: 10.8, bold: true });
    });
    const families = [
      ["IEC", ["IEC 62208", "IEC 60079-0", "IEC 61439-1", "IEC 61439-5"]],
      ["ISO", ["ISO 12944-6", "ISO 4624"]],
      ["EN", ["EN 61386-1"]],
      ["UL / CSA", ["UL 50 / CSA C22.2 Nº 94.1", "UL 50E / CSA C22.2 Nº 94.2", "UL 746 C"]],
    ];
    families.forEach((fam, r) => {
      const y = my + 0.8 + r * rowH;
      txt(s, fam[0], 4.0, y + 0.26, 0.35, 0.18, { fontSize: 8.8, bold: true, color: C.green, align: "right" });
      labs.forEach((lab, i) => {
        const x = mx + i * (colW + 0.18);
        panel(s, x, y, colW, rowH - 0.08, { transparency: 32, lineTransparency: 82 });
        const labStandards = standardsByLab[lab[0]].filter((std) => fam[1].includes(std));
        labStandards.forEach((std, j) => {
          chip(s, std, x + 0.14, y + 0.13 + j * 0.31, colW - 0.28, lab[2]);
        });
      });
    });
    footer(s, 10);
    addNotes(s, `Original standard descriptions preserved:\n${Object.entries(standardDescriptions).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nLab grouping follows the three source standards blocks from the original slide: SU top block, ML right block, KP left block with UL CTDP note.`);
  }

  // 11. Products tested
  {
    const s = pptx.addSlide();
    addBg(s, 1);
    title(s, "Products tested", "Products tested", "Types of Products Tested: Spacial, Thalassa and ClimaSys portfolios.");
    s.addImage({ path: path.join(PROCESSED, "product_portfolio_hero.jpg"), x: 7.03, y: 1.25, w: 5.5, h: 3.1 });
    s.addShape("rect", { x: 7.03, y: 1.25, w: 5.5, h: 3.1, fill: { color: C.black, transparency: 62 }, line: { color: C.line, transparency: 50 } });
    const cards = [
      ["Spacial", "Steel and stainless steel", "product_spacial.png", C.green],
      ["Thalassa", "Plastic and glass-reinforced polyester", "product_thalassa.png", C.blue],
      ["ClimaSys", "Thermal management systems", "product_climasys.png", C.orange],
    ];
    cards.forEach((card, i) => {
      const x = 0.82 + i * 4.12;
      panel(s, x, 4.84, 3.62, 1.25, { transparency: 11, line: card[3], lineTransparency: 38 });
      s.addImage({ path: path.join(PROCESSED, card[2]), x: x + 0.14, y: 5.05, w: 1.35, h: 0.76 });
      txt(s, card[0], x + 1.66, 5.04, 1.6, 0.26, { fontSize: 15.8, bold: true, color: C.text });
      txt(s, card[1], x + 1.66, 5.39, 1.72, 0.3, { fontSize: 9.8, color: C.muted, fit: "shrink" });
    });
    footer(s, 11);
    addNotes(s, "Source facts preserved: Spacial - Steel and stainless steel; Thalassa - Plastic and glass-reinforced polyester; ClimaSys - Thermal management systems; Types of Products Tested.");
  }

  // 12. Product families / environments
  {
    const s = pptx.addSlide();
    s.addImage({ path: path.join(PROCESSED, "environment_technical_field.svg"), x: 0, y: 0, w: W, h: H });
    s.addImage({ path: path.join(PROCESSED, "product_portfolio_hero.jpg"), x: 8.15, y: 0.98, w: 4.26, h: 2.4 });
    s.addShape("rect", { x: 8.15, y: 0.98, w: 4.26, h: 2.4, fill: { color: C.black, transparency: 45 }, line: { color: C.line, transparency: 55 } });
    title(s, "Environments", "Product families / environments", "");
    txt(s, "Spacial, Thalassa and ClimaSys enclosures and thermal management solutions are the world’s best choice for equipment protection in any type of environment.", 0.82, 1.72, 6.5, 1.14, {
      fontFace: F.title,
      fontSize: 24,
      bold: true,
      fit: "shrink",
    });
    const themes = [
      ["Industrial protection", "Protection for equipment in demanding industrial settings"],
      ["Material resistance", "Steel, stainless steel, plastic and glass-reinforced polyester"],
      ["Thermal management", "ClimaSys systems for heat and enclosure performance"],
      ["Enclosure reliability", "Validation focus across environments and use cases"],
    ];
    themes.forEach((t, i) => {
      const x = 0.86 + (i % 2) * 3.64;
      const y = 4.22 + Math.floor(i / 2) * 0.95;
      panel(s, x, y, 3.14, 0.67, { transparency: 28, lineTransparency: 70 });
      txt(s, t[0], x + 0.17, y + 0.13, 2.72, 0.16, { fontSize: 12.4, bold: true, color: C.green });
      txt(s, t[1], x + 0.17, y + 0.37, 2.75, 0.12, { fontSize: 7.9, color: C.muted, fit: "shrink" });
    });
    footer(s, 12);
    addNotes(s, "Source fact preserved: Spacial, Thalassa and ClimaSys enclosures and thermal management solutions are the world’s best choice for equipment protection in any type of environment.");
  }

  // 13. Closing
  {
    const s = pptx.addSlide();
    addBg(s, 1);
    s.addImage({ path: path.join(PROCESSED, "environment_technical_field.svg"), x: 0, y: 0, w: W, h: H });
    s.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: C.black, transparency: 28 }, line: { color: C.black, transparency: 100 } });
    logo(s, 10.75, 0.65, 1.45, "green");
    txt(s, "UE LABS", 0.86, 2.62, 5.4, 0.74, { fontFace: F.title, fontSize: 48, bold: true });
    s.addShape("line", { x: 0.9, y: 3.56, w: 2.4, h: 0, line: { color: C.green, pt: 2 } });
    txt(s, "Testing confidence. Certification readiness. Product quality.", 0.92, 3.94, 6.2, 0.38, { fontSize: 18, color: C.muted });
    footer(s, 13);
    addNotes(s, "Closing slide rebuilt from blank source slide using required UE LABS closing line.");
  }

  return pptx;
}

function writeDesignSystem() {
  const designSystem = {
    brandDirection: "Schneider Electric-inspired premium industrial technology keynote",
    colorPalette: {
      primaryAccent: `#${C.green}`,
      background: `#${C.bg}`,
      secondaryBackground: `#${C.bg2}`,
      textPrimary: `#${C.text}`,
      textSecondary: `#${C.muted}`,
      mutedLines: `#${C.line}`,
      supportingLabColors: {
        SU: `#${C.blue}`,
        ML: `#${C.orange}`,
        KP: `#${C.red}`,
      },
    },
    typography: {
      titleFont: F.title,
      bodyFont: F.body,
      titleRangePt: "34-54",
      sectionTitleRangePt: "30-38",
      bodyMinimumPt: 18,
      smallLabelMinimumPt: "12-14 for main content; footer intentionally smaller",
    },
    layout: {
      format: "16:9 widescreen",
      sizeInches: { width: W, height: H },
      grid: "0.68 in outer margin, 12-column composition, consistent footer rail",
      footer: "Subtle copyright/confidentiality marking with page number",
    },
    visualLanguage: [
      "dark graphite backgrounds",
      "Schneider Electric green accents used sparingly",
      "technical linework and network motifs",
      "map-based lab network",
      "native PowerPoint hierarchy diagrams",
      "photo overlays with consistent dark grading",
      "standards capability matrix",
    ],
    assetTreatment: {
      photos: "cropped to 16:9, contrast graded, dark overlay in PowerPoint",
      diagrams: "redrawn as native shapes or SVG technical visuals",
      logos: "official extracted Schneider Electric assets only",
    },
  };
  fs.writeFileSync(path.join(DIST, "design-system.json"), JSON.stringify(designSystem, null, 2));
}

async function main() {
  await prepareAssets();
  writeDesignSystem();
  const pptx = buildSlides();
  await pptx.writeFile({ fileName: OUT });
  console.log(`Wrote ${OUT}`);
  console.log(`Wrote ${path.join(DIST, "design-system.json")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

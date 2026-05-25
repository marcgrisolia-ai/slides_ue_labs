#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const DEFAULT_ARTIFACT_TOOL_DIR =
  "/Users/marcrodriguez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool";
const ARTIFACT_TOOL_DIR = process.env.ARTIFACT_TOOL_DIR || DEFAULT_ARTIFACT_TOOL_DIR;
const ARTIFACT_TOOL_MODULE = path.join(ARTIFACT_TOOL_DIR, "dist", "artifact_tool.mjs");

const POINTS_PER_INCH = 72;
const PIXELS_PER_INCH = 96;
const PAGE_W_POINTS = 595.2755905511812;
const PAGE_H_POINTS = 841.8897637795277;
const PAGE_W = (PAGE_W_POINTS / POINTS_PER_INCH) * PIXELS_PER_INCH;
const PAGE_H = (PAGE_H_POINTS / POINTS_PER_INCH) * PIXELS_PER_INCH;

const RENDERED_DIR = path.join(REPO_ROOT, "tmp", "pdfs", "certifications-guide", "rendered");
const SOURCE_PDF = path.join(REPO_ROOT, "output", "pdf", "universal_enclosures_certifications_guide.pdf");
const OUTPUT_DIR = path.join(REPO_ROOT, "output", "editable");
const OUTPUT_PPTX = path.join(OUTPUT_DIR, "universal_enclosures_certifications_guide_canva_handoff_a4.pptx");
const REPORT_PATH = path.join(REPO_ROOT, "reports", "certifications-editable-pptx-report.json");

function naturalPageSort(a, b) {
  const pageA = Number(path.basename(a).match(/page-(\d+)/)?.[1] || 0);
  const pageB = Number(path.basename(b).match(/page-(\d+)/)?.[1] || 0);
  return pageA - pageB;
}

function assertFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} not found: ${filePath}`);
  }
}

assertFile(ARTIFACT_TOOL_MODULE, "artifact-tool module");
assertFile(SOURCE_PDF, "source PDF");

const renderedPages = fs
  .readdirSync(RENDERED_DIR)
  .filter((name) => /^page-\d+\.png$/.test(name))
  .map((name) => path.join(RENDERED_DIR, name))
  .sort(naturalPageSort);

if (renderedPages.length === 0) {
  throw new Error(`No rendered PDF pages found in ${RENDERED_DIR}. Render the PDF with pdftoppm first.`);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

const { Presentation, PresentationFile } = await import(pathToFileURL(ARTIFACT_TOOL_MODULE).href);
const presentation = Presentation.create();

for (const [index, pagePath] of renderedPages.entries()) {
  const pageNo = index + 1;
  const slide = presentation.slides.add({ width: PAGE_W, height: PAGE_H });
  const image = slide.images.add({
    data: fs.readFileSync(pagePath),
    contentType: "image/png",
    alt: `Rendered Universal Enclosures certifications PDF page ${pageNo}`,
    position: { left: 0, top: 0, width: PAGE_W, height: PAGE_H },
    fit: "contain"
  });
  image.name = `PDF reference page ${String(pageNo).padStart(2, "0")}`;
}

const blob = await PresentationFile.exportPptx(presentation);
await blob.save(OUTPUT_PPTX);

const report = {
  output: OUTPUT_PPTX,
  sourcePdf: SOURCE_PDF,
  renderedPages: renderedPages.length,
  slideSize: {
    format: "A4 portrait",
    widthPoints: PAGE_W_POINTS,
    heightPoints: PAGE_H_POINTS,
    widthPixelsAt96Dpi: PAGE_W,
    heightPixelsAt96Dpi: PAGE_H
  },
  engine: "artifact-tool",
  intendedUse: "Canva / PowerPoint visual handoff for page-level review and annotation.",
  limitation: "The canonical source for precise element movement is reports/certifications-pdf-layout-overrides.json; this PPTX preserves each finished PDF page as one embedded reference image."
};

fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));

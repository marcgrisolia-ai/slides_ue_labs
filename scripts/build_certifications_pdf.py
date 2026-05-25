#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from pathlib import Path
from typing import Any

from PIL import Image, ImageOps
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MODEL = REPO_ROOT / "reports" / "certifications-pdf-content-model.json"
DEFAULT_OUTPUT = REPO_ROOT / "output" / "pdf" / "universal_enclosures_certifications_guide.pdf"
DEFAULT_CACHE = REPO_ROOT / "tmp" / "pdfs" / "certifications-guide" / "image-cache"
DEFAULT_REPORT = REPO_ROOT / "reports" / "certifications-pdf-build-report.json"
DEFAULT_LAYOUT = REPO_ROOT / "reports" / "certifications-pdf-layout-overrides.json"
BODY_LOGO_OVERRIDES = {
    "lcie": REPO_ROOT / "assets" / "processed" / "certification_logos" / "lcie_logo.png",
    "dekra": REPO_ROOT / "assets" / "processed" / "certification_logos" / "dekra_logo.png",
    "tuv-rheinland": REPO_ROOT / "assets" / "processed" / "certification_logos" / "tuv_rheinland_logo_padded.png",
}
TEXT_REFERENCE_STANDARD_GROUPS = {"directive", "certified-bodies"}

PAGE_W, PAGE_H = A4
MARGIN_X = 42
TOP_Y = PAGE_H - 46
BOTTOM_Y = 58
FOOTER_Y = 28
CONTENT_W = PAGE_W - (MARGIN_X * 2)

FONT = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
FONT_OBLIQUE = "Helvetica-Oblique"

SCHNEIDER_GREEN = colors.HexColor("#009530")
BLACK = colors.HexColor("#161616")
DARK = colors.HexColor("#3A3A3A")
MID = colors.HexColor("#777777")
RULE = colors.HexColor("#D9D9D9")
LIGHT_RULE = colors.HexColor("#EAEAEA")
PALE = colors.HexColor("#F7F7F7")
WHITE = colors.white


TEXT_REPLACEMENTS = {
    "\u2010": "-",
    "\u2011": "-",
    "\u2012": "-",
    "\u2013": "-",
    "\u2014": "-",
    "\u2018": "'",
    "\u2019": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u00a0": " ",
}


def clean_text(value: Any) -> str:
    text = "" if value is None else str(value)
    for before, after in TEXT_REPLACEMENTS.items():
        text = text.replace(before, after)
    return re.sub(r"\s+", " ", text).strip()


def hex_color(value: str | None, fallback: colors.Color = DARK) -> colors.Color:
    if not value:
        return fallback
    try:
        return colors.HexColor(value)
    except Exception:
        return fallback


class CertificationsGuide:
    def __init__(
        self,
        model: dict[str, Any],
        output: Path,
        cache_dir: Path,
        *,
        layout: dict[str, Any] | None = None,
        layout_source: Path | None = None,
    ) -> None:
        self.model = model
        self.output = output
        self.cache_dir = cache_dir
        self.layout = layout or {}
        self.layout_source = layout_source
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.output.parent.mkdir(parents=True, exist_ok=True)
        self.c = canvas.Canvas(str(output), pagesize=A4)
        self.c.setTitle(clean_text(model["document"]["title"]))
        self.c.setAuthor("Schneider Electric Universal Enclosures Laboratories")
        self.page_no = 0
        self.y = TOP_Y
        self.current_section = ""
        self.render_warnings: list[str] = []
        self.converted_assets: list[dict[str, Any]] = []
        self.badges_used: list[str] = []
        self.logo_overrides_used: set[str] = set()
        self.schneider_logo = REPO_ROOT / "assets" / "processed" / "schneider_logo_green.png"

    def layout_get(self, dotted_path: str, fallback: Any) -> Any:
        current: Any = self.layout
        for part in dotted_path.split("."):
            if not isinstance(current, dict) or part not in current:
                return fallback
            current = current[part]
        return fallback if current is None else current

    def element_override(self, *parts: str) -> dict[str, Any]:
        current: Any = self.layout.get("elementOverrides", {})
        for part in parts:
            if not isinstance(current, dict) or part not in current:
                return {}
            current = current[part]
        return current if isinstance(current, dict) else {}

    def save(self) -> None:
        self.draw_footer()
        self.c.save()

    def start_page(self, section_title: str, *, cover: bool = False) -> None:
        if self.page_no:
            self.draw_footer()
            self.c.showPage()
        self.page_no += 1
        self.current_section = section_title
        self.y = TOP_Y
        if cover:
            return

        self.c.setStrokeColor(RULE)
        self.c.setLineWidth(0.6)
        self.c.line(MARGIN_X, PAGE_H - 72, PAGE_W - MARGIN_X, PAGE_H - 72)
        self.set_font(FONT_BOLD, 8, SCHNEIDER_GREEN)
        self.c.drawString(MARGIN_X, PAGE_H - 44, "Universal Enclosures")
        self.set_font(FONT_BOLD, 15, BLACK)
        self.c.drawString(MARGIN_X, PAGE_H - 62, clean_text(section_title))
        if self.schneider_logo.exists():
            logo_w = self.layout_get("global.headerLogoBox.width", 78)
            logo_h = self.layout_get("global.headerLogoBox.height", 22)
            self.draw_image_fit(self.schneider_logo, PAGE_W - MARGIN_X - logo_w, PAGE_H - 61, logo_w, logo_h)
        self.y = PAGE_H - 94

    def draw_footer(self) -> None:
        self.c.setStrokeColor(LIGHT_RULE)
        self.c.setLineWidth(0.5)
        self.c.line(MARGIN_X, FOOTER_Y + 13, PAGE_W - MARGIN_X, FOOTER_Y + 13)
        self.set_font(FONT, 6.8, MID)
        footer = clean_text(self.model["document"]["footer"])
        self.c.drawString(MARGIN_X, FOOTER_Y, footer)
        self.c.drawRightString(PAGE_W - MARGIN_X, FOOTER_Y, str(self.page_no))

    def set_font(self, font: str, size: float, color: colors.Color = BLACK) -> None:
        self.c.setFont(font, size)
        self.c.setFillColor(color)

    def ensure_space(self, needed: float, section_title: str | None = None) -> None:
        if self.y - needed < BOTTOM_Y:
            self.start_page(section_title or self.current_section)

    def wrap_text(self, text: Any, width: float, font: str, size: float) -> list[str]:
        text = clean_text(text)
        if not text:
            return []
        words = text.split(" ")
        lines: list[str] = []
        line = ""
        for word in words:
            candidate = word if not line else f"{line} {word}"
            if self.c.stringWidth(candidate, font, size) <= width:
                line = candidate
                continue
            if line:
                lines.append(line)
                line = word
            else:
                lines.extend(self.break_long_word(word, width, font, size))
                line = ""
        if line:
            lines.append(line)
        return lines

    def break_long_word(self, word: str, width: float, font: str, size: float) -> list[str]:
        chunks: list[str] = []
        current = ""
        for char in word:
            candidate = current + char
            if self.c.stringWidth(candidate, font, size) <= width:
                current = candidate
            else:
                if current:
                    chunks.append(current)
                current = char
        if current:
            chunks.append(current)
        return chunks

    def draw_wrapped(
        self,
        text: Any,
        x: float,
        y: float,
        width: float,
        *,
        font: str = FONT,
        size: float = 8.5,
        leading: float = 10.5,
        color: colors.Color = BLACK,
        max_lines: int | None = None,
    ) -> float:
        lines = self.wrap_text(text, width, font, size)
        if max_lines is not None and len(lines) > max_lines:
            lines = lines[:max_lines]
            if lines:
                while self.c.stringWidth(lines[-1] + "...", font, size) > width and len(lines[-1]) > 1:
                    lines[-1] = lines[-1][:-1]
                lines[-1] = lines[-1].rstrip() + "..."
        self.set_font(font, size, color)
        for line in lines:
            self.c.drawString(x, y, line)
            y -= leading
        return y

    def prepare_image(self, source: Path) -> Path | None:
        if not source.exists():
            self.render_warnings.append(f"Missing image: {source}")
            return None
        try:
            stat = source.stat()
            digest = hashlib.sha1(f"{source}:{stat.st_size}:{stat.st_mtime_ns}".encode("utf-8")).hexdigest()[:16]
            target = self.cache_dir / f"{source.stem}-{digest}.png"
            if target.exists():
                return target
            with Image.open(source) as image:
                image = ImageOps.exif_transpose(image)
                if image.mode not in ("RGBA", "RGB"):
                    image = image.convert("RGBA")
                image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
                if image.mode == "RGBA":
                    background = Image.new("RGBA", image.size, (255, 255, 255, 255))
                    background.alpha_composite(image)
                    image = background.convert("RGB")
                else:
                    image = image.convert("RGB")
                image.save(target, "PNG", optimize=True)
            self.converted_assets.append({"source": str(source), "cache": str(target)})
            return target
        except Exception as exc:
            self.render_warnings.append(f"Could not prepare image {source}: {exc}")
            return None

    def draw_image_fit(self, source: Path, x: float, top_y: float, width: float, height: float) -> bool:
        prepared = self.prepare_image(source)
        if prepared is None:
            self.draw_image_placeholder(x, top_y, width, height)
            return False
        try:
            with Image.open(prepared) as image:
                iw, ih = image.size
            scale = min(width / iw, height / ih)
            draw_w = iw * scale
            draw_h = ih * scale
            draw_x = x + (width - draw_w) / 2
            draw_y = top_y - height + (height - draw_h) / 2
            self.c.drawImage(ImageReader(str(prepared)), draw_x, draw_y, draw_w, draw_h, mask="auto")
            return True
        except Exception as exc:
            self.render_warnings.append(f"Could not draw image {source}: {exc}")
            self.draw_image_placeholder(x, top_y, width, height)
            return False

    def draw_logo_fit(self, source: Path, x: float, top_y: float, width: float, height: float) -> bool:
        inset_ratio = float(self.layout_get("global.logoFitInsetRatio", 0.04))
        inset_x = width * inset_ratio
        inset_y = height * inset_ratio
        return self.draw_image_fit(source, x + inset_x, top_y - inset_y, width - inset_x * 2, height - inset_y * 2)

    def draw_image_placeholder(self, x: float, top_y: float, width: float, height: float) -> None:
        self.c.setFillColor(PALE)
        self.c.rect(x, top_y - height, width, height, fill=1, stroke=0)
        self.c.setStrokeColor(RULE)
        self.c.rect(x, top_y - height, width, height, fill=0, stroke=1)
        self.set_font(FONT, 6.5, MID)
        self.c.drawCentredString(x + width / 2, top_y - height / 2 - 2, "Image")

    def draw_badge(
        self,
        label: Any,
        x: float,
        y: float,
        *,
        width: float | None = None,
        color: colors.Color = DARK,
        fill: colors.Color = WHITE,
        font_size: float = 7.5,
    ) -> float:
        label = clean_text(label)
        pad_x = 6
        badge_w = width or max(32, self.c.stringWidth(label, FONT_BOLD, font_size) + pad_x * 2)
        badge_h = 14
        self.c.setFillColor(fill)
        self.c.setStrokeColor(color)
        self.c.setLineWidth(0.6)
        self.c.roundRect(x, y - badge_h + 3, badge_w, badge_h, 3, fill=1, stroke=1)
        self.set_font(FONT_BOLD, font_size, color)
        self.c.drawCentredString(x + badge_w / 2, y - 7.2, label)
        self.badges_used.append(label)
        return badge_w

    def draw_body_label(self, body: dict[str, Any], x: float, y: float, width: float) -> None:
        logo_path = self.body_logo_path(body)
        if logo_path:
            logo_w = self.layout_get("global.productSheets.certBodyLogoWidth", 22)
            logo_h = self.layout_get("global.productSheets.certBodyLogoHeight", 13)
            self.draw_logo_fit(logo_path, x, y + 5, logo_w, logo_h)
            text_x = x + logo_w + 5
        else:
            color = hex_color(body.get("color"))
            self.c.setFillColor(color)
            self.c.circle(x + 3, y - 3, 3, fill=1, stroke=0)
            text_x = x + 11
        self.draw_wrapped(body.get("name", ""), text_x, y, width - (text_x - x), size=7.2, leading=8.4, max_lines=2)

    def body_logo_path(self, body: dict[str, Any]) -> Path | None:
        body_id = body.get("id")
        override = BODY_LOGO_OVERRIDES.get(body_id)
        if override and override.exists():
            self.logo_overrides_used.add(body_id)
            return override
        logo = body.get("logo", {})
        if logo.get("exists") and logo.get("absolutePath"):
            path = Path(logo["absolutePath"])
            if path.exists():
                return path
        return None

    def draw_body_logo(self, body: dict[str, Any], x: float, top_y: float, width: float, height: float) -> bool:
        logo_path = self.body_logo_path(body)
        if logo_path:
            return self.draw_logo_fit(logo_path, x, top_y, width, height)
        self.draw_badge(self.short_body_label(body.get("name", body.get("id", ""))), x, top_y - 4, width=width, color=hex_color(body.get("color")), font_size=5.4)
        return False

    def draw_body_logo_adjusted(
        self,
        body: dict[str, Any],
        x: float,
        top_y: float,
        width: float,
        height: float,
        context: str,
    ) -> bool:
        override = self.element_override("bodyLogo", clean_text(body.get("id")), context)
        dx = float(override.get("dx", 0) or 0)
        dy = float(override.get("dy", 0) or 0)
        scale = float(override.get("scale", 1) or 1)
        scaled_w = width * scale
        scaled_h = height * scale
        adjusted_x = x + dx - (scaled_w - width) / 2
        adjusted_top_y = top_y + dy + (scaled_h - height) / 2
        return self.draw_body_logo(body, adjusted_x, adjusted_top_y, scaled_w, scaled_h)

    def resolved_body_treatment(self, body: dict[str, Any]) -> str:
        return "Use normalized logo." if self.body_logo_path(body) else clean_text(body.get("pdfTreatment", "Use compact text badge."))


    def short_body_label(self, name: str) -> str:
        name = clean_text(name)
        if name == "Bureau Veritas":
            return "BV"
        if name == "Bureau Veritas Marine Division":
            return "BV Marine"
        if name == "Underwriters Laboratories":
            return "UL"
        if name == "TUV Rheinland Group":
            return "TUV"
        return name.split(" ")[0] if len(name) > 11 else name

    def draw_section_intro(self, text: str) -> None:
        self.y = self.draw_wrapped(text, MARGIN_X, self.y, CONTENT_W, size=9.2, leading=12, color=DARK)
        self.y -= 12

    def draw_metric_table(self, rows: list[tuple[str, str]], x: float, y: float, width: float) -> float:
        row_h = 24
        label_w = width * 0.68
        self.c.setStrokeColor(RULE)
        self.c.setLineWidth(0.6)
        self.c.rect(x, y - row_h, width, row_h, fill=0, stroke=1)
        self.c.setFillColor(PALE)
        self.c.rect(x, y - row_h, width, row_h, fill=1, stroke=0)
        self.set_font(FONT_BOLD, 8.2, BLACK)
        self.c.drawString(x + 9, y - 15.5, "Metric")
        self.c.drawRightString(x + width - 9, y - 15.5, "Count")
        y -= row_h
        for label, value in rows:
            self.c.setStrokeColor(LIGHT_RULE)
            self.c.line(x, y - row_h, x + width, y - row_h)
            self.set_font(FONT, 8.4, BLACK)
            self.c.drawString(x + 9, y - 15.5, clean_text(label))
            self.set_font(FONT_BOLD, 9, BLACK)
            self.c.drawRightString(x + label_w + (width - label_w) - 9, y - 15.5, clean_text(value))
            y -= row_h
        self.c.setStrokeColor(RULE)
        self.c.rect(x, y, width, row_h * (len(rows) + 1), fill=0, stroke=1)
        return y

    def draw_cover(self) -> None:
        doc = self.model["document"]
        metrics = doc["metrics"]
        self.start_page("Cover", cover=True)
        if self.schneider_logo.exists():
            self.draw_image_fit(self.schneider_logo, PAGE_W - MARGIN_X - 110, PAGE_H - 48, 110, 28)

        self.set_font(FONT_BOLD, 8.8, SCHNEIDER_GREEN)
        self.c.drawCentredString(PAGE_W / 2, PAGE_H - 184, clean_text(doc["copyBlocks"]["coverKicker"]).upper())
        self.set_font(FONT_BOLD, 31, BLACK)
        self.c.drawCentredString(PAGE_W / 2, PAGE_H - 224, clean_text(doc["copyBlocks"]["coverTitle"]))
        self.set_font(FONT, 14, DARK)
        self.c.drawCentredString(PAGE_W / 2, PAGE_H - 249, clean_text(doc["copyBlocks"]["coverSubtitle"]))
        self.set_font(FONT, 8.6, MID)
        self.c.drawCentredString(PAGE_W / 2, PAGE_H - 274, clean_text(doc["copyBlocks"]["coverMeta"]))

        self.c.setStrokeColor(RULE)
        self.c.setLineWidth(0.6)
        self.c.line(PAGE_W / 2 - 92, PAGE_H - 306, PAGE_W / 2 + 92, PAGE_H - 306)

        rows = [
            ("Product/range rows", str(metrics["productRows"])),
            ("Certification entries", str(metrics["certificationEntries"])),
            ("Active certification bodies", str(metrics["activeCertificationBodies"])),
            ("Standard groups", str(metrics["standardGroups"])),
        ]
        table_w = 310
        table_y = PAGE_H - 370
        self.draw_metric_table(rows, (PAGE_W - table_w) / 2, table_y, table_w)

        logo_y = self.layout_get("global.coverBodyLogoRow.topY", 174)
        active_bodies = self.model["activeBodies"]
        logo_w = self.layout_get("global.coverBodyLogoRow.logoWidth", 48)
        logo_h = self.layout_get("global.coverBodyLogoRow.logoHeight", 30)
        gap = self.layout_get("global.coverBodyLogoRow.gap", 10)
        total_w = len(active_bodies) * logo_w + (len(active_bodies) - 1) * gap
        x = (PAGE_W - total_w) / 2
        for body in active_bodies:
            self.draw_body_logo_adjusted(body, x, logo_y, logo_w, logo_h, "cover")
            x += logo_w + gap

        self.set_font(FONT, 7.8, MID)
        self.c.drawCentredString(PAGE_W / 2, 126, "Source: UE 2026 Catalogue, Certifications matrix, page 610.")

    def draw_overview(self) -> None:
        doc = self.model["document"]
        self.start_page("Overview")
        self.draw_section_intro(doc["copyBlocks"]["overviewIntro"])

        metrics = doc["metrics"]
        metric_rows = [
            ("Product/range rows", str(metrics["productRows"])),
            ("Certification entries", str(metrics["certificationEntries"])),
            ("Active certification bodies", str(metrics["activeCertificationBodies"])),
            ("Rows without listed certification", str(metrics["productRowsWithoutListedCertification"])),
        ]
        left_w = self.layout_get("global.overview.leftMetricWidth", 238)
        after_metrics = self.draw_metric_table(metric_rows, MARGIN_X, self.y, left_w)

        family_gap = self.layout_get("global.overview.familyColumnGap", 28)
        count_reserve_w = self.layout_get("global.overview.familyCountReserveWidth", 108)
        x = MARGIN_X + left_w + family_gap
        y = self.y
        self.set_font(FONT_BOLD, 10.5, BLACK)
        self.c.drawString(x, y, "Families")
        y -= 18
        for family in self.model["families"]:
            self.c.setStrokeColor(LIGHT_RULE)
            self.c.line(x, y + 6, PAGE_W - MARGIN_X, y + 6)
            count_text = f"{family['productCount']} products / {family['certificationCount']} entries"
            self.set_font(FONT, 7.8, DARK)
            self.c.drawRightString(PAGE_W - MARGIN_X, y - 3, count_text)
            family_override = self.element_override("overviewFamilies", clean_text(family.get("id")))
            name_x = x + float(family_override.get("dx", 0) or 0)
            name_y_start = y - 3 + float(family_override.get("dy", 0) or 0)
            name_y = self.draw_wrapped(family["name"], name_x, name_y_start, PAGE_W - MARGIN_X - name_x - count_reserve_w, font=FONT_BOLD, size=8.4, leading=9.2, max_lines=2)
            y = min(y - 17, name_y - 3)
            y = self.draw_wrapped(", ".join(family["productCodes"]), x, y, PAGE_W - MARGIN_X - x, size=7.4, leading=8.5, color=MID)
            y -= 11
        self.y = min(after_metrics, y) - 12

        self.ensure_space(150)
        self.set_font(FONT_BOLD, 10.5, BLACK)
        self.c.drawString(MARGIN_X, self.y, "Planned PDF structure")
        self.y -= 18
        for section in doc["sections"]:
            self.c.setStrokeColor(LIGHT_RULE)
            self.c.line(MARGIN_X, self.y + 6, PAGE_W - MARGIN_X, self.y + 6)
            self.set_font(FONT_BOLD, 8.3, BLACK)
            self.c.drawString(MARGIN_X, self.y - 2, clean_text(section["title"]))
            self.set_font(FONT, 7.8, DARK)
            self.c.drawString(MARGIN_X + 142, self.y - 2, clean_text(", ".join(section["content"])))
            self.y -= 19

    def draw_standards(self) -> None:
        self.start_page("Standards referenced")
        self.draw_section_intro(
            "The referenced standards are grouped as in the certification matrix. IEC, UL / CSA, EN and ISO use graphic marks; directive and certified-body requirements are listed separately as matrix references."
        )
        standard_groups = [group for group in self.model["standardGroups"] if group["id"] not in TEXT_REFERENCE_STANDARD_GROUPS]
        reference_groups = [group for group in self.model["standardGroups"] if group["id"] in TEXT_REFERENCE_STANDARD_GROUPS]
        for group in standard_groups:
            standards = group["standards"]
            needed = 56 + len(standards) * 20
            self.ensure_space(needed, "Standards referenced")
            top = self.y
            self.c.setStrokeColor(RULE)
            self.c.line(MARGIN_X, top + 6, PAGE_W - MARGIN_X, top + 6)
            logo_box_w = 68
            if group["logo"]["exists"]:
                self.draw_image_fit(Path(group["logo"]["absolutePath"]), MARGIN_X, top - 3, logo_box_w, 28)
                if group["secondaryLogo"]["exists"]:
                    self.draw_image_fit(Path(group["secondaryLogo"]["absolutePath"]), MARGIN_X + 38, top - 3, logo_box_w - 38, 28)
            else:
                self.draw_badge(group["name"], MARGIN_X, top - 7, width=logo_box_w, color=DARK)
            text_x = MARGIN_X + logo_box_w + 18
            self.set_font(FONT_BOLD, 10.2, BLACK)
            self.c.drawString(text_x, top - 2, clean_text(group["name"]))
            y = top - 20
            for standard in standards:
                code_w = 150
                code_y = self.draw_wrapped(standard["code"], text_x, y, code_w - 8, font=FONT_BOLD, size=7.8, leading=8.8, color=BLACK, max_lines=2)
                title_y = self.draw_wrapped(standard["title"], text_x + code_w, y, PAGE_W - MARGIN_X - (text_x + code_w), size=7.6, leading=8.8, color=DARK, max_lines=3)
                y = min(code_y, title_y)
                y -= 4
            self.y = y - 9

        if reference_groups:
            self.ensure_space(90, "Standards referenced")
            self.set_font(FONT_BOLD, 10.2, BLACK)
            self.c.drawString(MARGIN_X, self.y, "Other matrix references")
            self.y -= 17
            for group in reference_groups:
                for standard in group["standards"]:
                    self.c.setStrokeColor(LIGHT_RULE)
                    self.c.line(MARGIN_X, self.y + 5, PAGE_W - MARGIN_X, self.y + 5)
                    self.set_font(FONT_BOLD, 7.8, BLACK)
                    self.c.drawString(MARGIN_X + 4, self.y - 3, clean_text(group["name"]))
                    code_y = self.draw_wrapped(standard["code"], MARGIN_X + 128, self.y - 3, 150, font=FONT_BOLD, size=7.7, leading=8.5, color=BLACK, max_lines=2)
                    title_y = self.draw_wrapped(standard["title"], MARGIN_X + 292, self.y - 3, PAGE_W - MARGIN_X - (MARGIN_X + 292), size=7.5, leading=8.5, color=DARK, max_lines=3)
                    self.y = min(self.y - 19, code_y - 4, title_y - 4)
            self.y -= 4

    def draw_bodies(self) -> None:
        doc = self.model["document"]
        self.start_page("Certification bodies")
        self.draw_section_intro(doc["copyBlocks"]["bodiesIntro"])

        col_w = (CONTENT_W - 18) / 2
        row_h = self.layout_get("global.certificationBodies.rowHeight", 58)
        logo_w = self.layout_get("global.certificationBodies.logoWidth", 58)
        logo_h = self.layout_get("global.certificationBodies.logoHeight", 32)
        text_offset_x = self.layout_get("global.certificationBodies.textOffsetX", 92)
        x_positions = [MARGIN_X, MARGIN_X + col_w + 18]
        col = 0
        for body in self.model["activeBodies"]:
            self.ensure_space(row_h + 14, "Certification bodies")
            x = x_positions[col]
            y = self.y
            self.c.setStrokeColor(RULE)
            self.c.line(x, y + 7, x + col_w, y + 7)
            self.c.setFillColor(hex_color(body.get("color")))
            self.c.circle(x + 5, y - 7, 4, fill=1, stroke=0)
            logo_x = x + 20
            self.draw_body_logo(body, logo_x, y + 8, logo_w, logo_h)
            text_x = x + text_offset_x
            self.set_font(FONT_BOLD, 8.2, BLACK)
            self.c.drawString(text_x, y - 4, clean_text(body["name"]))
            self.set_font(FONT, 7.6, DARK)
            self.c.drawString(text_x, y - 18, f"{body['certificationCount']} certification entries")
            self.set_font(FONT_OBLIQUE, 7.2, MID)
            self.c.drawString(text_x, y - 32, self.resolved_body_treatment(body))
            if col == 1:
                self.y -= row_h
            col = 1 - col
        if col == 1:
            self.y -= row_h

        self.y -= 18
        self.ensure_space(58, "Certification bodies")
        self.set_font(FONT_BOLD, 9.5, BLACK)
        self.c.drawString(MARGIN_X, self.y, "Excluded from active legend")
        self.y -= 16
        for body in self.model["excludedBodies"]:
            self.c.setStrokeColor(LIGHT_RULE)
            self.c.line(MARGIN_X, self.y + 5, PAGE_W - MARGIN_X, self.y + 5)
            self.set_font(FONT_BOLD, 8, BLACK)
            self.c.drawString(MARGIN_X, self.y - 2, clean_text(body["name"]))
            self.set_font(FONT, 7.6, DARK)
            self.c.drawString(MARGIN_X + 210, self.y - 2, clean_text(body["reason"]))
            self.y -= 19

    def draw_catalogue(self) -> None:
        self.start_page("Product catalogue")
        self.draw_section_intro(self.model["document"]["copyBlocks"]["catalogueIntro"])
        for family in self.model["families"]:
            self.ensure_space(70, "Product catalogue")
            self.draw_family_catalogue_header(family["name"])
            products = [p for p in self.model["products"] if p["familyId"] == family["id"]]
            for product in products:
                self.draw_catalogue_row(product)
            self.y -= 12

    def draw_family_catalogue_header(self, name: str) -> None:
        self.set_font(FONT_BOLD, 9.8, SCHNEIDER_GREEN)
        self.c.drawString(MARGIN_X, self.y, clean_text(name))
        self.y -= 16
        self.c.setFillColor(PALE)
        self.c.rect(MARGIN_X, self.y - 18, CONTENT_W, 18, fill=1, stroke=0)
        self.c.setStrokeColor(RULE)
        self.c.rect(MARGIN_X, self.y - 18, CONTENT_W, 18, fill=0, stroke=1)
        headers = [("Product", 0), ("Certs", 54), ("Bodies", 91), ("Standards/functions", 246), ("Image", 420)]
        self.set_font(FONT_BOLD, 7.1, BLACK)
        for label, offset in headers:
            self.c.drawString(MARGIN_X + offset + 6, self.y - 12, label)
        self.y -= 18

    def draw_catalogue_row(self, product: dict[str, Any]) -> None:
        body_text = ", ".join(product["bodies"]) if product["bodies"] else "None listed"
        standard_text = ", ".join(product["standardCodes"]) if product["standardCodes"] else "None listed"
        image_text = "Fallback image" if not product["image"]["preferred"]["exists"] else "Product image"
        body_lines = self.wrap_text(body_text, 145, FONT, 7.1)
        standard_lines = self.wrap_text(standard_text, 160, FONT, 7.1)
        row_h = max(31, 10 + max(len(body_lines), len(standard_lines), 1) * 8.4)
        if self.y - row_h < BOTTOM_Y:
            self.start_page("Product catalogue")
            family = next(f for f in self.model["families"] if f["id"] == product["familyId"])
            self.draw_family_catalogue_header(family["name"])
        top = self.y
        self.c.setStrokeColor(LIGHT_RULE)
        self.c.line(MARGIN_X, top, PAGE_W - MARGIN_X, top)
        self.set_font(FONT_BOLD, 8.2, BLACK)
        self.c.drawString(MARGIN_X + 6, top - 13, clean_text(product["code"]))
        self.set_font(FONT, 7.6, DARK)
        self.c.drawCentredString(MARGIN_X + 70, top - 13, str(product["certificationCount"]))
        self.draw_wrapped(body_text, MARGIN_X + 97, top - 11, 145, size=7.1, leading=8.4, color=DARK, max_lines=3)
        self.draw_wrapped(standard_text, MARGIN_X + 252, top - 11, 160, size=7.1, leading=8.4, color=DARK, max_lines=3)
        self.set_font(FONT, 7.1, MID)
        self.c.drawString(MARGIN_X + 426, top - 13, image_text)
        if product["noCertificationListed"]:
            self.set_font(FONT_OBLIQUE, 6.9, MID)
            self.c.drawString(MARGIN_X + 6, top - 25, "No listed certification in source table.")
        self.y -= row_h

    def draw_product_sheets(self) -> None:
        self.start_page("Product sheets")
        self.draw_section_intro(self.model["document"]["copyBlocks"]["productSheetIntro"])
        current_family = None
        for product in self.model["products"]:
            if product["familyId"] != current_family:
                current_family = product["familyId"]
                self.ensure_space(32, "Product sheets")
                self.set_font(FONT_BOLD, 10.2, SCHNEIDER_GREEN)
                self.c.drawString(MARGIN_X, self.y, clean_text(product["familyName"]))
                self.y -= 16
            self.draw_product_sheet(product)
            self.y -= self.layout_get("global.productSheets.sheetGap", 9)

    def estimate_product_height(self, product: dict[str, Any]) -> float:
        cert_count = max(1, len(product["certifications"]))
        note_count = len(product.get("footnotes", []))
        return 74 + cert_count * 21 + note_count * 10

    def draw_product_sheet(self, product: dict[str, Any]) -> None:
        needed = self.estimate_product_height(product)
        self.ensure_space(needed, "Product sheets")
        top = self.y
        self.c.setStrokeColor(RULE)
        self.c.setLineWidth(0.6)
        self.c.line(MARGIN_X, top + 4, PAGE_W - MARGIN_X, top + 4)

        image_box_w = self.layout_get("global.productSheets.imageBoxWidth", 74)
        image_box_h = self.layout_get("global.productSheets.imageBoxHeight", 54)
        chosen = product["image"]["chosenForPdf"]
        if chosen.get("exists"):
            self.draw_image_fit(Path(chosen["absolutePath"]), MARGIN_X, top - 4, image_box_w, image_box_h)
        else:
            self.draw_image_placeholder(MARGIN_X, top - 4, image_box_w, image_box_h)

        x = MARGIN_X + image_box_w + 16
        self.set_font(FONT_BOLD, 13, BLACK)
        self.c.drawString(x, top - 8, clean_text(product["code"]))
        self.set_font(FONT, 8, DARK)
        self.c.drawString(x, top - 23, clean_text(product["familyName"]))
        self.set_font(FONT, 7.7, MID)
        self.c.drawString(x, top - 38, clean_text(product["pdfSummary"]))

        logo_area_w = self.layout_get("global.productSheets.bodyLogoAreaWidth", 232)
        logo_area_x = PAGE_W - MARGIN_X - logo_area_w
        logo_x = logo_area_x
        logo_y = top - 1
        logo_cell_w = self.layout_get("global.productSheets.bodyLogoCellWidth", 39)
        logo_cell_h = self.layout_get("global.productSheets.bodyLogoCellHeight", 22)
        logo_gap = self.layout_get("global.productSheets.bodyLogoGap", 7)
        for body_name in product["bodies"]:
            body = next((b for b in self.model["activeBodies"] if b["name"] == body_name), None)
            if body:
                if logo_x + logo_cell_w > logo_area_x + logo_area_w:
                    logo_x = logo_area_x
                    logo_y -= logo_cell_h + 3
                self.draw_body_logo(body, logo_x, logo_y, logo_cell_w, logo_cell_h)
                logo_x += logo_cell_w + logo_gap

        y = top - 68
        if product["noCertificationListed"]:
            self.set_font(FONT_OBLIQUE, 8.3, MID)
            self.c.drawString(x, y, "No listed certification in the source table.")
            self.y = y - 16
            return

        header_h = 15
        self.c.setFillColor(PALE)
        self.c.rect(MARGIN_X, y - header_h + 3, CONTENT_W, header_h, fill=1, stroke=0)
        self.c.setStrokeColor(RULE)
        self.c.rect(MARGIN_X, y - header_h + 3, CONTENT_W, header_h, fill=0, stroke=1)
        self.set_font(FONT_BOLD, 6.8, BLACK)
        self.c.drawString(MARGIN_X + 6, y - 7, "Function")
        self.c.drawString(MARGIN_X + 180, y - 7, "Standards")
        self.c.drawString(MARGIN_X + 370, y - 7, "Certification body")
        y -= header_h

        for cert in product["certifications"]:
            row_h = 21
            self.c.setStrokeColor(LIGHT_RULE)
            self.c.line(MARGIN_X, y - row_h + 4, PAGE_W - MARGIN_X, y - row_h + 4)
            foot = ""
            if cert["footnotes"]:
                foot = " " + " ".join(f"({note['id']})" for note in cert["footnotes"])
            self.draw_wrapped(cert["functionName"], MARGIN_X + 6, y - 6, 165, size=6.8, leading=7.7, color=DARK, max_lines=2)
            standards = ", ".join(cert["standardCodes"]) if cert["standardCodes"] else "Certified body requirements"
            self.draw_wrapped(standards + foot, MARGIN_X + 180, y - 6, 180, size=6.8, leading=7.7, color=DARK, max_lines=2)
            self.draw_body_label(cert["body"], MARGIN_X + 370, y - 6, 132)
            y -= row_h

        if product["footnotes"]:
            y -= 2
            note_text = " ".join(f"({note['id']}) {note['text']}" for note in product["footnotes"])
            y = self.draw_wrapped(note_text, MARGIN_X + 90, y, CONTENT_W - 90, size=6.7, leading=8, color=MID, max_lines=3)

        self.y = y - 4

    def draw_annex(self) -> None:
        self.start_page("Annex")
        self.draw_section_intro(self.model["document"]["copyBlocks"]["annexIntro"])

        self.draw_annex_block("Source notes", [
            (f"({note['id']})", note["text"]) for note in self.model["annex"]["footnotes"]
        ])
        body_logo_rows = []
        for body in self.model["activeBodies"]:
            if body.get("id") in BODY_LOGO_OVERRIDES:
                body_logo_rows.append(("Body logo", f"{body['name']}: normalized asset used from assets/processed/certification_logos."))
        if not body_logo_rows:
            body_logo_rows.append(("Body logo", "All active certification body logos use source assets."))
        body_logo_rows.extend([
            ("Reference", "Directive 2014/34/UE is listed as a textual reference, not as a certification logo."),
            ("Reference", "Certified body requirements are listed as a textual reference, not as a certification logo."),
        ])
        self.draw_annex_block("Logo and reference treatments", body_logo_rows)
        image_issues = self.model["annex"]["productImageIssues"]
        converted = [item["code"] for item in image_issues if item["requiresPdfConversion"]]
        fallbacks = [item["code"] for item in image_issues if item["issue"] == "preferred-image-missing"]
        self.draw_annex_block("Image fallbacks and conversions", [
            ("PDF-safe image cache", f"{len(converted)} product images require conversion before PDF embedding: {', '.join(converted)}."),
            ("Fallback product images", f"{', '.join(fallbacks)} use family fallback imagery because no direct preferred image is available."),
        ])

        integrity = self.model["integrity"]
        rows = [
            ("Products", f"{integrity['actual']['products']} / {integrity['expected']['products']}"),
            ("Certification entries", f"{integrity['actual']['certifications']} / {integrity['expected']['certifications']}"),
            ("Active bodies", f"{integrity['actual']['activeBodies']} / {integrity['expected']['activeBodies']}"),
            ("Excluded bodies", ", ".join(integrity["actual"]["excludedBodies"])),
            ("Rows without listed certification", ", ".join(integrity["actual"]["productsWithoutListedCertification"])),
        ]
        self.draw_annex_block("Integrity checks", rows)

    def draw_annex_block(self, title: str, rows: list[tuple[str, str]]) -> None:
        needed = 28 + len(rows) * 19
        self.ensure_space(needed, "Annex")
        self.set_font(FONT_BOLD, 9.7, BLACK)
        self.c.drawString(MARGIN_X, self.y, clean_text(title))
        self.y -= 14
        for key, value in rows:
            self.c.setStrokeColor(LIGHT_RULE)
            self.c.line(MARGIN_X, self.y + 4, PAGE_W - MARGIN_X, self.y + 4)
            self.set_font(FONT_BOLD, 7.3, BLACK)
            self.c.drawString(MARGIN_X + 4, self.y - 3, clean_text(key))
            value_x = MARGIN_X + self.layout_get("global.annex.labelWidth", 180)
            new_y = self.draw_wrapped(value, value_x, self.y - 3, PAGE_W - MARGIN_X - value_x, size=7.3, leading=8.4, color=DARK, max_lines=3)
            self.y = min(self.y - 18, new_y - 4)
        self.y -= 10

    def build(self) -> None:
        self.draw_cover()
        self.draw_overview()
        self.draw_standards()
        self.draw_bodies()
        self.draw_catalogue()
        self.draw_product_sheets()
        self.draw_annex()
        self.save()

    def report(self) -> dict[str, Any]:
        return {
            "output": str(self.output),
            "pages": self.page_no,
            "imageCache": str(self.cache_dir),
            "convertedAssetCountThisRun": len(self.converted_assets),
            "imageCacheFileCount": len(list(self.cache_dir.glob("*.png"))),
            "warnings": self.render_warnings,
            "badgeLabelsUsed": sorted(set(self.badges_used)),
            "logoOverridesUsed": sorted(self.logo_overrides_used),
            "sourceModel": str(DEFAULT_MODEL),
            "layoutOverrides": str(self.layout_source) if self.layout_source else None,
            "layoutOverrideVersion": self.layout.get("version"),
            "metrics": self.model["document"]["metrics"],
        }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build the Universal Enclosures certifications PDF guide.")
    parser.add_argument("--model", type=Path, default=DEFAULT_MODEL)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--cache", type=Path, default=DEFAULT_CACHE)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--layout", type=Path, default=DEFAULT_LAYOUT)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    model = json.loads(args.model.read_text(encoding="utf-8"))
    layout_source = args.layout if args.layout and args.layout.exists() else None
    layout = json.loads(layout_source.read_text(encoding="utf-8")) if layout_source else {}
    guide = CertificationsGuide(model, args.output, args.cache, layout=layout, layout_source=layout_source)
    guide.build()
    build_report = guide.report()
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(build_report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(build_report, indent=2))


if __name__ == "__main__":
    main()

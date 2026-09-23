#!/usr/bin/env node
/**
 * Build-time image derivatives for the static export.
 *
 * ImageMagick does the encoding (`magick`, falling back to `convert` on
 * ImageMagick 6), so there is no runtime image service, no extra npm
 * dependency and no per-request cost. Run it after committing or replacing a
 * source asset; the app only ever references the generated file.
 *
 * Usage
 * -----
 *   pnpm run assets:derivatives          # generate and print a size report
 *   pnpm run assets:derivatives:check    # report only, write nothing
 *   node scripts/build/generate-image-derivatives.mjs --strict   # fail on a missing source
 *   node scripts/build/generate-image-derivatives.mjs --force    # regenerate unchanged outputs
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";

import config from "./image-derivatives.config.mjs";

const argv = new Set(process.argv.slice(2));
const checkOnly = argv.has("--check");
const strict = argv.has("--strict");
const force = argv.has("--force");

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

/**
 * ImageMagick 7 ships `magick`; ImageMagick 6 ships `convert` (and, depending on
 * the packaging, a `magick` wrapper that expects a subcommand). Rather than
 * guess from the version string, each candidate is probed with a real
 * one-pixel conversion in convert-style syntax and the first one that works is
 * used.
 */
function resolveCommand() {
  for (const command of ["magick", "convert"]) {
    try {
      execFileSync(command, ["-size", "1x1", "xc:white", "-format", "%w", "info:"], {
        stdio: "ignore",
      });
      return command;
    } catch {}
  }

  throw new Error(
    "ImageMagick not found. Install it (`sudo apt install imagemagick`) or skip `pnpm run assets:derivatives` when no derivative changed.",
  );
}

function buildArgs(entry, sourcePath, outputPath) {
  const { width, height, quality, format, crop } = entry;
  const args = [sourcePath];

  if (crop && height) {
    // `^` fills the box, then `-extent` crops the overflow from the centre:
    // the standard cover crop, used for the social preview.
    args.push(
      "-resize",
      `${width}x${height}^`,
      "-gravity",
      "center",
      "-extent",
      `${width}x${height}`,
    );
  } else {
    args.push("-resize", `${width}x`);
  }

  args.push("-quality", String(quality));

  if (format === "webp") {
    args.push("-define", "webp:method=6");
  }

  if (format === "png") {
    args.push("-strip", "-define", "png:compression-level=9");
  }

  if (format === "jpeg") {
    args.push("-strip", "-interlace", "Plane");
  }

  args.push(outputPath);

  return args;
}

function run(command, args) {
  return execFileSync(command, args, { encoding: "utf8" }).trim();
}

function main() {
  const { sourceDir, outputDir, derivatives } = config;

  if (!Array.isArray(derivatives) || derivatives.length === 0) {
    console.log("image-derivatives: nenhuma entrada configurada — nada a fazer.");
    return;
  }

  let command = null;
  const rows = [];
  const missing = [];

  for (const entry of derivatives) {
    const sourcePath = path.resolve(sourceDir, entry.source);
    const outputPath = path.resolve(outputDir, entry.output);

    if (!existsSync(sourcePath)) {
      missing.push(entry.source);
      continue;
    }

    const sourceBytes = statSync(sourcePath).size;
    const alreadyFresh =
      !force &&
      existsSync(outputPath) &&
      statSync(outputPath).mtimeMs > statSync(sourcePath).mtimeMs;

    if (alreadyFresh) {
      rows.push({ entry, sourcePath, outputPath, sourceBytes, state: "fresh" });
      continue;
    }

    if (checkOnly) {
      rows.push({ entry, sourcePath, outputPath, sourceBytes, state: "pending" });
      continue;
    }

    command ??= resolveCommand();
    mkdirSync(path.dirname(outputPath), { recursive: true });
    run(command, buildArgs(entry, sourcePath, outputPath));
    rows.push({ entry, sourcePath, outputPath, sourceBytes, state: "written" });
  }

  if (missing.length > 0) {
    const message = `imagem(ns) de origem ausente(s): ${missing.join(", ")}`;

    if (strict) {
      throw new Error(`${message}. Commite a fonte ou remova a entrada do manifesto.`);
    }

    console.warn(`aviso: ${message} — entrada ignorada (use --strict para falhar).`);
  }

  if (rows.length === 0) {
    return;
  }

  const label = { fresh: "(inalterada)", pending: "(pendente)", written: "" };
  let before = 0;
  let after = 0;

  console.log(
    "origem                             -> derivada                        antes    depois",
  );
  console.log("-".repeat(88));

  for (const row of rows) {
    const outputBytes = existsSync(row.outputPath) ? statSync(row.outputPath).size : 0;

    before += row.sourceBytes;
    after += outputBytes;

    console.log(
      `${row.entry.source.padEnd(34)} -> ${row.entry.output.padEnd(30)} ${`${kb(row.sourceBytes)}KB`.padStart(8)} ${`${kb(outputBytes)}KB`.padStart(8)} ${label[row.state]}`.trimEnd(),
    );
  }

  console.log("-".repeat(88));
  console.log(
    `TOTAL: ${Math.round(kb(before))}KB -> ${Math.round(kb(after))}KB (economia de ${Math.round(
      kb(Math.max(before - after, 0)),
    )}KB)${checkOnly ? "  [--check: nada foi escrito]" : ""}`,
  );
  console.log(`saída: ${outputDir}`);
}

try {
  main();
} catch (error) {
  console.error(`generate-image-derivatives: ${error.message}`);
  process.exit(1);
}

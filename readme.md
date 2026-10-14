# Hockey-Club Grün-Weiss TuS Mayen

Quellcode der Vereinswebsite: <https://hockey-mayen.de>

Die Website wird mit **Jekyll** aus Markdown, HTML und JSON erzeugt und über **GitHub Pages** veröffentlicht. Gestaltung und interaktive Funktionen sind in CSS und JavaScript umgesetzt.

## Lokale Entwicklung

### Voraussetzungen

- Ruby und Bundler für Jekyll
- Node.js und npm für die optionalen CSS- und JavaScript-Builds
- ImageMagick und FFmpeg für die optionale Bearbeitung von Bildern und Videos

Alle folgenden Befehle werden im Projektverzeichnis ausgeführt, sofern kein anderes Verzeichnis angegeben ist.

### Website starten

Ruby-Abhängigkeiten installieren und den lokalen Server starten:

```bash
bundle install
bundle exec jekyll serve
```

Die Website ist anschließend unter <http://localhost:4000> erreichbar.

Für automatisches Neuladen im Browser und inkrementelle Builds:

```bash
bundle exec jekyll serve --livereload --incremental --port 4000
```

### Statische Ausgabe erzeugen

```bash
bundle exec jekyll build
```

Die erzeugte Website liegt in `_site/`. Sie kann alternativ mit Python lokal bereitgestellt werden:

```bash
cd _site
python3 -m http.server 4000
```

## Projektstruktur

| Pfad | Inhalt |
| --- | --- |
| `*.md`, `*.html` im Projektverzeichnis | Einzelne Seiten mit Inhalten und Jekyll-Frontmatter |
| `_config.yml` | Website-Adresse, Titel und allgemeine Jekyll-Konfiguration |
| `_layouts/default.html` | Gemeinsames Seitenlayout, Metadaten und Einbindung von CSS und JavaScript |
| `_includes/` | Kopfzeile mit Navigation und Fußzeile |
| `_data/` | JSON-Daten, die Jekyll beim Build in Seiten einsetzt |
| `assets/data/` | JSON-Daten, die JavaScript im Browser nachlädt |
| `assets/css/` | Globale und seitenspezifische Styles sowie CSS-Bundles |
| `assets/js/` | JavaScript für Chronik, aktuelle Meldungen, Bildwechsel und Kontaktformular |
| `assets/images/` | Vereinsbilder, Flyer, Videos und Vorschaubilder |
| `assets/pdf/`, `download/` | Dokumente und Downloads |
| `site.webmanifest`, `sw.js` | Web-App-Manifest und minimaler Service Worker |
| `.github/workflows/jekyll-gh-pages.yml` | Build und Veröffentlichung auf GitHub Pages |
| `_site/` | Generierte Website; Änderungen gehören in die Quelldateien |

## Inhalte pflegen

### Seiten und URLs

Der Konfigurationsblock am Anfang einer Seitendatei legt unter anderem Layout, Titel und öffentliche URL fest:

```yaml
---
layout: default
title: "Training"
permalink: /training/
---
```

Der Dateiname entspricht nicht immer der URL: `aktuell.html` erzeugt die Startseite `/`, während `index.md` die Vereinsseite `/verein/` erzeugt.

### Datenquellen

- **Aktuelle Meldungen und Chronik:** `assets/data/chronik.json`. Die Startseite und die Chronik laden diese Datei per JavaScript.
- **Trainingszeiten:** `_data/training.json`. Die Termine für den Wechsel zwischen Feld- und Hallensaison stehen zusätzlich in `training.md` und werden beim Build ausgewertet.
- **Vereinsseite:** `_data/startseite.json` für die Kachelinhalte; die Bildwechsel werden über die zugehörigen JavaScript-Dateien gesteuert.
- **Turniere und Videos:** `_data/turniere.json` und `_data/videos.json`.
- **Sportstätten:** `_data/sportstaetten.json`.

`_data/chronik.json` und `assets/data/chronik.json` sind separate Dateien. Für die aktuell eingebundenen Chronik-Skripte ist die Datei unter `assets/data/` maßgeblich.

### Kontaktformular

Das Formular in `kontakt.md` verwendet `assets/js/kontakt-form.js` für Eingabeprüfung und Versand. Cloudflare Turnstile dient als Botschutz. Die Nachrichten werden an einen externen Cloudflare Worker gesendet; dessen serverseitiger Code ist nicht Teil dieses Projekts.

## CSS und JavaScript bündeln

Die Build-Skripte führen die jeweiligen Quelldateien zusammen und minifizieren sie:

```bash
npm install
./build-css.sh
./build-js.sh
```

| Skript | Zusammengeführte Datei | Minifizierte Datei | Werkzeug |
| --- | --- | --- | --- |
| `build-css.sh` | `assets/css/all.css` | `assets/css/all.min.css` | `clean-css-cli` |
| `build-js.sh` | `assets/js/all.js` | `assets/js/all.min.js` | `terser` |

`clean-css-cli` ist in der lokalen `package.json` als Entwicklungsabhängigkeit eingetragen. `terser` wird über `npx` aufgerufen und ist dort derzeit nicht als Abhängigkeit aufgeführt. Die lokale `package.json` wird aktuell noch nicht von Git erfasst.

Das gemeinsame Layout lädt `all.min.css`. JavaScript wird derzeit überwiegend über einzelne Dateien eingebunden. Die Reihenfolge der zusammengeführten Dateien steht in den Build-Skripten. `build-js.sh` enthält außerdem Einträge für aktuell fehlende Quelldateien und gibt dafür Warnungen aus.

## Bilder und Videos vorbereiten

### Bilder in WebP umwandeln

Beispiel mit ImageMagick:

```bash
convert "U8-heimturnier-14.1.2024.png" -quality 80 "U8-heimturnier-14.1.2024.webp"
```

Dasselbe Verfahren kann für JPEG-Dateien verwendet werden. Dateinamen und Bildpfade anschließend in den jeweiligen Seiten oder JSON-Daten eintragen.

### Video auf 720p verkleinern

Im Verzeichnis des Quellvideos ausführen:

```bash
ffmpeg -i WU12_lange_ecke.mp4 \
  -map 0 -map_metadata -1 \
  -vf "scale=-2:720" \
  -c:v libx264 -preset medium -crf 24 \
  -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  WU12_lange_ecke-720p.mp4
```

### Video-Vorschaubilder erzeugen

Vorschaubilder dienen als Poster für eingebettete Videos, beispielsweise auf iOS:

```bash
cd assets/images/video

ffmpeg -ss 0.3 -i anton-kulinna-penalty-720p.mp4 -frames:v 1 -q:v 3 anton-kulinna-penalty.jpg
ffmpeg -ss 0.3 -i WU12_lange_ecke-720p.mp4 -frames:v 1 -q:v 3 WU12_lange_ecke.jpg
ffmpeg -ss 0 -i alex-lion-philip-hockey-club-mayen-720p.mp4 -frames:v 1 -q:v 3 alex-lion-philip.jpg
```

## Veröffentlichung und Prüfung

Ein Push auf `main` startet den GitHub-Actions-Workflow. Dieser baut die Website mit Jekyll und veröffentlicht die Ausgabe auf GitHub Pages. Der Workflow kann auch manuell über den Actions-Bereich gestartet werden.

Die CSS- und JavaScript-Build-Skripte werden vom Workflow nicht ausgeführt. Änderungen an CSS-Quelldateien müssen daher vor der Veröffentlichung auch in `all.min.css` übernommen werden.

Für eine lokale Prüfung:

1. Bei CSS-Änderungen das CSS-Bundle neu erzeugen.
2. `bundle exec jekyll build` ausführen und die Ausgabe auf Fehler prüfen.
3. Betroffene Seiten im lokalen Server aufrufen und Darstellung, Links sowie interaktive Funktionen prüfen, auch bei schmaler Bildschirmbreite.

Eine automatisierte Testsuite ist derzeit nicht eingerichtet.

## Nützliche Werkzeuge

- [PageSpeed Insights](https://pagespeed.web.dev/) zur Prüfung von Ladezeit und Darstellung
- [ImageKit-Medienbibliothek](https://imagekit.io/dashboard/media-library) zur Verwaltung extern bereitgestellter Medien

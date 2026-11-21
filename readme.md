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

Der Watcher baut all.min.css nach jeder CSS-Änderung neu; Jekyll übernimmt die Änderung für http://127.0.0.1:4000/
```bash
npm run watch:css
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

Die CSS-Dateien bleiben nach Seitenteilen getrennt. Der CSS-Build bündelt und minifiziert sie in fester Reihenfolge:

```bash
npm ci
npm run build:css
bundle exec jekyll serve
```

Bei CSS-Arbeiten kann in einem zweiten Terminal `npm run watch:css` laufen. Der Watcher schreibt nach jeder Änderung an einer CSS-Quelldatei automatisch `assets/css/all.min.css`; Jekyll lädt die Änderung neu. `./build-css.sh` bleibt als kurzer Aufruf für den gleichen Build verfügbar.

Der Build verwendet `clean-css` aus `package.json` und `package-lock.json`. Die Reihenfolge der CSS-Dateien steht in `scripts/build-css.cjs`. Fehlende oder leere Dateien sowie CSS-Build-Warnungen brechen den Build ab. Das gemeinsame Layout lädt ausschließlich `assets/css/all.min.css` für die eigenen Styles; AOS wird separat geladen. Eine Build-Kennung in der CSS-URL verhindert, dass Browser nach einem Deploy die alte Datei aus dem Cache laden. Beim Push auf `main` erstellt GitHub Actions das Bundle vor dem Jekyll-Build neu. Das generierte Bundle ist ebenfalls im Repository, damit die lokale Jekyll-Vorschau ohne laufenden CSS-Watcher funktioniert.

JavaScript wird derzeit überwiegend über einzelne Dateien eingebunden. `build-js.sh` ist vom CSS-Build unabhängig und enthält noch Einträge für aktuell fehlende Quelldateien.

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

Der Workflow führt `npm ci` und `npm run build:css` vor Jekyll aus. Dadurch werden CSS-Änderungen beim Push auch dann veröffentlicht, wenn `all.min.css` lokal noch nicht neu gebaut wurde. Für eine lokale Vorschau vorher einmal `npm run build:css` ausführen oder `npm run watch:css` parallel laufen lassen.

Für eine lokale Prüfung:

1. Bei CSS-Änderungen das CSS-Bundle neu erzeugen oder den Watcher laufen lassen.
2. `bundle exec jekyll build` ausführen und die Ausgabe auf Fehler prüfen.
3. Betroffene Seiten im lokalen Server aufrufen und Darstellung, Links sowie interaktive Funktionen prüfen, auch bei schmaler Bildschirmbreite.

Eine automatisierte Testsuite ist derzeit nicht eingerichtet.

## Nützliche Werkzeuge

- [PageSpeed Insights](https://pagespeed.web.dev/) zur Prüfung von Ladezeit und Darstellung
- [ImageKit-Medienbibliothek](https://imagekit.io/dashboard/media-library) zur Verwaltung extern bereitgestellter Medien
# Dev-Vorschau

`main` veröffentlicht die freigegebene Website auf GitHub Pages. Änderungen werden
zuerst auf `dev` gepusht und nach Prüfung per Pull Request nach `main` übernommen.
Der Pages-Workflow ist auf `main` beschränkt, auch bei manueller Ausführung.

Die Vorschau liegt als separates **Direct-Upload-Projekt** auf Cloudflare Pages:

| Einstellung | Wert |
| --- | --- |
| Projektname | `hockey-mayen-dev` |
| Production branch des **Vorschauprojekts** | `dev` |
| Veröffentlichung | geprüften lokalen Build mit Wrangler hochladen |
| Build command | `npm run build:dev` |
| Build output directory | `_site-dev` |
| `NODE_VERSION` | `24` |
| `RUBY_VERSION` | `3.2.8` |
| Custom domain | `dev.hockey-mayen.de` |

Das Projekt und die Zuordnung von `dev.hockey-mayen.de` sind angelegt. Die erste
Veröffentlichung ist unter https://hockey-mayen-dev.pages.dev erreichbar.
Für die Custom Domain ist der CNAME `dev` → `hockey-mayen-dev.pages.dev` erforderlich.
Die DNS-Einträge der Hauptseite nicht ändern.

Ein Git-Push allein aktualisiert diese Direct-Upload-Vorschau noch nicht. Bis ein
separater CI-Deploy mit einem Cloudflare-Pages-API-Token eingerichtet ist, erfolgt
die Veröffentlichung nach Wrangler-Anmeldung aus dem `dev`-Branch:

```bash
npm run build:dev
npx --yes --registry=https://registry.npmjs.org wrangler@4.166.0 pages deploy _site-dev --project-name hockey-mayen-dev --branch dev
```

Lokal mit `npm run build:dev` bauen. Dieser Build lädt zusätzlich `_config.dev.yml`,
schließt die Indexierung über Meta-Tags, `robots.txt` und `X-Robots-Tag` aus und
deaktiviert den Nachrichtenversand im Kontaktformular. Er ist eine öffentlich
erreichbare Vorschau, keine zugriffsgeschützte Umgebung. Der reguläre Build ohne
`_config.dev.yml` behält die Produktionsfunktion.

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

## Dev-Stage und Produktion

Stand der Einrichtung: 21. November 2026.

| Umgebung | Branch | Adresse | Veröffentlichung |
| --- | --- | --- | --- |
| Produktion | `main` | https://hockey-mayen.de | automatisch durch GitHub Actions nach Push oder PR-Merge nach `main` |
| Dev-Vorschau | `dev` | https://hockey-mayen-dev.pages.dev | separater Build und manueller Upload mit Wrangler |

Die Vorschau ist ein **Direct-Upload-Projekt** auf Cloudflare Pages mit dem Namen
`hockey-mayen-dev`. Der dort als „Production branch“ bezeichnete Branch ist `dev`;
Cloudflare meint damit die Hauptversion dieses Vorschauprojekts, nicht die öffentliche
Vereinswebsite. Ein Push auf `dev` aktualisiert die Online-Vorschau **nicht automatisch**.
Eine GitHub-/Cloudflare-CI-Verbindung für diesen Upload ist bisher nicht eingerichtet.

### Änderungen entwickeln und auf Dev veröffentlichen

1. Vor Beginn `git status` sowie die lokalen und Remote-Branches prüfen.
   Nach einer Produktionsfreigabe `main` und `dev` bei Bedarf regulär zusammenführen;
   bestehende Änderungen erhalten, keine erzwungenen Pushes oder Resets verwenden.
2. Änderungen auf `dev` bearbeiten und lokal prüfen.
3. Gewünschte Quelländerungen gezielt committen und auf `dev` pushen.
   Generierte Ausgaben und lokale AI-Dateien nicht mit aufnehmen.
4. Den aktuellen Dev-Stand bauen und separat auf Cloudflare Pages hochladen:

```bash
npm run build:dev
npx --yes --registry=https://registry.npmjs.org wrangler@4.166.0 pages deploy _site-dev --project-name hockey-mayen-dev --branch dev
```

Der Build bündelt CSS, erzeugt die initialen Highlights und lädt
`_config.yml` sowie `_config.dev.yml`. Die Ausgabe liegt in `_site-dev/`.
Lokale Abhängigkeiten müssen vorher installiert sein (`npm ci` und `bundle install`).
Für npm wird Node.js 24 verwendet; Ruby/Bundler richten sich nach `Gemfile.lock`.

Der Upload setzt eine Cloudflare-Anmeldung voraus. Falls noch keine gültige
Anmeldung besteht:

```bash
npx --yes --registry=https://registry.npmjs.org wrangler@4.166.0 login
```

`--registry` wählt für diese Aufrufe die öffentliche npm-Registry, ohne die
lokale npm-Konfiguration dauerhaft zu ändern. Zugangsdaten nie in Quellcode,
Remote-URLs oder Dokumentation schreiben. GitHub-Zugriff erfolgt lokal über die
GitHub CLI (`gh auth login`, danach `gh auth setup-git --hostname github.com`).

### Unterschiede der Dev-Stage

- Dev ist öffentlich erreichbar, aber über Robots-Meta-Tags, `robots.txt` und
  `X-Robots-Tag` von der Indexierung ausgeschlossen. Das ist kein Zugangsschutz.
- Turnstile und der tatsächliche Kontaktformularversand sind auf Dev bewusst
  deaktiviert. Diese Entscheidung wurde nach Rückfrage ausdrücklich beibehalten.
  Die Vorschau dient somit keinem vollständigen Formular-Funktionstest.
- Der Produktionsbuild lädt ausschließlich `_config.yml`, bindet Turnstile ein
  und erlaubt den normalen Nachrichtenversand. `_config.dev.yml` nicht dem
  Produktionsworkflow hinzufügen.
- Zusätzliche HTTP-Header der Vorschau werden durch `scripts/build-dev.sh` in
  `_site-dev/_headers` erzeugt und von Cloudflare Pages ausgewertet.

### Optionale Dev-Subdomain

`dev.hockey-mayen.de` ist dem Cloudflare-Pages-Projekt bereits zugeordnet. Zum
letzten technischen Prüfzeitpunkt war die Subdomain noch nicht auflösbar; eine
abgeschlossene DNS-/HTTPS-Prüfung steht aus. Der dafür benötigte DNS-Eintrag lautet:

| Typ | Name | Ziel | Proxy |
| --- | --- | --- | --- |
| CNAME | `dev` | `hockey-mayen-dev.pages.dev` | aktiviert |

Vor dem Anlegen vorhandene `dev`-Einträge prüfen. Die Wrangler-OAuth-Anmeldung
besitzt Pages-Schreibrechte, aber keine DNS-Schreibrechte. Bestehende DNS-Einträge
der Hauptseite erhalten. Bis die Subdomain geprüft ist, die funktionierende
`pages.dev`-Adresse verwenden.

### Getesteten Stand auf Produktion übernehmen

Nach ausdrücklicher Freigabe den getesteten `dev`-Stand per Pull Request nach
`main` übernehmen. Der Workflow `.github/workflows/jekyll-gh-pages.yml` baut CSS,
Highlights und Jekyll neu und veröffentlicht auf GitHub Pages. Beide Workflow-Jobs
sind auf `main` beschränkt, auch bei einem manuellen Start.

Den erfolgreichen Abschluss des Deployments abwarten und danach die Hauptseite
sowie die Produktionskonfiguration der Kontaktseite prüfen. Eine echte Nachricht
nur senden, wenn ein solcher Versandtest beauftragt wurde.

Der erste getestete Dev-Stand wurde am 21. November 2026 über PR #2 veröffentlicht:
https://github.com/hockey-mayen/hockey-mayen.github.io/pull/2.
Build und Deployment waren erfolgreich; der Eigentümer hat die funktionierende
Produktionsseite bestätigt.

### Lokale AI-Übergabe

`AGENTS.md` enthält Arbeitsregeln, `AI_HANDOFF.md` den aktuellen Projektstand.
Beide sind ausschließlich lokal: Sie werden über `.git/info/exclude` ignoriert
und über `_config.yml` vom Website-Build ausgeschlossen. Bei einem neuen Clone
müssen diese Dateien und die lokalen Ignore-Regeln separat übernommen werden.

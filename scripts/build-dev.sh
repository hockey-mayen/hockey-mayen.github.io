#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build:css
npm run build:highlights
JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config.dev.yml --destination _site-dev

# Cloudflare Pages liest diese Datei aus dem Ausgabeverzeichnis.
cat > _site-dev/_headers <<'HEADERS'
/*
  X-Robots-Tag: noindex, nofollow, noarchive
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
HEADERS

cat > _site-dev/robots.txt <<'ROBOTS'
User-agent: *
Disallow: /
ROBOTS

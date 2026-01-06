
Run website locally with:
bundle exec jekyll serve
---
cd /home/sergej/git/hockey-mayen/hockey-mayen.github.io
bundle exec jekyll build
cd _site
python3 -m http.server 4000
----

cd /home/sergej/git/hockey-mayen/hockey-mayen.github.io
bundle exec jekyll serve --livereload --incremental --port 4000

----
recreate 720 p video
ffmpeg -i WU12_lange_ecke.mp4   -map 0 -map_metadata -1   -vf "scale=-2:720"   -c:v libx264 -preset medium -crf 24   -pix_fmt yuv420p   -c:a aac -b:a 128k   -movflags +faststart   WU12_lange_ecke-720p.mp4
---
create video poster (iOS)
cd /home/sergej/git/hockey-mayen/hockey-mayen.github.io/assets/images/video

ffmpeg -ss 0.3 -i anton-kulinna-penalty-720p.mp4 -frames:v 1 -q:v 3 anton-kulinna-penalty.jpg
ffmpeg -ss 0.3 -i WU12_lange_ecke-720p.mp4        -frames:v 1 -q:v 3 WU12_lange_ecke.jpg
ffmpeg -ss 0 -i alex-lion-philip-hockey-club-mayen-720p.mp4 -frames:v 1 -q:v 3 alex-lion-philip.jpg
---

Notes:
https://visualstudio.microsoft.com/de/app-center/faq/
https://mobiletest.me/iphone_5_emulator/?u=https://hockey-mayen.github.io/chronik/



// "https://ik.imagekit.io/mvxy6ljtip/training/training1.webp?updatedAt=1742544137565",
// "https://ik.imagekit.io/mvxy6ljtip/training/training2.webp?updatedAt=1742544137561"
https://imagekit.io/dashboard/media-library

convert "U8-heimturnier-14.1.2024.png" -quality 80 "U8-heimturnier-14.1.2024.webp"

💡 Noch besser: srcset nutzen?
Wenn du willst, kann ich dir auch zeigen, wie man srcset einsetzt, 
um je nach Bildschirmgröße und Pixeldichte automatisch das passende Bild zu laden (für noch bessere Ladezeiten + Qualität).


./build-css.sh
./build-js.sh

https://ch.maswitzerland.com/de


https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect

convert "WU12-neue-trikots-2.png" -quality 80 "WU12-neue-trikots-2.webp"

convert "mu10-15-nov.2025-2.jpg" -quality 80 "mu10-15-nov.2025-2.webp"

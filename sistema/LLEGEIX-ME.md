# Sistema de contingut Bekora (per a Claude)

Instagram i TikTok @bekora.bk, connectats a Metricool (blogId 7563738, zona Europe/Madrid).

## Regles fixes
- Instagram en CATALÀ (sense veu), TikTok en CASTELLÀ (amb veu en off). Publicacions separades.
- Sense emojis. No mencionar Vic, Osona, cap ciutat ni "grau superior".
- Demo gratuïta 10 dies ("Si no et convenç, no pagues"). Preus sempre amb "+IVA".
- Packs: Bàsic 600 € (abans 1.500 €, mant. 60 €/any) · Complet 800 € (abans 2.000 €, mant. 80 €/any, "el més triat") · Prèmium 1.500 € (abans 3.000 €, mant. 150 €/any).
- Plaques NFC: 1 placa 25 € · 2 plaques 44 € · amb web: 1 placa 19 € · 2 plaques 28 €. Gestió de xarxes: Pla 1 29 €/mes · Pla 2 59 €/mes · Pla 3 119 €/mes. Especialitat: connectar xarxes i web amb Google.
- Contacte: bekora.es · WhatsApp 642 268 366 · @bekora.bk.
- Colors de marca #16171B / #F4F4F6 / verd #5EE08F; fons clars i un color d'accent diferent a cada vídeo. Fonts Unbounded, Instrument Sans, JetBrains Mono.

## FORMAT ACTUAL (des del 10-11-2026): DADA CURIOSA
La gent passava els vídeos en mig segon perquè semblaven anuncis. Ara:
1. Fotograma 0: una pregunta amb una dada que sorprèn i una animació simple ja visible (graella de 100, persones, comptador). Res de logo ni venda.
2. La dada real, SEMPRE amb font a la pantalla (camp src) i al text. Si la font és d'un altre país, dir-ho (EUA...).
3. El servei només al final, de refiló ("Ets dels 63?" + bekora.es petit).
- Plantilla: build/dc.html (+ build/cfg.js entrades d1, d2 com a exemple). Segments: q (pregunta + graella grisa), grid (n de 100 s'omplen), rest (els que queden), half (1 de cada 2), end.
- Veu: `python3 src/pvvo.py <id>` (des de sistema/). Render i música: `python3 src/dcmix.py <id> music_curio.py` (o una altra música de src/). Surt a out/DC/<id>-es.mp4 (veu) i <id>-ca.mp4 (sense veu).
- Requisits: pip install --break-system-packages torch torchaudio "coqui-tts[codec]" (lent, fins a 30-40 min: fer-ho en segon pla); model veu https://github.com/coqui-ai/TTS/releases/download/v0.8.0_models/tts_models--es--css10--vits.zip a sistema/tts/, i al config.json posar speakers_file a la ruta local. Playwright i ffmpeg ja hi són.
- Dades ja fetes: INE 1T2025 (37% micro amb web), Google/Ipsos (50% visita en 24 h), BrightLocal 2023 (62% evita negoci amb info incorrecta), SOCi 2024 (47% busca alternativa si tancat).
- Altres dades verificades disponibles: BrightLocal 2025: el 83% fa servir Google per trobar ressenyes de negocis locals; 85% no consideraria un negoci amb menys de 3 estrelles (BrightLocal, 2025); BrightLocal 2026: 97% llegeix ressenyes, 89% espera que el negoci respongui les ressenyes, 47% no usaria un negoci amb menys de 20 ressenyes. Verificar sempre a la font abans d'usar-les.

## Límit de Metricool (pla gratuït)
20 publicacions al mes EN TOTAL, cada xarxa compta a part; els esborranys no compten. Tota la resta es dona a en Jordi per pujar a mà (SendUserFile + text i hora).

## Errors coneguts
- No TRIAL_REEL (el compte no té prou seguidors): type REEL.
- Carrusels de TikTok en JPG (no PNG).
- Portada: videoCoverMilliseconds 300 (el fotograma 0 ja és la portada) o videoThumbnailUrl.

## Publicació
Arxius a la carpeta wNN/ d'aquest repositori → https://raw.githubusercontent.com/1millonpordia-creator/bekora-media/main/wNN/<arxiu> → createScheduledPost → esborrar wNN/ després. TikTok: commercialContentOwnBrand true, isAigc true. Hores: vídeos 18:00.

#!/bin/bash

languages="afr amh ara asm aze aze_cyrl bel ben bod bos bul cat ceb ces chi_sim chi_tra chr cym dan deu dzo ell eng enm epo est eus fas fin fra frk frm gle glg grc guj hat heb hin hrv hun iku ind isl ita ita_old jav jpn kan kat kat_old kaz khm kir kor kur lao lat lav lit mal mar mkd mlt msa mya nep nld nor ori pan pol por pus ron rus san sin slk slv spa spa_old sqi srp srp_latn swa swe syr tam tel tgk tgl tha tir tur uig ukr urd uzb uzb_cyrl vie yid"

mkdir "models"

for i in $languages; do
  url="https://github.com/tesseract-ocr/tessdata/raw/4.1.0/${i}.traineddata"
  wget -O "models/${i}.traineddata" "${url}"
  gzip "models/${i}.traineddata"
done

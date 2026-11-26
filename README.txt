2MER PRODUCTION — SEO DOSYA PAKETİ

PAKETTEKİ DOSYALAR
- index.html: Ana sayfa SEO düzenlemeleri; gerçek Instagram bağlantısı; ses dosyaları henüz olmadığı için boş/çalışmayan MP3 oynatıcıları kaldırıldı.
- iletisim.html: İletişim sayfası için özgün SEO başlık/açıklama, canonical, Open Graph ve ContactPage yapılandırılmış verisi; yalnızca gerçek Instagram bağlantısı.
- kayit.html ve giris.html: Sosyal bağlantılar tek Instagram hesabına indirildi. Hesap sistemi henüz etkin olmadığı için bu iki sayfaya noindex,follow eklendi; ziyaretçiler sayfalara normal şekilde erişebilir.
- sitemap.xml: Yalnızca indekslenmesi hedeflenen ana sayfa ve iletişim sayfasını içerir.

GITHUB PAGES'E YÜKLEME
1. Depodaki mevcut dört HTML dosyasını ve sitemap.xml dosyasını yedekle.
2. Bu paketteki index.html, iletisim.html, kayit.html ve giris.html dosyalarını deponun ana dizinindeki karşılıklarının üzerine yükle.
3. sitemap.xml dosyasını da deponun ana dizinindeki mevcut sitemap.xml dosyasının üzerine yükle.
4. Commit changes ile kaydet ve sitenin yayınlanmasını bekle.
5. Siteyi açıp dört sayfayı ve Instagram bağlantılarını kontrol et.
6. Search Console > Site Haritaları bölümünde sitemap.xml kaydını bir kez yeniden gönder.

ÖNEMLİ
- style.css, script.js, favicon.svg, brand-mark.svg ve ana sayfanın kullandığı görsel/video varlıklarını silmeyin; bu paket yalnızca HTML ve sitemap dosyalarını içerir.
- Kayıt/giriş sistemi gerçekten çalışır hâle geldiğinde kayit.html ve giris.html dosyalarındaki noindex,follow etiketlerini kaldırıp sitemap'e bu sayfaları tekrar eklemek değerlendirilebilir.
- Sitemap'in yeniden gönderilmesi Google'ın onu kesin kabul edeceği veya sayfaları hemen sıralayacağı anlamına gelmez.

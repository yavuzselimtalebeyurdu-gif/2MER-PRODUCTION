2MER PRODUCTION — WEB SİTESİ

DOSYA YAPISI
- index.html      Ana sayfa
- iletisim.html   İletişim formu
- kayit.html      Kayıt arayüzü
- giris.html      Giriş arayüzü
- style.css       Ortak tasarım ve responsive stiller
- script.js       Menü, animasyon, oynatıcı ve form etkileşimleri
- assets/         Demo logo, sekme ikonu ve stüdyo görseli
- audio/          Kendi MP3 demo dosyalarını buraya koy

MP3 EKLEME
Üç demo oynatıcı aşağıdaki dosya adlarını bekler:
1) audio/beat-demo-01.mp3
2) audio/beat-demo-02.mp3
3) audio/beat-demo-03.mp3
Kendi MP3 dosyalarını bu adlarla audio klasörüne koyarsan oynatıcılar çalışır.
İstersen HTML dosyalarında src yollarını kendi dosya adlarınla değiştirebilirsin.

SOSYAL MEDYA LİNKLERİ
Sosyal medya ikonları şimdilik Instagram, YouTube ve X ana sayfalarına gider.
Kendi profil adreslerini aşağıdaki HTML dosyalarında href alanlarıyla değiştir:
- index.html
- iletisim.html
- kayit.html
- giris.html
Örn: https://instagram.com/kullaniciadim

İLETİŞİM FORMU
İletişim formu önceki EmailJS kurulumundaki service/template/public key ile yapılandırılmıştır.
EmailJS şablonunda şu değişkenlerin bulunması gerekir:
- from_name
- reply_to
- message

KAYIT VE GİRİŞ HAKKINDA ÖNEMLİ NOT
Kayıt ve giriş sayfaları şu anda görsel/arayüz demosudur. Gerçek kullanıcı hesabı açmaz.
Şifreler tarayıcıda saklanmaz ve hiçbir sunucuya gönderilmez. Gerçek kullanıcı sistemi için
Firebase Authentication, Supabase Auth veya kendi güvenli backend sistemin bağlanmalıdır.
Bu statik HTML dosyaları tek başına güvenli hesap sistemi sağlayamaz.

YAYINLAMA
Tüm proje dosyalarını (klasör yapısını koruyarak) web hosting ana dizinine veya GitHub
Pages deposunun ana dizinine yükle. Sadece HTML dosyalarını yüklemek yeterli değildir;
style.css, script.js, assets/ ve audio/ klasörleri de gereklidir.

# KARYA WEB - ORTAK BUTON VE FORM SİSTEMİ

Bu proje için ortak buton ve form elemanları sistemi oluşturulmuştur. Bu sistemin amacı:

- Tutarlı görsel tasarım sağlamak
- CSS çakışmalarını önlemek  
- Bakım ve geliştirme süreçlerini kolaylaştırmak
- Erişilebilirlik standartlarını desteklemek

## 📁 Dosya Yapısı

```
src/styles/
├── buttons.css    # Tüm buton stilleri
├── forms.css      # Tüm form elemanı stilleri
```

Bu dosyalar `src/index.css` içinde import edilmiştir.

## 🔘 BUTON KULLANIMI

### Temel Buton Sınıfları

```html
<!-- Temel buton -->
<button className="btn">Buton</button>

<!-- Primary buton (ana eylemler için) -->
<button className="btn btn-primary">Kaydet</button>

<!-- Secondary buton (ikincil eylemler için) -->
<button className="btn btn-secondary">İptal</button>

<!-- Outline buton (daha az önemli eylemler için) -->
<button className="btn btn-outline">Düzenle</button>

<!-- Success buton (onay eylemler için) -->
<button className="btn btn-success">Onayla</button>

<!-- Danger buton (silme/tehlikeli eylemler için) -->
<button className="btn btn-danger">Sil</button>

<!-- Warning buton (uyarı eylemler için) -->
<button className="btn btn-warning">Uyarı</button>
```

### Buton Boyutları

```html
<button className="btn btn-primary btn-sm">Küçük</button>
<button className="btn btn-primary btn-md">Normal</button> <!-- varsayılan -->
<button className="btn btn-primary btn-lg">Büyük</button>
<button className="btn btn-primary btn-xl">Çok Büyük</button>
```

### Buton Şekilleri

```html
<button className="btn btn-primary btn-rounded">Yuvarlak</button>
<button className="btn btn-primary btn-pill">Hap Şekli</button>
<button className="btn btn-primary btn-square">Kare</button>
```

### Özel Buton Tipleri

```html
<!-- Form submit butonu -->
<button type="submit" className="btn btn-submit">Gönder</button>

<!-- Icon butonu -->
<button className="btn btn-icon">🔍</button>

<!-- Ghost buton -->
<button className="btn btn-ghost">Temiz Görünüm</button>

<!-- Full width buton -->
<button className="btn btn-primary btn-block">Tam Genişlik</button>

<!-- Navbar için contact butonu -->
<a href="/contact" className="btn btn-contact">
  İletişim <span>📧</span>
</a>

<!-- Banner için buton -->
<button className="btn btn-banner">Banner Buton</button>

<!-- Close butonu (Modal için) -->
<button className="btn btn-close">×</button>
```

### Loading State

```html
<button className="btn btn-primary btn-loading">Yükleniyor...</button>
```

### Disabled State

```html
<button className="btn btn-primary" disabled>Disabled</button>
```

## 📝 FORM KULLANIMI

### Temel Form Yapısı

```html
<form>
  <!-- Form grubu -->
  <div className="form-group">
    <label className="form-label">Etiket</label>
    <input type="text" className="form-input" />
  </div>

  <!-- Zorunlu alan -->
  <div className="form-group">
    <label className="form-label required">Zorunlu Alan</label>
    <input type="text" className="form-input" required />
  </div>

  <!-- Form satırı (yan yana alanlar) -->
  <div className="form-row">
    <div className="form-col">
      <label className="form-label">İsim</label>
      <input type="text" className="form-input" />
    </div>
    <div className="form-col">
      <label className="form-label">Soyisim</label>
      <input type="text" className="form-input" />
    </div>
  </div>
</form>
```

### Form Elemanları

```html
<!-- Text input -->
<input type="text" className="form-input" />

<!-- Email input -->
<input type="email" className="form-input" />

<!-- Password input -->
<input type="password" className="form-input" />

<!-- Textarea -->
<textarea className="form-input form-textarea"></textarea>

<!-- Select -->
<select className="form-input form-select">
  <option>Seçenek 1</option>
  <option>Seçenek 2</option>
</select>

<!-- Checkbox -->
<label className="form-checkbox">
  <input type="checkbox" />
  <span>Onay veriyorum</span>
</label>

<!-- Radio -->
<label className="form-radio">
  <input type="radio" name="option" />
  <span>Seçenek A</span>
</label>
```

### File Upload

```html
<div className="form-file">
  <input type="file" />
  <div className="form-file-label">
    📁 Dosya Seçin
  </div>
</div>
```

### Hata ve Başarı Mesajları

```html
<div className="form-group">
  <label className="form-label">E-mail</label>
  <input type="email" className="form-input error" />
  <small className="form-error">Geçerli bir e-mail adresi girin</small>
</div>

<div className="form-group">
  <label className="form-label">İsim</label>
  <input type="text" className="form-input success" />
  <small className="form-success">Başarılı!</small>
</div>

<div className="form-group">
  <label className="form-label">Telefon</label>
  <input type="tel" className="form-input" />
  <small className="form-help">Örnek: 0212 123 45 67</small>
</div>
```

### Form Boyutları

```html
<!-- Küçük form -->
<div className="form-sm">
  <input type="text" className="form-input" />
</div>

<!-- Büyük form -->
<div className="form-lg">
  <input type="text" className="form-input" />
</div>
```

### Form Bölümleri

```html
<div className="form-section">
  <h3 className="form-section-title">Kişisel Bilgiler</h3>
  
  <div className="form-group">
    <label className="form-label">İsim</label>
    <input type="text" className="form-input" />
  </div>
  
  <div className="form-group">
    <label className="form-label">Soyisim</label>
    <input type="text" className="form-input" />
  </div>
</div>
```

## 🎨 RENK PALETİ

Proje genelinde kullanılan ana renkler:

- **Primary Orange**: `#f68b1f` (Ana marka rengi)
- **Secondary Orange**: `#ee5c30` (Hover durumları)
- **Success Green**: `#28a745`
- **Danger Red**: `#dc3545`
- **Warning Yellow**: `#ffc107`
- **Gray Tones**: `#6c757d`, `#333`, `#666`, `#999`

## 📱 RESPONSİF TASARIM

Tüm buton ve form elemanları mobil cihazlarda da düzgün çalışacak şekilde tasarlanmıştır.

### Mobil İçin Özel Sınıflar

```html
<!-- Mobilde tam genişlik olacak buton -->
<button className="btn btn-primary btn-responsive">Mobilde Geniş</button>
```

## ♿ ERİŞİLEBİLİRLİK

- Tüm butonlar minimum 44px yüksekliğe sahiptir (dokunma hedefi)
- Focus state'leri tanımlanmıştır
- High contrast mode desteği vardır
- Reduced motion desteği vardır
- Semantic HTML kullanılmıştır

## 🔧 NASIL KULLANILIR

### 1. Mevcut Butonları Güncelleme

❌ **Eski kullanım:**
```html
<button className="submit-btn">Gönder</button>
<button className="delete-btn danger">Sil</button>
<button className="add-btn primary">Ekle</button>
```

✅ **Yeni kullanım:**
```html
<button className="btn btn-submit">Gönder</button>
<button className="btn btn-danger">Sil</button>
<button className="btn btn-primary">Ekle</button>
```

### 2. Mevcut Form Elemanlarını Güncelleme

❌ **Eski kullanım:**
```html
<input type="text" name="name" required />
<label>İsim</label>
```

✅ **Yeni kullanım:**
```html
<label className="form-label required">İsim</label>
<input type="text" name="name" className="form-input" required />
```

## 🚀 FAYDALar

1. **Tutarlılık**: Tüm projede aynı görsel tasarım
2. **Bakım Kolaylığı**: Tek yerden tüm buton stillerini yönetme
3. **Performans**: CSS duplikasyonu ortadan kaldırılması
4. **Erişilebilirlik**: Modern web standartlarına uyum
5. **Responsive**: Tüm cihazlarda çalışma
6. **Dark Mode Ready**: Gelecekteki dark mode desteği için hazır

## 📋 YAPILACAKLAR

- [ ] Tüm componentlerde eski buton sınıflarını yeni sistemle değiştirme
- [ ] Kullanılmayan CSS tanımlarını temizleme  
- [ ] Dark mode desteği ekleme
- [ ] Animation library entegrasyonu
- [ ] Storybook dökümantasyonu

## 🐛 SORUN GİDERME

### CSS Import Edilmemiş
Eğer stiller görünmüyorsa, `src/index.css` dosyasında import'ların olduğunu kontrol edin:

```css
@import './styles/buttons.css';
@import './styles/forms.css';
```

### Stil Çakışması
Eski CSS tanımları hala varsa, bunları kaldırın veya `!important` kullanarak yeni stilleri öncelik verin.

### Browser Cache
Değişiklikler görünmüyorsa browser cache'ini temizleyin.

---

Bu sistem sayesinde Karya Web projesi daha tutarlı, bakımı kolay ve profesyonel bir görünüme sahip olacaktır.

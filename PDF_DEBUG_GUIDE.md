## PDF Yükleme Problemi - Çözüm Rehberi

### 🔍 Uygulanan İyileştirmeler

#### 1. **PDF Özel Kontrolleri**
- ✅ PDF dosyaları için özel boyut kontrolü (50MB limit)
- ✅ PDF için boş dosya kontrolü
- ✅ PDF için özel MIME type kontrolü

#### 2. **API İyileştirmeleri**
- ✅ PDF için 10 dakika timeout (normal dosyalar 5 dakika)
- ✅ PDF için özel axios konfigürasyonu
- ✅ Detaylı hata logging ve debugging

#### 3. **Frontend İyileştirmeleri**
- ✅ PDF için özel progress tracking
- ✅ PDF test fonksiyonu (🧪 PDF Test butonu)
- ✅ Detaylı console logging
- ✅ Stack trace ile hata takibi

#### 4. **Debugging Araçları**
- ✅ Backend sağlık kontrolü (🔍 butonu)
- ✅ PDF test dosyası yükleme
- ✅ Detaylı network request logging

### 🧪 Test Etme Adımları

1. **PDF Test**: Modal'daki "🧪 PDF Test" butonuna tıklayın
2. **Backend Kontrol**: "🔍" butonuna tıklayın
3. **Gerçek PDF**: Küçük bir PDF dosyası ile test edin
4. **Console İzleme**: F12 → Console tab'ını açın

### 🐛 Hata Analizi

Tarayıcı konsolunda şu bilgileri arayın:

#### PDF Yükleme Başlangıcı:
```
🔍 Dosya seçildi: {isPDF: true, ...}
📄 PDF dosyası tespit edildi...
🚀 Upload başlıyor: {isPDF: true}
📄 PDF FormData oluşturuluyor...
```

#### API Request:
```
📤 Upload File API başlıyor...
📁 Dosya bilgileri: {isPDF: true, ...}
📄 PDF için özel konfigürasyon uygulanıyor...
⚙️ Request config: {...}
```

#### Başarılı Durumda:
```
✅ Upload başarılı: {status: 200, ...}
🆔 Upload başarılı, File ID: xxx
```

#### Hata Durumunda:
```
❌ Dosya yükleme hatası: {...}
📄 PDF yükleme hatası detayları: {...}
🔥 Final error: ...
```

### 🔧 Backend Kontrol Listesi

Backend'de şunları kontrol edin:

1. **CORS Ayarları**:
   ```csharp
   app.UseCors(policy => policy
       .AllowAnyOrigin()
       .AllowAnyMethod()
       .AllowAnyHeader());
   ```

2. **Dosya Boyutu Limiti**:
   ```csharp
   services.Configure<FormOptions>(options => {
       options.MultipartBodyLengthLimit = 50 * 1024 * 1024; // 50MB
   });
   ```

3. **Kestrel Limitleri**:
   ```csharp
   services.Configure<KestrelServerOptions>(options => {
       options.Limits.MaxRequestBodySize = 50 * 1024 * 1024;
   });
   ```

4. **IIS Limitleri** (web.config):
   ```xml
   <requestLimits maxAllowedContentLength="52428800" />
   ```

5. **PDF MIME Type Kontrolü**:
   ```csharp
   var allowedTypes = new[] { "application/pdf", "image/jpeg", ... };
   ```

### 🚨 Yaygın Problemler

1. **ERR_HTTP2_PROTOCOL_ERROR**: Kestrel HTTP/2 ayarları
2. **413 Request Entity Too Large**: Dosya boyutu limitleri
3. **415 Unsupported Media Type**: MIME type kontrolü
4. **Network Error**: CORS veya SSL sorunları
5. **Timeout**: Backend işlem süresi

### 💡 Sonraki Adımlar

Eğer problem devam ederse:

1. Konsol loglarını paylaşın
2. Network tab'daki request/response detaylarını kontrol edin
3. Backend loglarını inceleyin
4. PDF test butonuyla minimal test yapın

Bu iyileştirmeler ile PDF yükleme problemini çözebilmeli ve hangi noktada hata oluştuğunu net olarak görebilmelisiniz.

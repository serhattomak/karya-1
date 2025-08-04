/**
 * Migration Guide for Karya Web Project Refactoring
 * 
 * Bu dosya mevcut projeyi yeni refactored yapıya geçirmek için adım adım rehber sağlar.
 */

# Karya Web Projesi - Refactoring Migration Rehberi

## 🎯 Hedefler

1. **Kod Tekrarını Azaltma**: Ortak fonksiyonları utility'lere taşıma
2. **Tutarlılık**: API çağrıları ve state management için standart pattern'ler
3. **Type Safety**: Daha iyi error handling ve validation
4. **Performance**: Optimize edilmiş component re-rendering
5. **Maintainability**: Daha modüler ve test edilebilir kod

## 📁 Yeni Dosya Yapısı

```
src/
├── config/
│   └── constants.js          # Tüm sabitler
├── utils/
│   └── httpUtils.js          # HTTP yardımcı fonksiyonları
├── hooks/
│   └── index.js              # Custom React hooks
├── services/
│   └── apiService.js         # API service layer
├── components/
│   └── common/               # Ortak UI componentleri
│       ├── CommonComponents.js
│       └── CommonComponents.css
└── [existing structure]
```

## 🔄 Migration Adımları

### 1. Öncelikli Değişiklikler

#### A. Constants Kullanımı
```javascript
// ❌ Eski yöntem
const BASE_URL = "https://localhost:7103/";

// ✅ Yeni yöntem
import { API_CONFIG } from '../config/constants';
```

#### B. API Çağrıları
```javascript
// ❌ Eski yöntem
const response = await axios.get(`${API_URL}/api/Product`);
const data = response?.data?.data || response?.data || response;

// ✅ Yeni yöntem
import { productService } from '../services/apiService';
const data = await productService.getAll();
```

#### C. Loading State Management
```javascript
// ❌ Eski yöntem
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

// ✅ Yeni yöntem
import { useApi } from '../hooks';
const { data, loading, error, fetchData } = useApi(productService.getAll);
```

### 2. Component Migration Sırası

1. **Utility Functions** (config, utils, hooks)
2. **Common Components** (Loading, Error, Modal, etc.)
3. **API Services** (services/apiService.js)
4. **Page Components** (pages/)
5. **Admin Components** (admin/pages/)
6. **UI Components** (components/)

### 3. File-by-File Migration

#### HomePage.js
```javascript
// Before
import { getPageByName, getFile } from "../../api";

// After
import { pageService, fileService } from "../../services/apiService";
import { useApi } from "../../hooks";
import { Loading, ErrorMessage } from "../../components/common/CommonComponents";
```

#### ProductDetailPage.js
```javascript
// Before
const BASE_URL = "https://localhost:7103/";

// After
import { buildImageUrl } from "../../utils/httpUtils";
```

#### Admin Products
```javascript
// Before
const [loading, setLoading] = useState(true);
const [products, setProducts] = useState([]);

// After
const { data: products, loading, fetchData } = useApi(productService.getAll);
```

## 🛠️ Backward Compatibility

Migration sırasında uygulamanın çalışmaya devam etmesi için:

1. **api.js** dosyası koruma (legacy exports)
2. **Gradual migration** (dosya dosya geçiş)
3. **Legacy imports** geçici olarak destekleme

## ✅ Testing Strategy

Her migration adımından sonra:

1. **Functionality Test**: Tüm özellikler çalışıyor mu?
2. **Performance Test**: Loading süreleri iyileşti mi?
3. **Error Handling Test**: Hata senaryoları doğru çalışıyor mu?

## 🎨 UI Improvements

### Before vs After

#### Loading State
```javascript
// Before
{loading && <div>Yükleniyor...</div>}

// After
{loading && <Loading size="medium" />}
```

#### Error Handling
```javascript
// Before
{error && <div style={{color: 'red'}}>{error}</div>}

// After
{error && <ErrorMessage message={error} onRetry={retryFunction} />}
```

#### Pagination
```javascript
// Before
<div className="pagination">
  {/* Custom pagination JSX */}
</div>

// After
<Pagination
  currentPage={pagination.pageIndex}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

## 🔧 Development Guidelines

### 1. Hook Usage
```javascript
// API çağrıları için
const { data, loading, error, fetchData } = useApi(apiFunction);

// Form yönetimi için
const { values, errors, handleSubmit } = useForm(initialValues, validationSchema);

// Pagination için
const { pagination, goToPage, changePageSize } = usePagination();
```

### 2. Error Handling
```javascript
// Service layer'da otomatik error handling
try {
  const result = await productService.create(data);
  // Success handling
} catch (error) {
  // error.message zaten user-friendly
  showErrorMessage(error.message);
}
```

### 3. Image Handling
```javascript
// Image URL'leri için
const imageUrl = buildImageUrl(imagePath);
```

## 📊 Performance Benefits

1. **Reduced Bundle Size**: Ortak kod kullanımı
2. **Better Caching**: HTTP client interceptors
3. **Optimized Re-renders**: Custom hooks
4. **Error Boundary**: Centralized error handling

## 🚀 Next Steps

1. **Phase 1**: Core utilities ve services (1 hafta)
2. **Phase 2**: Admin components (1 hafta)
3. **Phase 3**: Public pages (1 hafta)
4. **Phase 4**: UI components (1 hafta)
5. **Phase 5**: Cleanup ve optimization (1 hafta)

## 📋 Checklist

- [ ] Constants refactored
- [ ] HTTP utilities implemented
- [ ] Custom hooks created
- [ ] API services refactored
- [ ] Common components created
- [ ] HomePage migrated
- [ ] Admin components migrated
- [ ] Error handling improved
- [ ] Performance optimized
- [ ] Documentation updated

## 🔍 Code Review Points

1. **No hardcoded URLs**
2. **Consistent error handling**
3. **Proper hook usage**
4. **Loading states**
5. **Responsive design**
6. **Accessibility**

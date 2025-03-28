# 🎓 Öğrenci ve Ders Yönetimi Sistemi

## 📋 Proje Hakkında
Bu proje, öğrenci ve ders yönetimini kapsayan kapsamlı bir web uygulamasıdır. Sistem, öğrencilerin derslere kaydolmasını, admin kullanıcıların öğrenci ve ders yönetimini yapmasını sağlayan modern bir platformdur.

## 👥 Kullanıcı Rolleri ve Yetkiler

### 👨‍💼 Admin Rolü
- ➕ Öğrenci ekleme, güncelleme ve silme
- 📚 Ders ekleme, güncelleme ve silme
- 🔄 Öğrenci-ders eşleştirmelerini yönetme
- 📊 Tüm öğrenci ve ders listelerini görüntüleme
- 📝 Sistem genelinde tam yetki

### 👨‍🎓 Öğrenci Rolü
- 📝 Kendi profilini görüntüleme ve güncelleme
- 📚 Mevcut derslere kayıt olma
- ❌ Kayıtlı derslerden çıkma
- 📋 Kendi ders kayıtlarını görüntüleme

## 🛡️ Validasyonlar ve İş Kuralları

### 👤 Kullanıcı Validasyonları (Admin & Öğrenci)
- 📧 Email adresi:
  - Benzersiz olmalıdır (aynı email ile birden fazla kayıt yapılamaz)
  - Geçerli email formatında olmalıdır
  - En fazla 100 karakter olabilir

- 🔐 Şifre:
  - En az 8 karakter olmalıdır
  - En az bir büyük harf içermelidir
  - En az bir küçük harf içermelidir
  - En az bir rakam içermelidir
  - En az bir özel karakter içermelidir
  - En fazla 100 karakter olabilir

- 👤 İsim ve Soyisim:
  - Boş bırakılamaz
  - Sadece boşluk karakteri içeremez
  - En fazla 50 karakter olabilir
  - String tipinde olmalıdır

### 📚 Ders Validasyonları
- 📝 Ders Adı:
  - Boş bırakılamaz
  - Sadece boşluk karakteri içeremez
  - String tipinde olmalıdır
  - Benzersiz olmalıdır (aynı isimde iki ders oluşturulamaz)

- 📄 Ders İçeriği:
  - Boş bırakılamaz
  - Sadece boşluk karakteri içeremez
  - String tipinde olmalıdır

### ⚡ İş Kuralları ve Kısıtlamalar
- 🚫 Admin kendisini silemez
- 🔒 Öğrenci sadece kendi profilini güncelleyebilir
- 📝 Öğrenci sadece kendi derslerini görüntüleyebilir
- ➕ Öğrenci aynı derse birden fazla kez kayıt olamaz
- ❌ Öğrenci sadece kayıtlı olduğu dersten çıkabilir
- 👮‍♂️ Admin tüm öğrenci ve dersleri yönetebilir
- 🔄 Admin öğrencileri derslere ekleyip çıkarabilir
- 📊 Admin tüm öğrenci-ders ilişkilerini görüntüleyebilir

## 🛠️ Kullanılan Teknolojiler
Frontend:
- ⚛️ React.js (v19.0.0)
- 🎨 TailwindCSS (v4.0.15)
- 🚀 Vite (v6.2.0)
- 📝 React Hook Form (v7.54.2)
- 🔍 Yup (v1.6.1)
- 🛣️ React Router DOM (v7.4.0)
- 🔄 Axios (v1.8.4)
- 🎯 Headless UI (v2.2.0)
- 🎨 Heroicons (v2.2.0)

## 🏗️ Proje Mimarisi
```
src/
├── assets/         # Statik dosyalar (resimler, ikonlar vb.)
├── components/     # Yeniden kullanılabilir UI bileşenleri
├── contexts/       # React context yapıları
├── pages/         # Sayfa bileşenleri
├── utils/         # Yardımcı fonksiyonlar
├── App.jsx        # Ana uygulama bileşeni
└── main.jsx       # Uygulama giriş noktası
```

## 📝 Projede Dikkat Edilen Noktalar
- Proje Vite ile oluşturulmuştur
- TailwindCSS ile stil yönetimi sağlanmaktadır
- React Hook Form ve Yup ile form validasyonları yapılmaktadır
- Axios ile API istekleri yönetilmektedir
- React Router ile sayfa yönlendirmeleri yapılmaktadır

## 🚀 Projeyi Çalıştırma

1. Gerekli paketlerin yüklenmesi:
```bash
npm install
```

2. Geliştirme sunucusunu başlatma:
```bash
npm run dev
```



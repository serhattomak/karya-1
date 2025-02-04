const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB'ye bağlan
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB'ye bağlandı!"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// Multer ile resim yükleme ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// **JSON dosyası ile Home Page verilerini saklama**
const dataFilePath = path.join(__dirname, "data.json");

// JSON dosyasından veriyi oku
const readData = () => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Veri okunurken hata oluştu:", error);
    return null;
  }
};

// JSON dosyasına veriyi yaz
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("✅ Veri başarıyla güncellendi.");
  } catch (error) {
    console.error("❌ Veri yazılırken hata oluştu:", error);
  }
};

// **🏠 Home Sayfası API'leri**
app.get("/api/home", (req, res) => {
  const data = readData();
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: "Veri okunamadı." });
  }
});

app.put("/api/home", upload.array("images", 4), (req, res) => {
  const newData = req.body;
  const currentData = readData();

  if (!currentData) {
    return res.status(500).json({ error: "Veri okunamadı." });
  }

  const updatedBoxes = newData.boxes.map((box, index) => {
    if (req.files && req.files[index]) {
      box.image = `http://localhost:5001/uploads/${req.files[index].filename}`;
    }
    return box;
  });

  try {
    const updatedData = {
      ...currentData,
      banner: {
        ...currentData.banner,
        ...newData.banner,
      },
      boxes: updatedBoxes,
    };

    writeData(updatedData);
    res.json({ message: "Veri başarıyla güncellendi." });
  } catch (error) {
    res.status(500).json({ error: "Veri güncellenirken hata oluştu." });
  }
});

// **🏠 Home için Resim Yükleme**
app.post("/api/home/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Resim yüklenemedi." });
  }

  const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// **📌 About Sayfası - MongoDB Model**
const AboutUs = require("./models/AboutUs");

// **📌 About Verisini Getir**
app.get("/api/about", async (req, res) => {
  try {
    const aboutus = await AboutUs.findOne();
    if (!aboutus) {
      return res.status(404).json({ message: "Hakkımızda verisi bulunamadı." });
    }
    res.json(aboutus);
  } catch (error) {
    console.error("Veri alınırken hata oluştu: ", error);
    res.status(500).json({ message: "Veri alınırken hata oluştu." });
  }
});

// **📌 About Verisini Güncelle**
app.put("/api/about", async (req, res) => {
  const { title, subtitle, content, image } = req.body;

  try {
    const updatedAboutUs = await AboutUs.findOneAndUpdate(
      {},
      { title, subtitle, content, image },
      { new: true, upsert: true } // Eğer veri yoksa oluştur
    );

    if (!updatedAboutUs) {
      return res.status(404).json({ message: "Hakkımızda verisi bulunamadı." });
    }

    res.json(updatedAboutUs);
  } catch (error) {
    console.error("Veri güncellenirken hata oluştu: ", error);
    res.status(500).json({ message: "Veri güncellenirken hata oluştu." });
  }
});

// **📌 About için Resim Yükleme**
app.post("/api/about/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Resim yüklenemedi." });
  }

  const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;

  // JSON verisini güncelleme işlemi
  const currentData = readData();
  if (!currentData) {
    return res.status(500).json({ error: "Veri okunamadı." });
  }

  // Yüklenen resmin URL'sini data.json dosyasına kaydet
  const updatedAboutData = {
    ...currentData,
    aboutUs: {
      ...currentData.aboutUs,
      image: imageUrl, // Yüklenen resmin URL'sini güncelle
    },
  };

  // JSON dosyasına yazma
  writeData(updatedAboutData);

  res.json({ imageUrl });
});

// **🚀 Sunucuyu Başlat**
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});

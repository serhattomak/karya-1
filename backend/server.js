// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const Home = require("./models/Home"); // MongoDB modelini dahil et
const AsilNunX = require("./models/Asilnunx");
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
    cb(null, "uploads/"); // Yükleme yapılacak klasör
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Dosya adı, benzersiz olması için zaman damgası ekleniyor
  },
});

const upload = multer({ storage: storage });

const dataFilePath = path.join(__dirname, "data.json");

// **🏠 Home Sayfası API'leri**
app.get("/api/home", async (req, res) => {
  try {
    const homeData = await Home.findOne();
    if (!homeData) {
      return res.status(404).json({ error: "Home verisi bulunamadı." });
    }
    res.json(homeData);
  } catch (error) {
    console.error("Veri alınırken hata oluştu:", error);
    res.status(500).json({ error: "Veri alınamadı." });
  }
});

app.put("/api/home", upload.array("images", 4), async (req, res) => {
  const { banner, boxes } = req.body;

  try {
    const updatedBoxes = boxes.map((box, index) => {
      if (req.files && req.files[index]) {
        box.image = `http://localhost:5001/uploads/${req.files[index].filename}`;
      }
      return box;
    });

    const updatedHome = await Home.findOneAndUpdate(
      {},
      { banner, boxes: updatedBoxes },
      { new: true, upsert: true }
    );

    res.json({ message: "Veri başarıyla güncellendi.", data: updatedHome });
  } catch (error) {
    console.error("Veri güncellenirken hata oluştu:", error);
    res.status(500).json({ error: "Veri güncellenirken hata oluştu." });
  }
});

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

const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("✅ Veri başarıyla güncellendi.");
  } catch (error) {
    console.error("❌ Veri yazılırken hata oluştu:", error);
  }
};

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



//** asil nun x sayfası  */
// AsilNunX Modeli dahil et

// **📌 AsilNunX Verisini Getir**
app.get("/api/asilnunx", async (req, res) => {
  try {
    const asilNunXData = await AsilNunX.findOne();
    if (!asilNunXData) {
      return res.status(404).json({ message: "Veri bulunamadı." });
    }
    res.json(asilNunXData);
  } catch (error) {
    console.error("Veri alınırken hata oluştu: ", error);
    res.status(500).json({ message: "Veri alınırken hata oluştu." });
  }
});

// **📌 AsilNunX Verisini Güncelle**
app.put("/api/asilnunx", upload.single("image"), async (req, res) => {
  const { title, description, details, info, text, linkText, link, documents } =
    req.body;
  let image = req.file
    ? `http://localhost:5001/uploads/${req.file.filename}`
    : req.body.image;

  try {
    const updatedAsilNunX = await AsilNunX.findOneAndUpdate(
      {},
      {
        title,
        description,
        details,
        info,
        text,
        linkText,
        link,
        documents,
        image,
      },
      { new: true, upsert: true }
    );

    res.json(updatedAsilNunX);
  } catch (error) {
    console.error("Veri güncellenirken hata oluştu: ", error);
    res.status(500).json({ message: "Veri güncellenirken hata oluştu." });
  }
});
app.put(
  "/api/asilnunx/upload-image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Resim yüklenmedi." });
      }

      console.log("Yüklenen dosya adı:", req.file.filename);

      const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;

      // Eski resmi bul ve sil
      const existingData = await AsilNunX.findOne({});
      if (existingData && existingData.image) {
        const oldImagePath = path.join(
          __dirname,
          "uploads",
          path.basename(existingData.image)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Eski resmi sil
          console.log("Eski resim silindi:", oldImagePath);
        }
      }

      // Yeni resmi kaydet
      const updatedAsilNunX = await AsilNunX.findOneAndUpdate(
        {},
        { $set: { image: imageUrl } }, // Sadece `image` alanını güncelle
        { new: true, upsert: true }
      );

      res.json({
        message: "Resim başarıyla güncellendi.",
        image: updatedAsilNunX.image,
      });
    } catch (error) {
      console.error("Resim yüklenirken hata oluştu:", error);
      res.status(500).json({ message: "Resim yüklenirken hata oluştu." });
    }
  }
);








// Resim yükleme işlemi için PUT veya POST kullanabilirsiniz
app.post("/api/asilnunx/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Hiçbir dosya seçilmedi.");
  }
  const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
  res.status(200).json({ image: imageUrl });
});

// **🚀 Sunucuyu Başlat**
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});





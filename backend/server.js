const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Kullanıcılar (örnek)
const users = [
  { username: "admin", password: "1234", id: 1 }, // Örnek kullanıcı
];

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Yükleme klasörü
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Benzersiz isim
  },
});

const upload = multer({ storage });

// JSON dosyasının yolu
const dataFilePath = path.join(__dirname, "data.json");

// Veriyi JSON dosyasından oku
const readData = () => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Veri okunurken hata oluştu:", error);
    return null;
  }
};

// Veriyi JSON dosyasına yaz
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("Veri başarıyla güncellendi.");
  } catch (error) {
    console.error("Veri yazılırken hata oluştu:", error);
  }
};

// GET endpoint
app.get("/api/home", (req, res) => {
  const data = readData();
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: "Veri okunamadı." });
  }
});

// PUT endpoint
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

// **Yeni endpoint burada ekleniyor**
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Resim yüklenemedi." });
  }

  const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
  res.json({ imageUrl }); // Resim URL'sini frontend'e döndürüyoruz
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});

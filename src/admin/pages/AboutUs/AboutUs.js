import React, { useEffect, useState, useRef } from "react";
import { getPageByName } from "../../../api";
import Swal from "sweetalert2";
import "./AboutUs.css";

const BASE_URL = "https://localhost:7103/";
const API_BASE_URL = "https://localhost:7103";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/File/upload`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Dosya yüklenemedi");
  return await response.json();
};

const AboutUs = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [titles, setTitles] = useState([""]);
  const [subtitles, setSubtitles] = useState([""]);
  const [descriptions, setDescriptions] = useState([""]);

  const [image, setImage] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");

  // { id, path } formatı
  const [availableImages, setAvailableImages] = useState([]);
  const [showImageSelector, setShowImageSelector] = useState(false);

  const [servicesTitle, setServicesTitle] = useState("Hizmetlerimiz");
  const [servicesList, setServicesList] = useState([""]);
  const [serviceGroups, setServiceGroups] = useState([
    { title: "Hizmetlerimiz", items: [""] },
  ]);

  // Galeri görselleri (id, url)
  const [applicationAreaImages, setApplicationAreaImages] = useState([
    null,
    null,
    null,
    null,
  ]);

  const [selectedFile, setSelectedFile] = useState(null); // Banner için dosya

  const [pageType, setPageType] = useState(0);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [urls, setUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([""]);

  // Ana görsel
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [mainImageId, setMainImageId] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImageName, setMainImageName] = useState("");
  const [showMainImageSelector, setShowMainImageSelector] = useState(false);

  const [showGalleryImageSelectorIndex, setShowGalleryImageSelector] =
    useState(null);

  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [productIds, setProductIds] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);

  const applicationFileInputRefs = useRef([]);
  const selectedApplicationImageIndexRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPageByName("Hakkımızda");
        const data = response?.data?.data || response?.data || response;

        setPageData(data);
        setTitles(data.titles?.length ? data.titles : [""]);
        setSubtitles(data.subtitles?.length ? data.subtitles : [""]);
        setDescriptions(data.descriptions?.length ? data.descriptions : [""]);

        setImage(data.bannerImageUrl || "");
        setBannerImageUrl(data.bannerImageUrl || "");

        setServicesTitle(
          data.listTitles?.length ? data.listTitles[0] : "Hizmetlerimiz"
        );
        setServicesList(data.listItems?.length ? data.listItems : [""]);

        if (data.titles && data.listItems) {
          const groups = [];
          const serviceStartIndex = data.titles.length > 0 ? 1 : 0;
          if (
            data.titles.length > serviceStartIndex &&
            data.listItems.length > 0
          ) {
            groups.push({
              title: data.titles[serviceStartIndex] || "Hizmetlerimiz",
              items: data.listItems.length > 0 ? data.listItems : [""],
            });
          } else {
            groups.push({ title: "Hizmetlerimiz", items: [""] });
          }
          setServiceGroups(groups);
        } else {
          setServiceGroups([{ title: "Hizmetlerimiz", items: [""] }]);
        }

        setPageType(typeof data.pageType !== "undefined" ? data.pageType : 0);
        setName(data.name || "Hakkımızda");
        setSlug(data.slug || "hakkimizda");
        setUrls(data.urls || []);
        setBackgroundImageUrl(data.backgroundImageUrl || "");
        setProductIds(data.productIds || []);
        setAdditionalFields(data.additionalFields || []);

        const computedMainUrl =
          data.mainImageUrl ||
          (data.mainImage?.path
            ? `${API_BASE_URL}/${data.mainImage.path}`
            : "");
        setMainImageUrl(computedMainUrl || "");
        setMainImageId(data.mainImageId || data.mainImage?.id || "");
        setMainImageName(data.mainImage?.name || "");
        setMainImagePreview("");

        let appImages = [null, null, null, null];
        if (Array.isArray(data.files)) {
          appImages = data.files.slice(0, 4).map((f) => ({
            id: f.id,
            url: f.path ? BASE_URL + f.path : "",
          }));
          while (appImages.length < 4) appImages.push(null);
        }
        setApplicationAreaImages(appImages);

        // /api/File -> {id, path}
        try {
          const imagesResponse = await fetch(`${API_BASE_URL}/api/File`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            const files = imagesData?.data || imagesData || [];
            const imageFiles = files
              .filter(
                (f) => f.contentType?.startsWith("image/") && f.path && f.id
              )
              .map((f) => ({ id: f.id, path: f.path }));
            setAvailableImages(imageFiles);
          } else {
            // Geliştirici/test fallback (fake guid + path)
            setAvailableImages([
              {
                id: "11111111-1111-1111-1111-111111111111",
                path: "uploads/1738834392185.webp",
              },
              {
                id: "22222222-2222-2222-2222-222222222222",
                path: "uploads/1738834413931.webp",
              },
              {
                id: "33333333-3333-3333-3333-333333333333",
                path: "uploads/1738834418863.webp",
              },
              {
                id: "44444444-4444-4444-4444-444444444444",
                path: "uploads/1738834423358.webp",
              },
              {
                id: "55555555-5555-5555-5555-555555555555",
                path: "uploads/1738835993151.jpeg",
              },
            ]);
          }
        } catch {
          setAvailableImages([
            {
              id: "11111111-1111-1111-1111-111111111111",
              path: "uploads/1738834392185.webp",
            },
            {
              id: "22222222-2222-2222-2222-222222222222",
              path: "uploads/1738834413931.webp",
            },
            {
              id: "33333333-3333-3333-3333-333333333333",
              path: "uploads/1738834418863.webp",
            },
            {
              id: "44444444-4444-4444-4444-444444444444",
              path: "uploads/1738834423358.webp",
            },
            {
              id: "55555555-5555-5555-5555-555555555555",
              path: "uploads/1738835993151.jpeg",
            },
          ]);
        }
      } catch (error) {
        console.error("Veri çekme hatası: ", error);
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Veriler yüklenirken bir hata oluştu.",
          confirmButtonText: "Tamam",
          confirmButtonColor: "#dc3545",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Banner upload (varsa)
    let uploadedBannerUrl = bannerImageUrl || null;
    if (selectedFile) {
      try {
        const uploaded = await uploadFile(selectedFile);
        uploadedBannerUrl = uploaded?.data?.path
          ? `${API_BASE_URL}/${uploaded.data.path}`
          : uploaded?.path
          ? `${API_BASE_URL}/${uploaded.path}`
          : uploaded?.url || uploaded?.imageUrl || uploadedBannerUrl;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Banner yüklenemedi.",
        });
        return;
      }
    }

    // 1-bis) Ana görsel upload (varsa)
    let uploadedMainImageUrl = mainImageUrl?.trim()
      ? mainImageUrl.trim()
      : null;
    let uploadedMainImageId = mainImageId || null;
    if (mainImageFile) {
      try {
        const uploaded = await uploadFile(mainImageFile);
        uploadedMainImageUrl = uploaded?.data?.path
          ? `${API_BASE_URL}/${uploaded.data.path}`
          : uploaded?.path
          ? `${API_BASE_URL}/${uploaded.path}`
          : uploaded?.url || uploaded?.imageUrl || uploadedMainImageUrl;
        uploadedMainImageId = uploaded?.data?.id || uploaded?.id || null;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Ana görsel yüklenemedi.",
        });
        return;
      }
    }

    // 2) Güvenli alanlar
    const safeName =
      typeof name === "string" && name.trim() ? name.trim() : "Hakkımızda";
    const safeSlug =
      typeof slug === "string" && slug.trim() ? slug.trim() : "hakkimizda";

    let safeTitles = Array.isArray(titles)
      ? titles
          .filter((t) => typeof t === "string" && t.trim())
          .map((t) => t.trim())
      : [];
    if (safeTitles.length === 0) safeTitles = ["Hakkımızda"];

    const safeSubtitles = Array.isArray(subtitles)
      ? subtitles
          .filter((s) => typeof s === "string" && s.trim())
          .map((s) => s.trim())
      : [];

    const safeDescriptions = Array.isArray(descriptions)
      ? descriptions
          .filter((d) => typeof d === "string" && d.trim())
          .map((d) => d.trim())
      : [];

    const safeListTitles =
      typeof servicesTitle === "string" && servicesTitle.trim()
        ? [servicesTitle.trim()]
        : [];

    const safeListItems = Array.isArray(servicesList)
      ? servicesList
          .filter((s) => typeof s === "string" && s.trim())
          .map((s) => s.trim())
      : [];

    const safeUrls = Array.isArray(urls)
      ? urls.filter(Boolean).map((u) => u.trim())
      : [];
    const safeVideoUrls = Array.isArray(videoUrls)
      ? videoUrls
          .filter((v) => typeof v === "string" && v.trim())
          .map((v) => v.trim())
      : [];

    const safeBackgroundImageUrl =
      typeof backgroundImageUrl === "string" && backgroundImageUrl.trim()
        ? backgroundImageUrl.trim()
        : null;

    // 3) UUID kontrolleri
    const uuidRe =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    const safeMainImageId =
      typeof uploadedMainImageId === "string" &&
      uuidRe.test(uploadedMainImageId)
        ? uploadedMainImageId
        : null;

    const safeFileIds = Array.isArray(applicationAreaImages)
      ? applicationAreaImages
          .map((x) => x?.id)
          .filter((id) => typeof id === "string" && uuidRe.test(id))
      : [];

    const safeProductIds = Array.isArray(productIds)
      ? productIds.filter((id) => typeof id === "string" && uuidRe.test(id))
      : [];

    const safeDocumentIds = [];
    const safeAdditionalFields = Array.isArray(additionalFields)
      ? additionalFields
          .filter((f) => typeof f === "string")
          .map((f) => f.trim())
      : [];

    // 4) Payload (KÖKTE)
    const payload = {
      id: pageData?.id || null,
      pageType: typeof pageType === "number" ? pageType : 0,
      name: safeName,
      slug: safeSlug,
      titles: safeTitles,
      subtitles: safeSubtitles,
      descriptions: safeDescriptions,
      listTitles: safeListTitles,
      listItems: safeListItems,
      urls: safeUrls,
      videoUrls: safeVideoUrls,
      backgroundImageUrl: safeBackgroundImageUrl,
      bannerImageUrl: uploadedBannerUrl || null,
      mainImageUrl: uploadedMainImageUrl,
      mainImageId: safeMainImageId,
      fileIds: safeFileIds,
      productIds: safeProductIds,
      documentIds: safeDocumentIds,
      additionalFields: safeAdditionalFields,
    };

    // 5) PUT çağrısı
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_BASE_URL}/api/Page`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${errorText}`);
      }

      // PUT sonrası GET ile doğrulama
      const getResp = await fetch(`${API_BASE_URL}/api/Page/${payload.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const after = getResp.ok ? await getResp.json() : null;
      const changed =
        after &&
        (after?.name !== safeName ||
          after?.slug !== safeSlug ||
          JSON.stringify(after?.titles || []) !== JSON.stringify(safeTitles) ||
          (after?.bannerImageUrl || null) !== (uploadedBannerUrl || null) ||
          (after?.mainImageUrl || null) !== (uploadedMainImageUrl || null) ||
          (after?.mainImageId || null) !== (safeMainImageId || null));

      if (!changed) {
        Swal.fire({
          icon: "warning",
          title: "Güncelleme uygulanmadı",
          html:
            "Sunucu 200 döndü fakat bazı alanlar değişmemiş görünüyor.<br/>" +
            "• ID’nin doğru olduğundan emin olun.<br/>" +
            "• Sunucu tarafında null/boş dizi eşleme kuralları veya koleksiyon ignore politikaları olabilir.",
          confirmButtonText: "Tamam",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Hakkımızda sayfası güncellendi.",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: err.message || "Güncelleme sırasında bir hata oluştu.",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleApplicationImageUpload = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      try {
        const uploaded = await uploadFile(file);
        const imageUrl = uploaded?.data?.path
          ? BASE_URL + uploaded.data.path
          : uploaded?.path
          ? BASE_URL + uploaded.path
          : "";
        const fileId = uploaded?.data?.id || uploaded?.id || null;

        setApplicationAreaImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[selectedApplicationImageIndexRef.current] = fileId
            ? { id: fileId, url: imageUrl }
            : null;
          return updatedImages;
        });

        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Görsel başarıyla yüklendi!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Görsel yüklenirken bir hata oluştu.",
          confirmButtonText: "Tamam",
          confirmButtonColor: "#dc3545",
        });
      }
    }
  };

  const triggerApplicationFileInput = (index) => {
    selectedApplicationImageIndexRef.current = index;
    applicationFileInputRefs.current[index]?.click();
  };

  const addTitle = () => setTitles([...titles, ""]);
  const updateTitle = (index, value) => {
    const updated = [...titles];
    updated[index] = value;
    setTitles(updated);
  };
  const removeTitle = (index) => {
    if (titles.length > 1) setTitles(titles.filter((_, i) => i !== index));
  };

  const addSubtitle = () => setSubtitles([...subtitles, ""]);
  const updateSubtitle = (index, value) => {
    const updated = [...subtitles];
    updated[index] = value;
    setSubtitles(updated);
  };
  const removeSubtitle = (index) => {
    if (subtitles.length > 1)
      setSubtitles(subtitles.filter((_, i) => i !== index));
  };

  const addDescription = () => setDescriptions([...descriptions, ""]);
  const updateDescription = (index, value) => {
    const updated = [...descriptions];
    updated[index] = value;
    setDescriptions(updated);
  };
  const removeDescription = (index) => {
    if (descriptions.length > 1)
      setDescriptions(descriptions.filter((_, i) => i !== index));
  };

  const addServiceGroup = () =>
    setServiceGroups([...serviceGroups, { title: "", items: [""] }]);
  const updateServiceGroupTitle = (groupIndex, value) => {
    const updated = [...serviceGroups];
    updated[groupIndex].title = value;
    setServiceGroups(updated);
  };
  const removeServiceGroup = (groupIndex) => {
    if (serviceGroups.length > 1)
      setServiceGroups(serviceGroups.filter((_, i) => i !== groupIndex));
  };
  const addServiceItem = (groupIndex) => {
    const updated = [...serviceGroups];
    updated[groupIndex].items.push("");
    setServiceGroups(updated);
  };
  const updateServiceItem = (groupIndex, itemIndex, value) => {
    const updated = [...serviceGroups];
    updated[groupIndex].items[itemIndex] = value;
    setServiceGroups(updated);
  };
  const removeServiceItem = (groupIndex, itemIndex) => {
    const updated = [...serviceGroups];
    if (updated[groupIndex].items.length > 1) {
      updated[groupIndex].items = updated[groupIndex].items.filter(
        (_, i) => i !== itemIndex
      );
      setServiceGroups(updated);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "bannerImageUrl") setBannerImageUrl(value);
  };

  const openImageSelector = () => setShowImageSelector(true);

  const selectImageFromSystem = (filePath) => {
    // filePath artık path değil; availableImages objesi gönderiyoruz, burası sadece banner seçimi için path bekliyor
    setBannerImageUrl(`${API_BASE_URL}/${filePath}`);
    setShowImageSelector(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // banner
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="AdminLoading">
          <div className="AdminLoadingSpinner"></div>
          <p>Hakkımızda sayfası yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="AdminSectionHeader">
        <h2 className="AdminPanelTitle">🏢 Hakkımızda Sayfası Yönetimi</h2>
        <p className="AdminPanelDescription">
          Şirket hakkında bilgileri, hizmetlerinizi ve galeri görsellerini
          düzenleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="AdminFormContainer">
        <div className="form-group">
          <label className="form-label">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="form-input"
            placeholder="Slug"
          />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">📝 Temel Bilgiler</h3>

          {/* Banner */}
          <div className="form-group">
            <label htmlFor="bannerImageUrl" className="form-label">
              Banner Görsel URL:
            </label>
            <input
              type="text"
              id="bannerImageUrl"
              name="bannerImageUrl"
              value={bannerImageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="Banner görsel URL'si girin"
            />

            <label className="form-label" style={{ marginTop: 15 }}>
              Veya Banner Resmi Yükle
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleFileChange}
            />
            {image && (
              <img
                className="AdminPreviewImage"
                src={image}
                alt="Önizleme"
                style={{ width: 150, marginTop: 10, borderRadius: 8 }}
              />
            )}

            <div className="AdminBannerImageOptions">
              <p className="form-helper-text" style={{ marginTop: 15 }}>
                Veya sistemden görsel seçin:
              </p>
              <button
                type="button"
                className="add-btn secondary"
                onClick={openImageSelector}
              >
                📁 Sistemden Görsel Seç
              </button>
            </div>

            {bannerImageUrl && (
              <div className="AdminSelectedImagePreview">
                <p className="form-helper-text">Seçili banner görseli:</p>
                <img
                  src={bannerImageUrl}
                  alt="Selected banner"
                  className="AdminPreviewImage"
                  style={{ width: 200, marginTop: 10, borderRadius: 8 }}
                />
              </div>
            )}
          </div>

          {/* Ana Görsel */}
          <div className="form-group">
            <label className="form-label">Ana Görsel</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                type="url"
                value={mainImageUrl}
                onChange={(e) => {
                  setMainImageUrl(e.target.value);
                  setMainImageId("");
                  setMainImagePreview(e.target.value);
                }}
                className="form-input"
                placeholder="Ana görsel URL'si girin veya dosya seçin"
              />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="main-image-file-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setMainImageFile(file);
                    setMainImageId("");
                    setMainImageName(file.name);
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setMainImagePreview(ev.target.result);
                      setMainImageUrl("");
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="main-image-file-input"
                className="file-select-btn"
                style={{ width: "fit-content" }}
              >
                <span>Dosya Seç</span>
              </label>
              <button
                type="button"
                className="file-select-btn"
                style={{ width: "fit-content" }}
                onClick={() => setShowMainImageSelector(true)}
              >
                Sistemden Seç
              </button>

              {(mainImagePreview || mainImageUrl) && (
                <div className="AdminSelectedFileInfo">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <img
                      src={mainImagePreview || mainImageUrl}
                      alt={mainImageName || "Ana görsel"}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                    <span>
                      {mainImagePreview
                        ? mainImageName
                        : mainImageName ||
                          (mainImageUrl?.split("/")?.pop() ?? "")}
                      {mainImageId ? ` • ID: ${mainImageId}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => {
                      setMainImageId("");
                      setMainImagePreview("");
                      setMainImageName("");
                      setMainImageFile(null);
                      setMainImageUrl("");
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Ana görsel sistem seçici */}
          {showMainImageSelector && (
            <div className="AdminFileSelectorModal">
              <div className="AdminFileSelectorContent">
                <div className="AdminFileSelectorHeader">
                  <h3>Ana Görsel Seç</h3>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => setShowMainImageSelector(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="AdminFileSelectorBody">
                  <div className="AdminFilesGrid">
                    {availableImages.map((file, idx) => (
                      <div
                        key={idx}
                        className="AdminFileItem"
                        onClick={() => {
                          setMainImageUrl(`${API_BASE_URL}/${file.path}`);
                          setMainImageId(file.id); // gerçek UUID
                          setMainImagePreview("");
                          setMainImageFile(null);
                          setMainImageName(file.path.split("/").pop());
                          setShowMainImageSelector(false);
                        }}
                      >
                        <img
                          src={`${API_BASE_URL}/${file.path}`}
                          alt={file.path.split("/").pop()}
                          style={{
                            width: "100%",
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                        <div
                          style={{
                            padding: 6,
                            fontSize: 12,
                            textAlign: "center",
                          }}
                        >
                          {file.path.split("/").pop()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Video URL'leri */}
          <div className="form-group">
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <label className="form-label">Video URL'leri:</label>
              <button
                type="button"
                onClick={() => setVideoUrls([...videoUrls, ""])}
                className="add-btn primary btn-sm"
              >
                + Video Ekle
              </button>
            </div>
            {videoUrls.map((url, index) => (
              <div
                key={index}
                className="AdminMultiFieldItem"
                style={{ display: "flex", gap: 10, marginBottom: 10 }}
              >
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const updated = [...videoUrls];
                    updated[index] = e.target.value;
                    setVideoUrls(updated);
                  }}
                  className="form-input"
                  placeholder={`Video URL ${index + 1}`}
                  style={{ flex: 1 }}
                />
                {videoUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setVideoUrls(videoUrls.filter((_, i) => i !== index))
                    }
                    className="btn btn-danger btn-sm"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Başlık / Alt başlık / Paragraflar */}
          <div className="form-group">
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <label className="form-label">Başlıklar:</label>
              <button
                type="button"
                onClick={addTitle}
                className="add-btn primary btn-sm"
              >
                + Başlık Ekle
              </button>
            </div>
            {titles.map((title, index) => (
              <div
                key={index}
                className="AdminMultiFieldItem"
                style={{ display: "flex", gap: 10, marginBottom: 10 }}
              >
                <input
                  type="text"
                  value={title}
                  onChange={(e) => updateTitle(index, e.target.value)}
                  className="form-input"
                  placeholder={`Başlık ${index + 1}`}
                  style={{ flex: 1 }}
                />
                {titles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTitle(index)}
                    className="btn btn-danger btn-sm"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="form-group">
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <label className="form-label">Alt Başlıklar:</label>
              <button
                type="button"
                onClick={addSubtitle}
                className="add-btn primary btn-sm"
              >
                + Alt Başlık Ekle
              </button>
            </div>
            {subtitles.map((subtitle, index) => (
              <div
                key={index}
                className="AdminMultiFieldItem"
                style={{ display: "flex", gap: 10, marginBottom: 10 }}
              >
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => updateSubtitle(index, e.target.value)}
                  className="form-input"
                  placeholder={`Alt Başlık ${index + 1}`}
                  style={{ flex: 1 }}
                />
                {subtitles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubtitle(index)}
                    className="btn btn-danger btn-sm"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="form-group">
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <label className="form-label">İçerik Paragrafları:</label>
              <button
                type="button"
                onClick={addDescription}
                className="add-btn primary btn-sm"
              >
                + Paragraf Ekle
              </button>
            </div>
            {descriptions.map((description, index) => (
              <div
                key={index}
                className="AdminMultiFieldItem"
                style={{ display: "flex", gap: 10, marginBottom: 10 }}
              >
                <textarea
                  value={description}
                  onChange={(e) => updateDescription(index, e.target.value)}
                  className="form-input form-textarea"
                  rows={4}
                  placeholder={`Paragraf ${index + 1}`}
                  style={{ flex: 1 }}
                />
                {descriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDescription(index)}
                    className="remove-btn danger btn-sm"
                    style={{ alignSelf: "flex-start" }}
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hizmetler */}
        <div className="form-section">
          <h3 className="form-section-title">🎯 Hizmetler Bölümü</h3>
          <div className="form-group AdminServiceSection">
            <label htmlFor="servicesTitle" className="form-label">
              Hizmetler Başlığı
            </label>
            <input
              type="text"
              id="servicesTitle"
              className="form-input"
              value={servicesTitle}
              onChange={(e) => setServicesTitle(e.target.value)}
              placeholder="Hizmet başlığını girin"
            />

            <label className="form-label">Hizmet Maddeleri</label>
            {servicesList.map((item, index) => (
              <div key={index} className="AdminServiceItemRowOld">
                <span className="AdminIndex">{index + 1}.</span>
                <input
                  type="text"
                  className="form-input"
                  value={item}
                  onChange={(e) => {
                    const updated = [...servicesList];
                    updated[index] = e.target.value;
                    setServicesList(updated);
                  }}
                  placeholder={`Madde ${index + 1}`}
                />
                <button
                  type="button"
                  className="remove-btn danger btn-sm"
                  onClick={() =>
                    setServicesList(servicesList.filter((_, i) => i !== index))
                  }
                  title="Sil"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-btn secondary"
              onClick={() => setServicesList([...servicesList, ""])}
            >
              + Yeni Madde Ekle
            </button>
          </div>
        </div>

        {/* Galeri */}
        <div className="form-section">
          <h3 className="form-section-title">🖼️ Galeri Görselleri</h3>
          <p className="form-help">En fazla 4 görsel yükleyebilirsiniz.</p>
          <div className="AdminGalleryGrid">
            {[0, 1, 2, 3].map((index) => {
              const imageObj = applicationAreaImages[index];
              return (
                <div key={index} className="AdminGalleryItem AdminImageBox">
                  {imageObj?.url ? (
                    <>
                      <img
                        src={imageObj.url}
                        alt={`Uygulama Alanı ${index + 1}`}
                        className="AdminImagePreviewSquare"
                      />
                      <div className="AdminImageOverlay">
                        <span
                          className="AdminEditIcon"
                          onClick={() => triggerApplicationFileInput(index)}
                          title="Resmi Değiştir"
                        >
                          ✏️
                        </span>
                        <span
                          className="AdminEditIcon"
                          style={{ marginLeft: 12 }}
                          onClick={() => setShowGalleryImageSelector(index)}
                          title="Sistemden Seç"
                        >
                          📁
                        </span>
                      </div>
                    </>
                  ) : (
                    <div
                      className="AdminImagePlaceholder"
                      onClick={() => triggerApplicationFileInput(index)}
                    >
                      <div className="AdminPlusIcon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </div>
                      <button
                        type="button"
                        className="file-select-btn"
                        style={{ marginTop: 8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowGalleryImageSelector(index);
                        }}
                      >
                        Sistemden Seç
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={(el) => (applicationFileInputRefs.current[index] = el)}
                    onChange={handleApplicationImageUpload}
                  />
                </div>
              );
            })}
          </div>

          {/* Galeri Sistem Seçici */}
          {showGalleryImageSelectorIndex !== null && (
            <div className="AdminFileSelectorModal">
              <div className="AdminFileSelectorContent">
                <div className="AdminFileSelectorHeader">
                  <h3>Galeri Görseli Seç</h3>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => setShowGalleryImageSelector(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="AdminFileSelectorBody">
                  <div className="AdminFilesGrid">
                    {availableImages.map((file, idx) => (
                      <div
                        key={idx}
                        className="AdminFileItem"
                        onClick={() => {
                          setApplicationAreaImages((prev) => {
                            const updated = [...prev];
                            updated[showGalleryImageSelectorIndex] = {
                              id: file.id, // gerçek UUID
                              url: `${API_BASE_URL}/${file.path}`,
                            };
                            return updated;
                          });
                          setShowGalleryImageSelector(null);
                        }}
                      >
                        <img
                          src={`${API_BASE_URL}/${file.path}`}
                          alt={file.path.split("/").pop()}
                          style={{
                            width: "100%",
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                        <div
                          style={{
                            padding: 6,
                            fontSize: 12,
                            textAlign: "center",
                          }}
                        >
                          {file.path.split("/").pop()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="AdminFormActions">
          <button type="submit" className="save-btn primary btn-lg">
            💾 Değişiklikleri Kaydet
          </button>
        </div>
      </form>

      {/* Banner için sistem seçim modalı */}
      {showImageSelector && (
        <div
          className="AdminModalOverlay"
          onClick={(e) => {
            if (e.target.className === "AdminModalOverlay")
              setShowImageSelector(false);
          }}
        >
          <div
            className="AdminModalContent"
            style={{ maxWidth: 800, maxHeight: "80vh", overflow: "auto" }}
          >
            <div className="AdminModalHeader">
              <h3>Sistemden Görsel Seç</h3>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setShowImageSelector(false)}
              >
                ×
              </button>
            </div>
            <div className="AdminModalBody">
              <div
                className="AdminFilesGrid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 15,
                  padding: 20,
                }}
              >
                {availableImages.map((file, index) => (
                  <div
                    key={index}
                    className="AdminFileItem"
                    onClick={() => {
                      setBannerImageUrl(`${API_BASE_URL}/${file.path}`);
                      setShowImageSelector(false);
                    }}
                    style={{
                      cursor: "pointer",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      backgroundColor: "#fff",
                    }}
                  >
                    <img
                      src={`${API_BASE_URL}/${file.path}`}
                      alt={`Görsel ${index + 1}`}
                      style={{ width: "100%", height: 120, objectFit: "cover" }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        padding: 8,
                        fontSize: 12,
                        textAlign: "center",
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      {file.path.split("/").pop()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;

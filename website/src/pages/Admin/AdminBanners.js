import { useEffect, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import "./Admin.css";

function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const { showToast } = useToast();

  const loadBanners = () => api.get("/banners").then((res) => setBanners(res.data));

  useEffect(() => {
    loadBanners();
  }, []);

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerFile) {
      showToast("Please select a banner image", "error");
      return;
    }
    const data = new FormData();
    data.append("image", bannerFile);
    try {
      await api.post("/banners", data, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Banner added successfully");
      setBannerFile(null);
      loadBanners();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add banner", "error");
    }
  };

  const handleBannerDelete = async (id) => {
    try {
      await api.delete(`/banners/${id}`);
      showToast("Banner deleted");
      loadBanners();
    } catch (err) {
      showToast("Failed to delete banner", "error");
    }
  };

  return (
    <div>
      <h2>Banners</h2>
      <form className="admin-form" onSubmit={handleBannerSubmit}>
        <h3>Add Home Page Banner Image</h3>
        <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} required />
        <button type="submit">Add Banner</button>
      </form>

      <h3>Current Banners</h3>
      <div className="admin-product-list">
        {banners.map((b) => (
          <div className="admin-product-row" key={b._id}>
            <img src={`http://localhost:5000${b.image}`} alt="Banner" />
            <button onClick={() => handleBannerDelete(b._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBanners;
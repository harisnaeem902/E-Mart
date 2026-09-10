import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import MyOrders from "./pages/MyOrders/MyOrders";
import Sale from "./pages/Sale/Sale";
import Search from "./pages/Search/Search";
import Wishlist from "./pages/Wishlist/Wishlist";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminOverview from "./pages/Admin/AdminOverview";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminBanners from "./pages/Admin/AdminBanners";
import AdminOrders from "./pages/Admin/AdminOrders";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/sale" element={<Sale />} />
                <Route path="/search" element={<Search />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />

                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminOverview />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
              </Routes>
              <Footer />
            </Router>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
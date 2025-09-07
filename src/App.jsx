import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import ProductManagement from './pages/admin/ProductManagement'
import CreateProduct from './pages/admin/CreateProduct'
import EditProduct from './pages/admin/EditProduct'
import UserManagement from './pages/admin/UserManagement'
import ManageOrders from './pages/admin/ManageOrders'
import MyOrders from './pages/MyOrders'
import OrderScreen from './pages/OrderScreen'
import OrderDetailAdmin from './pages/admin/OrderDetailAdmin'
import CheckoutPage from './pages/CheckoutPage'
import Products from './pages/Products'
import Profile from './pages/Profile'
import Categories from './pages/Categories'
import AdminRoute from './components/AdminRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-[#FFEFD5] text-gray-800">
        <Toaster position="top-center" reverseOrder={false} />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* Protected Customer Routes */}
            <Route path="" element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderScreen />} />
            </Route>
            {/* Admin Routes */}
            <Route path="" element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/products/new" element={<CreateProduct />} />
              <Route path="/admin/products/edit/:id" element={<EditProduct />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
              <Route path="/admin/orders/:id" element={<OrderDetailAdmin />} />
            </Route>
          </Routes>
        </main>
        <footer className="bg-gray-200 p-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} E-Store. All rights reserved.
        </footer>
      </div>
    </Router>
  )
}

export default App

import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"

const Adminlayout = lazy(() => import("./layout/Adminlayout"))
const Home = lazy(() => import("./page/Home"))
const Product = lazy(() => import("./page/Product"))
const ProductDetail = lazy(() => import("./components/template/ProductDetail"))
const Account = lazy(() => import("./page/Account"))
const MyOrder = lazy(() => import("./components/template/MyOrder"))
const Wallets = lazy(() => import("./components/theme/Wallets"))
const Address = lazy(() => import("./components/template/Address"))
const AccountDetail = lazy(() => import("./components/template/AccountDetail"))
const Contact = lazy(() => import("./page/Contact"))
const Signin = lazy(() => import("./components/auth/Signin"))
const Signup = lazy(() => import("./components/auth/Signup"))
const ForgetPS = lazy(() => import("./components/auth/ForgetPS"))
const AuthRedirect = lazy(() => import("./components/AuthRedirect"))
const RequireAuth = lazy(() => import("./components/RequireAuth"))
// This one used to be lazy(() => ("./components/BuyMethod.jsx")), which returns
// a string instead of a promise, so the route could never load.
const BuyMethod = lazy(() => import("./components/BuyMethod.jsx"))
const WelletMethod = lazy(() => import("./components/WelletMethod.jsx"))
const ProductStorePayment = lazy(() => import("./components/assets/ProductStorePayment.jsx"))
const Loading = lazy(() => import("./components/Loading.jsx"))

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Suspense fallback={<Loading/>}>
        <Routes>
          {/* Guest pages: bounce away if a session already exists. */}
          <Route path="/signin" element={<AuthRedirect><Signin/></AuthRedirect>} />
          <Route path="/signup" element={<AuthRedirect><Signup/></AuthRedirect>} />
          <Route path="/forgot" element={<AuthRedirect><ForgetPS/></AuthRedirect>} />

          {/* Payment routes are guarded: they must never render for a
              signed-out visitor. */}
          <Route path="/account/:id/method" element={<RequireAuth><BuyMethod /></RequireAuth>} />
          <Route path="/account/:id/methodProductStore" element={<RequireAuth><ProductStorePayment /></RequireAuth>} />
          <Route path="/account/wallets/account/walltes" element={<RequireAuth><WelletMethod/></RequireAuth>} />

          {/* Public browsing: no auth required. */}
          <Route path="/" element={<Adminlayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Product />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Account area: requires a session. */}
          <Route path="/account" element={<RequireAuth><Account /></RequireAuth>}>
            <Route index element={<MyOrder />} />
            <Route path="orderplace" element={<MyOrder />} />
            <Route path="wallets" element={<Wallets />} />
            <Route path="address" element={<Address />} />
            <Route path="detail" element={<AccountDetail />} />
          </Route>

          {/* Without this an unknown URL renders a blank page. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AuthWrapper } from "./components/auth/AuthWrapper";

// Manage Pages
import ManageCategories from "./pages/Manage/ManageCategories";
import ManageSubcategories from "./pages/Manage/ManageSubcategories";
import ManageVideos from "./pages/Manage/ManageVideos";
import ManageShorts from "./pages/Manage/ManageShorts";
import ViewUserReviews from "./pages/Manage/ViewUserReviews";
import AboutUs from "./pages/AboutUs/AboutUs";
import PrivacyPolicy from "./pages/AboutUs/PrivacyPolicy";
import TermsAndConditions from "./pages/AboutUs/TermsAndConditions";

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AuthWrapper>
            <Routes>
            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/overview" element={<Navigate to="/dashboard" replace />} />

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

          {/* Protected Dashboard Layout */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Manage Pages */}
            <Route path="/manage/categories" element={<ManageCategories />} />
            <Route path="/manage/subcategories" element={<ManageSubcategories />} />
            <Route path="/manage/videos" element={<ManageVideos />} />
            <Route path="/manage/shorts" element={<ManageShorts />} />
            <Route path="/manage/reviews" element={<ViewUserReviews />} />
            
            {/* About Us Page */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthWrapper>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

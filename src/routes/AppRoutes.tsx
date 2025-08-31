import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import NotFound from "../pages/NotFound";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const Profile = lazy(() => import("../pages/User/Profile"));
const Settings = lazy(() => import("../pages/User/Settings"));
const ChangePassword = lazy(() => import("../pages/User/ChangePassword"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Projects = lazy(() => import("../pages/Projects/Projects"));
const ProjectDetail = lazy(() => import("../pages/Projects/ProjectDetail"));
const CreateProject = lazy(() => import("../pages/Projects/Create"));
const EditProject = lazy(() => import("../pages/Projects/EditProject"));
const Explore = lazy(() => import("../pages/Explore"));
const AuthCallback = lazy(() => import("../pages/GitHub/AuthCallback"));
const ImportGitHubProjects = lazy(
  () => import("../pages/GitHub/ImportGitHubProjects")
);
const VerifyEmail = lazy(() => import("../pages/Auth/VerifyEmail"));
const VerificationSent = lazy(() => import("../pages/Auth/VerificationSent"));
const ResendVerification = lazy(
  () => import("../pages/Auth/ResendVerification")
);


function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verification-sent" element={<VerificationSent />} />
        <Route
          path="/auth/resend-verification"
          element={<ResendVerification />}
        />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/edit" element={<EditProject />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/password" element={<ChangePassword />} />
          <Route path="/auth/github/callback" element={<AuthCallback />} />
          <Route path="/import/github" element={<ImportGitHubProjects />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;

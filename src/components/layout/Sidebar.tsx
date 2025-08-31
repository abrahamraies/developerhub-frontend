import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  BookOpenIcon,
  CogIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Logo from "../ui/Logo";
import useAuthStore from "../../stores/authStore";
import Button from "../ui/Button";
import ArrowLeftEndOnRectangleIcon from "@heroicons/react/24/solid/ArrowLeftEndOnRectangleIcon";
import { getMe } from "../../api/auth";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useState } from "react";

const navigation = [
  { name: "Inicio", href: "/dashboard", icon: HomeIcon },
  { name: "Explorar", href: "/explore", icon: MagnifyingGlassIcon },
  { name: "Mis Proyectos", href: "/projects", icon: BookOpenIcon },
  { name: "Crear Proyecto", href: "/projects/create", icon: PlusCircleIcon },
  { name: "Perfil", href: "/profile", icon: UserIcon },
  { name: "Ajustes", href: "/settings", icon: CogIcon },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (userLoading) return <LoadingSpinner />;

  return (
    <>
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="cursor-pointer md:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-r border-white/20 dark:border-gray-700 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/20 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl text-gray-800 dark:text-white">
              DeveloperHub
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="cursor-pointer md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-white/20 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={
                user?.profileImageUrl ||
                `https://i.pravatar.cc/150?u=${user?.username}`
              }
              alt="Foto de perfil"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30 dark:ring-blue-400/30"
            />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/30 dark:ring-blue-400/30"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/20 dark:border-gray-700">
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="cursor-pointer w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
          >
            <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
            <span>Cerrar sesión</span>
          </Button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

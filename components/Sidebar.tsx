"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Tags,
  ShoppingBag,
  ScrollText,
  Images,
  Palette,
  Menu,
  User
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Categorias",
    icon: Tags,
    href: "/categories",
    color: "text-violet-500",
  },
  {
    label: "Marcas",
    icon: Tags,
    href: "/marcas",
    color: "text-violet-500",
  },
  {
    label: "Productos",
    icon: ShoppingBag,
    href: "/products",
    color: "text-pink-700",
  },
  {
    label: "Pedidos",
    icon: ScrollText,
    href: "/orders",
    color: "text-orange-500",
  },
  {
    label: "Usuarios", // Nueva ruta para los usuarios
    icon: User, // Icono de usuario
    href: "/user", // Ruta de la página de usuarios
    color: "text-purple-500", // Color para la opción de usuarios
  },
  {
    label: "Banners",
    icon: Images,
    href: "/banners",
    color: "text-green-500",
  },
  {
    label: "Colors",
    icon: Palette,
    href: "/colors",
    color: "text-blue-500",
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-white shadow-sm transition-all",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between p-3">
        {!isCollapsed && (
          <Link href="/" className="flex items-center">
            <img
              src="/Logo.jpg"
              alt="Logo"
              className="h-15 w-auto"
            />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex items-center p-3 text-sm font-medium rounded-lg transition",
              pathname === route.href
                ? "bg-gray-100 text-primary"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <route.icon className={cn("h-5 w-5", route.color)} />
            {!isCollapsed && (
              <span className="ml-3">{route.label}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

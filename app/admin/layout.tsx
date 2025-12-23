"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Package, FolderOpen, LogOut, Menu, X, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: session } = useSession();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/admin/dashboard",
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderOpen,
      current: pathname?.startsWith("/admin/categories"),
    },
    {
      name: "Instruments",
      href: "/admin/instruments",
      icon: Package,
      current: pathname?.startsWith("/admin/instruments"),
    },
    {
      name: "Clients",
      href: "/admin/clients",
      icon: Users,
      current: pathname?.startsWith("/admin/clients"),
    },
  ];

  return (
      <div className="flex h-screen bg-gray-100">
        {/* Mobile menu button */}
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-primary px-4 py-3 md:hidden">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded"
            />
            <h1 className="text-xl font-bold text-white">{session?.user?.name ?? "Admin Panel"}</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2 rounded-lg hover:bg-primary-light transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            sidebarCollapsed ? "md:w-20" : "md:w-64"
          } fixed inset-y-0 left-0 z-40 w-64 transform transition-all duration-300 ease-in-out md:relative md:translate-x-0`}
        >
          <div className="flex flex-col h-full bg-primary relative">
            <div className={`flex items-center gap-3 flex-shrink-0 h-[86px] border-b border-gray-300 ${sidebarCollapsed ? "justify-center px-2" : "px-4"}`}>
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="rounded"
              />
              {!sidebarCollapsed && (
                <h1 className="text-2xl font-bold text-white">{session?.user?.name ?? "Admin Panel"}</h1>
              )}
            </div>

            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex absolute -right-3 top-[43px] -translate-y-1/2 z-50 bg-primary text-white p-1.5 rounded-full hover:bg-primary-light transition-colors border-2 border-white shadow-lg"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            <nav className="flex-1 px-2 pt-4 pb-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`${
                      item.current
                        ? "bg-primary-light text-white"
                        : "text-white/80 hover:bg-primary-light hover:text-white"
                    } group flex items-center ${sidebarCollapsed ? "justify-center px-2" : "px-4"} py-3 text-sm font-medium rounded-lg transition-colors`}
                    title={sidebarCollapsed ? item.name : ""}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? "" : "mr-3"}`} />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
            <div className="flex-shrink-0 px-2 pb-4">
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className={`w-full text-white/80 hover:bg-primary-light hover:text-white group flex items-center ${sidebarCollapsed ? "justify-center px-2" : "px-4"} py-3 text-sm font-medium rounded-lg transition-colors`}
                title={sidebarCollapsed ? "Logout" : ""}
              >
                <LogOut className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? "" : "mr-3"}`} />
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top border line to connect with sidebar */}
          <div className="hidden md:block h-[86px] border-b border-gray-300 flex-shrink-0"></div>

          <main className="flex-1 relative overflow-y-auto focus:outline-none pt-16 md:pt-0 md:-mt-[86px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}

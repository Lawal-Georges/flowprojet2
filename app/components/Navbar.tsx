"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { FolderGit2, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { checkAndAddUser } from "../actions";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/general-projects", label: "Collaboration" },
    { href: "/", label: "Mes projets" },
    { href: "/analytics", label: "📊 Statistiques" },
  ];

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user?.fullName) {
      checkAndAddUser(user?.primaryEmailAddress?.emailAddress, user?.fullName);
    }
  }, [user]);

  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  const renderLinks = (classNames: string) =>
    navLinks.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className={`btn-sm ${classNames} ${isActiveLink(href) ? "btn-primary" : ""
          }`}
      >
        {label}
      </Link>
    ));

  return (
    // Seul le fond de la navbar est modifié (les boutons conservent leur style d'origine)
    <div className="border-b border-base-300 px-5 md:px-[10%] py-4 relative bg-gray-800/80 backdrop-blur-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-primary-content text-primary rounded-full p-2">
            <FolderGit2 className="w-6 h-6" />
          </div>

          <span className="ml-2 text-3xl font-bold text-white">
            Flow <span className="text-primary">Projet</span>
          </span>
        </div>

        <button
          className="btn w-fit btn-sm sm:hidden"
          title="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-4" />
        </button>

        <div className="hidden md:flex space-x-4 items-center">
          {renderLinks("btn")} {/* Les boutons gardent leur style original */}
          <UserButton />
        </div>
      </div>

      {/* Menu mobile - fond flouté mais boutons intacts */}
      <div
        className={`absolute top-0 w-full h-screen flex flex-col gap-2 p-4 transition-all duration-300 sm:hidden bg-gray-800/90 backdrop-blur-md z-50 ${menuOpen ? "left-0" : "-left-full"
          }`}
      >
        <div className="flex justify-between items-center">
          <UserButton />
          <button
            className="btn w-fit btn-sm"
            title="Close"
            onClick={() => setMenuOpen(false)}
          >
            <X className="w-4" />
          </button>
        </div>
        {renderLinks("btn w-full")} {/* Boutons pleine largeur mais style original */}
      </div>
    </div>
  );
};

export default Navbar;
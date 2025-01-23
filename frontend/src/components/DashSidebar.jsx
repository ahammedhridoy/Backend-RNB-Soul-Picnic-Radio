"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashSidebar = () => {
  const pathname = usePathname();

  const links = [
    { name: "Events", path: "/dashboard" },
    { name: "Users", path: "/dashboard/manage-user" },
    { name: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <nav className="p-4">
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className={`block px-4 py-2 rounded ${
                pathname === link.path ? "bg-gray-700" : "hover:bg-gray-600"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DashSidebar;

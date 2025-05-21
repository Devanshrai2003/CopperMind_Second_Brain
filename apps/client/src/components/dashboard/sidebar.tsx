import { RectangleStackIcon } from "@heroicons/react/24/solid";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  LinkIcon,
  PencilSquareIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const handleSidebarCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    {
      icon: <RectangleStackIcon className="size-6 text-color-black" />,
      name: "All",
    },
    {
      icon: <PencilSquareIcon className="size-6 text-color-black" />,
      name: "Notes",
    },
    {
      icon: <LinkIcon className="size-6 text-color-black" />,
      name: "Links",
    },
    {
      icon: <PhotoIcon className="size-6 text-color-black" />,
      name: "Images",
    },
  ];

  return (
    <aside
      className={`max-w-64 ${
        isCollapsed ? "w-64" : "w-16"
      } bg-bg-secondary border-r-2 border border-border-medium h-screen transition-all duration-300 ease-in-out relative hidden sm:block`}
    >
      <div className="flex justify-between items-center px-4 py-6 border-b-2 border-border-medium">
        {isCollapsed && (
          <h1 className="text-2xl font-bold font-sans-serif">Menu</h1>
        )}
        <button onClick={handleSidebarCollapse}>
          {isCollapsed ? (
            <ChevronDoubleLeftIcon className="size-6 text-color-black" />
          ) : (
            <ChevronDoubleRightIcon className="size-6 text-color-black" />
          )}
        </button>
      </div>
      <div className="py-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={`flex gap-4 items-center w-full py-4 pl-4 hover:bg-neutral-300 transition-all ${
                  isCollapsed ? "justify-start" : "space-x-3"
                }`}
              >
                <div>{item.icon}</div>
                {isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

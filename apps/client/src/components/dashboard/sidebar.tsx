import { RectangleStackIcon } from "@heroicons/react/24/solid";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  LinkIcon,
  PencilSquareIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useMemory } from "../../context/memory-context";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const handleSidebarCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { filterType, setFilterType } = useMemory();

  const menuItems = [
    {
      icon: <RectangleStackIcon className="size-6 text-color-black" />,
      name: "All",
      type: "all",
      onClick: () => setFilterType("all"),
    },
    {
      icon: <PencilSquareIcon className="size-6 text-color-black" />,
      name: "Notes",
      type: "note",
      onClick: () => setFilterType("note"),
    },
    {
      icon: <LinkIcon className="size-6 text-color-black" />,
      name: "Links",
      type: "link",
      onClick: () => setFilterType("link"),
    },
    {
      icon: <PhotoIcon className="size-6 text-color-black" />,
      name: "Images",
      type: "image",
      onClick: () => setFilterType("image"),
    },
  ];

  return (
    <aside
      className={`max-w-64 ${isCollapsed ? "w-64" : "w-16"}
      bg-bg-secondary border-r-2 border border-border-medium transition-all duration-300 ease-in-out relative hidden sm:block`}
    >
      <div className="flex justify-between items-center px-4 py-6 border-b-2 border-border-medium">
        {isCollapsed && (
          <h1 className="text-2xl font-bold font-sans-serif">Menu</h1>
        )}
        <button onClick={handleSidebarCollapse}>
          {isCollapsed ? (
            <ChevronDoubleLeftIcon className="size-6 text-color-black cursor-pointer" />
          ) : (
            <ChevronDoubleRightIcon className="size-6 text-color-black cursor-pointer" />
          )}
        </button>
      </div>
      <div className="py-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={`flex gap-4 items-center w-full py-4 pl-4 transition-all cursor-pointer ${
                  isCollapsed ? "justify-start" : "space-x-3"
                }
                ${
                  filterType === item.type
                    ? "bg-neutral-500 font-semibold"
                    : "hover:bg-neutral-300"
                }

                `}
                onClick={item.onClick}
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

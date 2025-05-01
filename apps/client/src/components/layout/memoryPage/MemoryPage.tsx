import { ReactNode } from "react";
import { Button } from "../../button";
import { PlusIcon } from "../../../icons/plus";
import { SearchIcon } from "../../../icons/search";
import { SidebarAllIcon } from "../../../icons/sidebarAll";
import { ImageIcon } from "../../../icons/image";
import { NoteIcon } from "../../../icons/note";
import { SidebarLinkIcon } from "../../../icons/sidebarLinkIcon";

export function MemoryPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 shadow flex flex-wrap md:justify-between justify-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-6 md:mb-4">
            CopperMind
          </h1>
        </div>
        <div className="flex">
          <Button
            text="Add Memory"
            startIcon={<PlusIcon />}
            variant="primary"
          ></Button>
          <div className="flex ml-12">
            <input
              className="border rounded-full mr-2 pl-2"
              placeholder="Search Memories"
              type="text"
            />
            <Button
              variant="secondary"
              startIcon={<SearchIcon />}
              text="Search"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 border overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 border-r overflow-y-auto flex-col justify-start shadow">
          <Button startIcon={<SidebarAllIcon />} text="All" variant="sidebar" />
          <Button
            startIcon={<SidebarLinkIcon />}
            text="Links"
            variant="sidebar"
          />
          <Button startIcon={<ImageIcon />} text="Images" variant="sidebar" />
          <Button startIcon={<NoteIcon />} text="Notes" variant="sidebar" />
        </div>
        {/* Main content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="min-h-screen flex flex-wrap items-start gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

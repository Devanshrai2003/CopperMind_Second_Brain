import { MemoryArea } from "../components/dashboard/memory-area";
import { Sidebar } from "../components/dashboard/sidebar";
import { MemoryProvider } from "../context/memory-context";

export function MemoryPage() {
  return (
    <div className="flex">
      <MemoryProvider>
        <Sidebar />
        <MemoryArea />
      </MemoryProvider>
    </div>
  );
}

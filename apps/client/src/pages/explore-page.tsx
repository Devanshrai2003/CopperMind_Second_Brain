import { ExploreArea } from "../components/dashboard/explore-area";
import { Sidebar } from "../components/dashboard/sidebar";
import { MemoryProvider } from "../context/memory-context";

export function ExplorePage() {
  return (
    <div className="flex">
      <MemoryProvider>
        <Sidebar />
        <ExploreArea />
      </MemoryProvider>
    </div>
  );
}

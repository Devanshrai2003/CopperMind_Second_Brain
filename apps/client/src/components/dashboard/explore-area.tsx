import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { Button } from "../common/button";
import { useEffect, useState } from "react";
import { Memory, useMemory } from "../../context/memory-context";
import { Loader } from "../common/loader";
import axios from "axios";
import { SharedMemoryCard } from "./shared-memory-card";

export function ExploreArea() {
  const [memories, setMemories] = useState<SharedMemory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<SharedMemory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const { filterType } = useMemory();

  const itemsPerPage = 6;

  interface SharedMemory extends Omit<Memory, "userId"> {
    user: {
      username: string;
    };
  }

  useEffect(() => {
    axios
      .get<SharedMemory[]>(
        `${import.meta.env.VITE_API_URL}/api/memories/shared-memories`
      )
      .then((res) => {
        setMemories(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching memories:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const query = searchTerm.toLowerCase();
    const filtered = memories
      .filter(
        (memory) =>
          memory.title.toLowerCase().includes(query) ||
          memory.description.toLowerCase().includes(query) ||
          memory.tags.some((tag) => tag.toLowerCase().includes(query))
      )
      .filter((memory) =>
        filterType === "all" ? true : memory.type === filterType
      );

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredMemories(sorted);
    setCurrentPage(1);
  }, [searchTerm, sortOrder, memories, filterType]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMemories = filteredMemories.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredMemories.length / itemsPerPage);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  if (loading) return <Loader />;

  return (
    <main className="h-fit w-full lg:px-38 bg-bg-primary">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col gap-8 lg:flex-row justify-center items-center mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search public memories..."
              className="w-full max-w-sm px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              startIcon={<MagnifyingGlassIcon className="size-6" />}
              text="Search"
              size="md"
              variant="primary"
            />
            {sortOrder === "asc" ? (
              <Button
                variant="secondary"
                size="md"
                text="Sort"
                endIcon={<ArrowUpIcon className="size-5 font-bold" />}
                onClick={toggleSortOrder}
              />
            ) : (
              <Button
                variant="secondary"
                size="md"
                text="Sort"
                endIcon={<ArrowDownIcon className="size-5 font-bold" />}
                onClick={toggleSortOrder}
              />
            )}
          </div>
        </div>

        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start gap-4">
          {paginatedMemories.map((memory) => (
            <SharedMemoryCard key={memory.id} {...memory} />
          ))}
        </div>
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="primary"
            size="md"
            startIcon={<ArrowLeftIcon className="size-6" />}
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
          />

          <span className="font-medium text-text-primary">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="primary"
            size="md"
            startIcon={<ArrowRightIcon className="size-6" />}
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
          />
        </div>
      </div>
    </main>
  );
}

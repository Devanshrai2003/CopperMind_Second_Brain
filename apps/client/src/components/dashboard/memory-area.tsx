import { MemoryCard } from "./memory-card";
import { Memory, useMemory } from "../../context/memory-context";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "../common/button";
import { useState } from "react";
import { AddMemoryModal } from "./add-memory-modal";
import { Loader } from "../common/loader";

export function MemoryArea() {
  const { state, deleteMemory, toggleShare, filterType } = useMemory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openMemoryModal = () => setIsModalOpen(true);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };

  const handleDeleteMemory = (memory: Memory) => {
    deleteMemory(memory.id);
  };

  const handleShareMemory = (memory: Memory) => {
    toggleShare(memory.id);
  };

  const closeModal = () => {
    setEditingMemory(null);
    setIsModalOpen(false);
  };

  const memories = state.memories
    .filter((memory) => {
      const query = searchTerm.toLowerCase();
      return (
        memory.title.toLowerCase().includes(query) ||
        memory.description.toLowerCase().includes(query) ||
        memory.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    })
    .filter((memory) => {
      return filterType === "all" || memory.type === filterType;
    });

  return (
    <main className="h-fit w-full bg-bg-primary">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search memories..."
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
          </div>
          <Button
            size="sm"
            variant="primary"
            text="Add Memory"
            startIcon={<PlusCircleIcon className="size-6" />}
            onClick={openMemoryModal}
          />
        </div>

        <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 sm:gir items-start gap-4">
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              {...memory}
              onEdit={() => handleEditMemory(memory)}
              onDelete={() => handleDeleteMemory(memory)}
              onShare={() => handleShareMemory(memory)}
            />
          ))}
        </div>
      </div>
      {state.isLoading && <Loader />}
      <AddMemoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingMemory || undefined}
      />
    </main>
  );
}

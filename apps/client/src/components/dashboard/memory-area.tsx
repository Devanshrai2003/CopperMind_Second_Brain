import { MemoryCard } from "./memory-card";
import { Memory, useMemory } from "../../context/memory-context";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "../common/button";
import { useState } from "react";
import { AddMemoryModal } from "./add-memory-modal";

export function MemoryArea() {
  const {
    state,
    // fetchMemories,
    deleteMemory,
    toggleShare,
    // uploadImage,
    // clearError,
  } = useMemory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openMemoryModal = () => setIsModalOpen(true);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

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

  const memories = state.memories;

  return (
    <main className="h-screen w-full bg-bg-primary">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search memories..."
              className="w-full max-w-sm px-4 py-2 border rounded-lg"
              // Add onChange={handleSearch} if needed
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

        <div className="min-h-screen grid grid-cols-12 items-start gap-4">
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
      <AddMemoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingMemory || undefined}
      />
    </main>
  );
}

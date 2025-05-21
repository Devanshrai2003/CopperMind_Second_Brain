import { useEffect, useState } from "react";
import { Modal } from "../common/modal";
import { Button } from "../common/button";
import { useMemory } from "../../context/memory-context";
import { MemoryType } from "../../context/memory-context";

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    type: MemoryType;
    tags: string[];
    url?: string;
  };
}

export function AddMemoryModal({
  isOpen,
  onClose,
  initialData,
}: AddMemoryModalProps) {
  const { addMemory, updateMemory } = useMemory();

  const isEditMode = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "note" as MemoryType,
    tags: "",
    url: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        type: initialData.type,
        tags: initialData.tags.join(", "),
        url: initialData.url || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "note",
        tags: "",
        url: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const payload = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      url: formData.url || undefined,
    };

    if (isEditMode && initialData?.id) {
      await updateMemory(initialData.id, payload);
    } else {
      await addMemory(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Memory" : "Add New Memory"}
    >
      <form className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="note">Note</option>
          <option value="link">Link</option>
          <option value="image">Image</option>
        </select>
        {(formData.type === "link" || formData.type === "image") && (
          <input
            type="text"
            name="url"
            placeholder="URL"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        )}
        <input
          type="text"
          name="tags"
          placeholder="Comma-separated tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <Button
          text={isEditMode ? "Update Memory" : "Create Memory"}
          size="md"
          variant="primary"
          onClick={handleSubmit}
        />
      </form>
    </Modal>
  );
}

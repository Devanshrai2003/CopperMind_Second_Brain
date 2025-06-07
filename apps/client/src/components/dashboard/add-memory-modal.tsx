import { useEffect, useState } from "react";
import { Modal } from "../common/modal";
import { Button } from "../common/button";
import { useMemory } from "../../context/memory-context";
import { MemoryType } from "../../context/memory-context";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/16/solid";

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
  const { addMemory, updateMemory, uploadImage } = useMemory();

  const isEditMode = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "note" as MemoryType,
    tags: "",
    url: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "note",
      tags: "",
      url: "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadError("");
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        type: initialData.type,
        tags: initialData.tags.join(", "),
        url: initialData.url || "",
      });

      if (initialData.type === "image" && initialData.url) {
        setPreviewUrl(initialData.url);
      }
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "type" && value !== "image") {
      setSelectedFile(null);
      setPreviewUrl("");
      setFormData((prev) => ({ ...prev, url: "" }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    //5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setUploadError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setFormData((prev) => ({ ...prev, type: "image" }));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, url: "" }));
    setUploadError("");
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.url;

      if (selectedFile && formData.type === "image") {
        setIsUploading(true);
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (error) {
          setUploadError("Failed to upload image. Please try again.");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        url: imageUrl || undefined,
      };

      if (isEditMode && initialData?.id) {
        await updateMemory(initialData.id, payload);
      } else {
        await addMemory(payload);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving memory:", error);
    }
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
        {formData.type === "image" && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>

            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Choose Image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  variant="delete"
                  size="sm"
                  onClick={handleRemoveImage}
                  startIcon={<XMarkIcon className="h-4 w-4" />}
                />
                <div className="mt-2 text-center">
                  <label
                    htmlFor="image-replace"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                  >
                    Replace image
                  </label>
                  <input
                    id="image-replace"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <p className="text-sm text-error-600">{uploadError}</p>
            )}
          </div>
        )}

        {formData.type === "link" && (
          <input
            type="url"
            name="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}

        <input
          type="text"
          name="tags"
          placeholder="Comma-separated tags (e.g., work, personal, inspiration)"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex gap-3 pt-4">
          <Button
            text="Cancel"
            size="sm"
            variant="secondary"
            onClick={onClose}
            disabled={isUploading}
          />
          <Button
            text={
              isUploading
                ? "Uploading..."
                : isEditMode
                ? "Update Memory"
                : "Create Memory"
            }
            size="sm"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </Modal>
  );
}

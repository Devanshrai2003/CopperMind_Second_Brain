// /src/context/MemoryContext.tsx

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export type MemoryType = "link" | "image" | "note";

export interface Memory {
  id: string;
  title: string;
  type: MemoryType;
  tags: string[];
  description: string;
  url?: string;
  shared: boolean;
  createdAt: string;
  userId: string;
}

export interface MemoryInput {
  title: string;
  type: MemoryType;
  tags: string[];
  description: string;
  url?: string;
  shared?: boolean;
}

interface MemoryState {
  memories: Memory[];
  isLoading: boolean;
  error: string | null;
}

interface MemoryResponse {
  memory: Memory;
  message?: string;
}

interface MemoriesResponse {
  memories: Memory[];
  message?: string;
}

interface ImageUploadResponse {
  url: string;
  message?: string;
}

type MemoryAction =
  | { type: "FETCH_MEMORIES_START" }
  | { type: "FETCH_MEMORIES_SUCCESS"; payload: Memory[] }
  | { type: "FETCH_MEMORIES_ERROR"; payload: string }
  | { type: "ADD_MEMORY_START" }
  | { type: "ADD_MEMORY_SUCCESS"; payload: Memory }
  | { type: "ADD_MEMORY_ERROR"; payload: string }
  | { type: "UPDATE_MEMORY_START" }
  | { type: "UPDATE_MEMORY_SUCCESS"; payload: Memory }
  | { type: "UPDATE_MEMORY_ERROR"; payload: string }
  | { type: "DELETE_MEMORY_START" }
  | { type: "DELETE_MEMORY_SUCCESS"; payload: string }
  | { type: "DELETE_MEMORY_ERROR"; payload: string }
  | { type: "TOGGLE_SHARE_START" }
  | { type: "TOGGLE_SHARE_SUCCESS"; payload: Memory }
  | { type: "TOGGLE_SHARE_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

interface MemoryContextType {
  state: MemoryState;
  fetchMemories: () => Promise<void>;
  addMemory: (memoryData: MemoryInput) => Promise<void>;
  updateMemory: (id: string, memoryData: Partial<MemoryInput>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  toggleShare: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>; // because we get an image url back
  clearError: () => void;
}

const initialState: MemoryState = {
  memories: [],
  isLoading: false,
  error: null,
};

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

const memoryReducer = (
  state: MemoryState,
  action: MemoryAction
): MemoryState => {
  switch (action.type) {
    case "FETCH_MEMORIES_START":
    case "ADD_MEMORY_START":
    case "UPDATE_MEMORY_START":
    case "DELETE_MEMORY_START":
    case "TOGGLE_SHARE_START":
      return { ...state, isLoading: true };

    case "FETCH_MEMORIES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        memories: action.payload,
        error: null,
      };

    case "ADD_MEMORY_SUCCESS":
      return {
        ...state,
        isLoading: false,
        memories: [action.payload, ...state.memories],
        error: null,
      };

    case "UPDATE_MEMORY_SUCCESS":
    case "TOGGLE_SHARE_SUCCESS":
      return {
        ...state,
        isLoading: false,
        memories: state.memories.map((memory) =>
          memory.id === action.payload.id ? action.payload : memory
        ),
        error: null,
      };

    case "DELETE_MEMORY_SUCCESS":
      return {
        ...state,
        isLoading: false,
        memories: state.memories.filter(
          (memory) => memory.id !== action.payload
        ),
        error: null,
      };

    case "FETCH_MEMORIES_ERROR":
    case "ADD_MEMORY_ERROR":
    case "UPDATE_MEMORY_ERROR":
    case "DELETE_MEMORY_ERROR":
    case "TOGGLE_SHARE_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

interface MemoryProviderProps {
  children: ReactNode;
}

export const MemoryProvider: React.FC<MemoryProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(memoryReducer, initialState);

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/memories`,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  const fetchMemories = async () => {
    dispatch({ type: "FETCH_MEMORIES_START" });
    try {
      const response = await api.get<MemoriesResponse>("/get-memories");
      dispatch({
        type: "FETCH_MEMORIES_SUCCESS",
        payload: response.data.memories,
      });
    } catch (error) {
      console.error("Failed to fetch memories:", error);
      dispatch({
        type: "FETCH_MEMORIES_ERROR",
        payload: "Failed to fetch memories. Please try again.",
      });
    }
  };

  // Add a new memory
  const addMemory = async (memoryData: MemoryInput) => {
    dispatch({ type: "ADD_MEMORY_START" });
    try {
      const response = await api.post<MemoryResponse>(
        "/add-memory",
        memoryData
      );
      dispatch({ type: "ADD_MEMORY_SUCCESS", payload: response.data.memory });
    } catch (error) {
      console.error("Failed to add memory:", error);
      dispatch({
        type: "ADD_MEMORY_ERROR",
        payload: "Failed to add memory. Please try again.",
      });
    }
  };

  const updateMemory = async (id: string, memoryData: Partial<MemoryInput>) => {
    dispatch({ type: "UPDATE_MEMORY_START" });
    try {
      const response = await api.put<MemoryResponse>(
        `/update-memory/${id}`,
        memoryData
      );
      dispatch({
        type: "UPDATE_MEMORY_SUCCESS",
        payload: response.data.memory,
      });
    } catch (error) {
      console.error("Failed to update memory:", error);
      dispatch({
        type: "UPDATE_MEMORY_ERROR",
        payload: "Failed to update memory. Please try again.",
      });
    }
  };

  const deleteMemory = async (id: string) => {
    dispatch({ type: "DELETE_MEMORY_START" });
    try {
      await api.delete(`/delete-memory/${id}`);
      dispatch({ type: "DELETE_MEMORY_SUCCESS", payload: id });
    } catch (error) {
      console.error("Failed to delete memory:", error);
      dispatch({
        type: "DELETE_MEMORY_ERROR",
        payload: "Failed to delete memory. Please try again.",
      });
    }
  };

  const toggleShare = async (id: string) => {
    dispatch({ type: "TOGGLE_SHARE_START" });
    try {
      const response = await api.patch<MemoryResponse>(`/toggle-share/${id}`);
      dispatch({ type: "TOGGLE_SHARE_SUCCESS", payload: response.data.memory });
    } catch (error) {
      console.error("Failed to toggle share status:", error);
      dispatch({
        type: "TOGGLE_SHARE_ERROR",
        payload: "Failed to update sharing status. Please try again.",
      });
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post<ImageUploadResponse>(
        "/add-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.url;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const value = {
    state,
    fetchMemories,
    addMemory,
    updateMemory,
    deleteMemory,
    toggleShare,
    uploadImage,
    clearError,
  };

  return (
    <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
  );
};

export const useMemory = (): MemoryContextType => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error("useMemory must be used within a MemoryProvider");
  }
  return context;
};

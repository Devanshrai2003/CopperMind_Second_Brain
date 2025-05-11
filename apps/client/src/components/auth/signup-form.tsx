import { ChangeEvent, useState } from "react";
import axios from "axios";

import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/16/solid";

interface SignUpFormProps {
  onSubmit?: (data: SignUpData) => void;
  onGuestLogin?: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export function SignUpForm({
  onSubmit,
  onGuestLogin,
  onSuccess,
  isLoading: externalLoading = false,
}: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignUpData>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name as keyof SignUpData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpData> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
        formData,
        { withCredentials: true }
      );

      if (onSubmit) {
        onSubmit(formData);
      }

      if (response.data && response.status === 201) {
        console.log("Signup success", response.data);

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error("Error sending backend request", error);
      setApiError(
        error.response?.data?.message ||
          "Signup failed. This email or username may already be taken."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="p-3 bg-red-100 border border-red-400 text-text-error rounded-lg">
            {apiError}
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-text-primary mb-1"
          >
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-primary">
              <UserIcon className="size-6 text-gray-400" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.username ? "border-red-600" : "border-border-medium"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-copper-1000`}
              placeholder="Your username"
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-text-error">{errors.username}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary mb-1"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-primary">
              <EnvelopeIcon className="size-6 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.email ? "border-red-600" : "border-border-medium"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-copper-1000`}
              placeholder="your.email@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-text-error">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm text-text-primary font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-primary">
              <LockClosedIcon className="size-6 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border ${
                errors.password ? "border-red-600" : "border-border-medium"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-copper-1000`}
              placeholder="Create a password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-primary
 hover:text-amber-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="size-6 text-gray-400" />
              ) : (
                <EyeIcon className="size-6 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-text-error">{errors.password}</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || externalLoading}
            className="w-full bg-accent-600 hover:bg-accent-700 cursor-pointer text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading || externalLoading ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-border-medium rounded-full animate-spin mr-2" />
            ) : null}
            Create Account
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-dark"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-bg-primary text-text-primary">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onGuestLogin}
            className="w-full border border-border-medium cursor-pointer hover:bg-neutral-100 py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAuth } from "../../context/auth-context";
import {
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/16/solid";

export function UserDropdown({
  defaultAvatar = "./assets/icon-7797704_1280.png",
}: {
  defaultAvatar?: string;
}) {
  const { user, logout } = useAuth();
  const avatarSrc = user?.avatar || defaultAvatar;

  return (
    <Menu>
      <MenuButton>
        {" "}
        <img
          className="rounded-full hover:opacity-80 active:opacity-70 transition-all cursor-pointer"
          src={avatarSrc}
          alt="User Profile"
          width={42}
          height={42}
        />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-neutral-100 bg-neutral-100 p-1 text-sm/6 text-neutral-950 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 mt-6"
      >
        <MenuItem>
          <div className="flex gap-2">
            <UserIcon className="size-6 fill-neutral-950" />
            You are signed in as: {user?.username}
          </div>
        </MenuItem>
        <div className="my-1 h-px bg-neutral-400" />
        <MenuItem>
          <button
            onClick={logout}
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-text-error data-focus:bg-neutral-100 cursor-pointer"
          >
            <ArrowRightStartOnRectangleIcon className="size-5" />
            Log Out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

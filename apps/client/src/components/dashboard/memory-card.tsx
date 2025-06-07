import { InstagramEmbed, XEmbed } from "react-social-media-embed";

import {
  TrashIcon,
  PencilIcon,
  ShareIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/16/solid";
import { Button } from "../common/button";

interface MemoryCardProps {
  title: string;
  type: "link" | "image" | "note";
  tags: string[];
  description: string;
  createdAt: string;
  url?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export function MemoryCard({
  title,
  type,
  tags,
  description,
  createdAt,
  url,
  onEdit,
  onDelete,
  onShare,
}: MemoryCardProps) {
  return (
    <div className="w-full max-w-sm mx-auto bg-bg-tertiary rounded-xl shadow-md overflow-hidden border-2 border-border-dark p-4 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition">
      {type === "link" && url ? (
        <div className="aspect-video h-auto border-2 border-border-dark rounded-xl flex justify-center items-center">
          {renderMedia(type, url)}
        </div>
      ) : null}

      {type === "image" && url ? (
        <div className="h-auto border-2 rounded-xl flex justify-center items-center">
          <img src={url} />
        </div>
      ) : (
        ""
      )}
      <a href={url} target="_blank" rel="noopener noreferrer">
        <h1 className="font-semibold text-start text-text-primary text-lg flex items-center hover:underline truncate">
          <ChevronDoubleRightIcon className="size-6" />
          {title}
        </h1>
      </a>
      <p className="text-left text-sm sm:text-md text-text-secondary pb-2">
        {description}
      </p>
      <div className="flex flex-row justify-between">
        <p className="text-left text-sm sm:text-md text-text-secondary ">
          {createdAt}
        </p>
        <div className="flex flex-row justify-end items-center gap-2">
          <Button
            size="sm"
            startIcon={<ShareIcon className="size-4 text-primary-950" />}
            variant="card"
            onClick={onShare}
          />
          <Button
            size="sm"
            startIcon={<PencilIcon className="size-4 text-primary-950" />}
            variant="card"
            onClick={onEdit}
          />
          <Button
            size="sm"
            startIcon={<TrashIcon className="size-4 text-primary-950" />}
            variant="card"
            onClick={onDelete}
          />
        </div>
      </div>
      <div className=" flex flex-wrap gap-2 text-xs">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs sm:text-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full mr-2 border"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function renderMedia(type: string, url?: string) {
  if (!url) {
    return null;
  }

  if (type === "link" && url.includes("youtube.com")) {
    const videoId = new URL(url).searchParams.get("v");
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full aspect-video rounded-lg"
      ></iframe>
    );
  }

  if (type === "link" && url.includes("x.com")) {
    return (
      <div className="w-full h-auto max-w-full flex justify-center">
        <XEmbed url={url.replace("x.com", "twitter.com")} className="w-full" />
      </div>
    );
  }

  if (type === "link" && url.includes("instagram.com")) {
    return (
      <div className="w-full h-auto max-w-full flex bg-white rounded-lg justify-center">
        <InstagramEmbed url={url} width={328} className="mt-3" />
      </div>
    );
  }

  if (type) {
    return (
      <div className="w-full h-full max-w-full flex bg-white rounded-lg justify-center">
        <iframe
          src={url}
          className="w-full h-full rounded-lg border-none"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    );
  }
}

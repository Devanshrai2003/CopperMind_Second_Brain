import { useEffect } from "react";
import { DeleteIcon } from "../icons/delete";
import { EditIcon } from "../icons/edit";
import { ShareIcon } from "../icons/share";
import { Button } from "./button";
import { BulletPoint } from "../icons/bulletPoint";

interface MemoryCardProps {
  title: string;
  type: "link" | "image" | "note";
  tags: string[];
  description: string;
  createdAt: string;
  url?: string;
}

export function MemoryCard({
  title,
  type,
  tags,
  description,
  createdAt,
  url,
}: MemoryCardProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    if (type === "link" && url?.includes("x.com") && window?.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, [type, url]);

  return (
    <div className="w-full max-w-sm mx-auto rounded-xl shadow-md overflow-hidden border p-4 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition">
      {type === "link" && url ? (
        <div className="aspect-video h-auto border-2 rounded-xl flex justify-center items-center">
          {renderMedia(type, url)}
        </div>
      ) : (
        ""
      )}
      <a href={url} target="_blank" rel="noopener noreferrer">
        <h1 className="font-semibold text-start text-lg flex items-center hover:underline truncate">
          <BulletPoint />
          {title}
        </h1>
      </a>
      <p className="text-left text-sm sm:text-md pb-2">{description}</p>
      <div className="flex flex-row justify-between">
        <p className="text-left text-sm sm:text-md ">{createdAt}</p>
        <div className="flex flex-row justify-end items-center gap-2">
          <Button startIcon={<ShareIcon />} variant="card" />
          <Button startIcon={<EditIcon />} variant="card" />
          <Button startIcon={<DeleteIcon />} variant="delete" />
        </div>
      </div>
      <div className=" flex flex-wrap gap-2 text-xs">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs sm:text-sm px-2 py-0.5 rounded-full mr-2 border"
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
      <blockquote className="twitter-tweet w-full h-auto max-w-full">
        <a href={url.replace("x.com", "twitter.com")}></a>
      </blockquote>
    );
  }

  if (type) return null;
}

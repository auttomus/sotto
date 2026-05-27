import * as React from "react";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

interface DeletedMessageTombstoneProps {
  msg: any;
  isMine: boolean;
  recipientAvatar?: string | null;
}

export function DeletedMessageTombstone({
  msg,
  isMine,
  recipientAvatar,
}: DeletedMessageTombstoneProps) {
  return (
    <div className={`flex gap-2 max-w-[85%] ${isMine ? "self-end flex-row-reverse" : ""} animate-fade-in`}>
      {!isMine && (
        <Avatar
          src={recipientAvatar ? resolveMediaUrl(recipientAvatar) : ""}
          size="sm"
          className="mt-auto shrink-0 h-6 w-6"
        />
      )}
      <div className="bg-muted p-3 rounded-md rounded-bl-sm border border-border shadow-sm w-full select-none">
        <p className="text-xs italic text-muted-foreground font-medium">
          Pesan ini telah dihapus
        </p>
        <div className="flex justify-end items-center mt-1.5 text-[8px] text-muted-foreground">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

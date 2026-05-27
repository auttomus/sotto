import * as React from "react";
import { Link } from "react-router";
import { ChevronRight, Star } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { ROUTES } from "~/core/constants/ROUTES";

interface ListingSellerCardProps {
  account: {
    username?: string | null;
    avatarObjectKey?: string | null;
    displayName?: string | null;
    major?: string | null;
    trustScore: number;
  } | null;
}

export function ListingSellerCard({ account }: ListingSellerCardProps) {
  if (!account) return null;

  return (
    <div className="py-6">
      <h3 className="font-bold text-foreground mb-4 text-lg">Tentang Penjual</h3>
      <Link 
        to={account.username ? ROUTES.PROFILE_PUBLIC(account.username) : "#"} 
        className="flex items-center justify-between p-4 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition"
      >
        <div className="flex items-center gap-3">
          <Avatar 
            src={resolveMediaUrl(account.avatarObjectKey)} 
            alt={account.displayName || ""} 
            size="lg" 
          />
          <div>
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              {account.displayName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {account.major || `@${account.username}`}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-amber-600 dark:text-amber-500">
              <Star className="h-3 w-3 fill-amber-500" />
              {Number(account.trustScore).toFixed(1)} Trust Score
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>
    </div>
  );
}

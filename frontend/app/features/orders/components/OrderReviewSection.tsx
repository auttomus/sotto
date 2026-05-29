import * as React from "react";
import { OrderStatus } from "~/core/apollo/base-types";
import { OrderReviewForm } from "./OrderReviewForm";
import { OrderReviewDisplay } from "./OrderReviewDisplay";

interface OrderReviewSectionProps {
  status: OrderStatus;
  review?: {
    id: string;
    rating: number;
    comment?: string | null;
  } | null;
  isBuyer: boolean;
  onSubmitReview: (rating: number, comment: string) => void;
  reviewLoading: boolean;
}

export function OrderReviewSection({
  status,
  review,
  isBuyer,
  onSubmitReview,
  reviewLoading,
}: OrderReviewSectionProps) {
  // Hanya muncul jika order sudah selesai (COMPLETED)
  if (status !== OrderStatus.Completed) {
    return null;
  }

  return (
    <div className="mt-1">
      {review ? (
        <OrderReviewDisplay review={review} />
      ) : isBuyer ? (
        <OrderReviewForm onSubmit={onSubmitReview} loading={reviewLoading} />
      ) : (
        <div className="bg-card p-4 rounded-sm border border-border shadow-sm text-center">
          <p className="text-xs text-muted-foreground italic">
            Menunggu ulasan dan komentar dari pembeli.
          </p>
        </div>
      )}
    </div>
  );
}

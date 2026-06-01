import * as React from "react";
import { 
  useAdvanceOrderStatusMutation, 
  useRefundDisputedOrderMutation, 
  useProposeSplitRefundMutation, 
  useAcceptSplitRefundMutation, 
  useRejectSplitRefundMutation 
} from "~/core/apollo/generated";
import { useToastStore } from "~/core/store/useToastStore";

interface UseDisputeMediationProps {
  orderId: string;
  agreedPrice: number;
}

export function useDisputeMediation({ orderId, agreedPrice }: UseDisputeMediationProps) {
  const addToast = useToastStore((s) => s.addToast);
  const [isSplitModalOpen, setIsSplitModalOpen] = React.useState(false);
  const [buyerInputAmount, setBuyerInputAmount] = React.useState<string>("");

  // Mutations
  const [advanceOrder, { loading: advanceLoading }] = useAdvanceOrderStatusMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });
  const [refundOrder, { loading: refundLoading }] = useRefundDisputedOrderMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });
  const [proposeSplit, { loading: proposeLoading }] = useProposeSplitRefundMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });
  const [acceptSplit, { loading: acceptLoading }] = useAcceptSplitRefundMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });
  const [rejectSplit, { loading: rejectLoading }] = useRejectSplitRefundMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });

  const handleBuyerTarikKomplain = async () => {
    try {
      await advanceOrder({ variables: { orderId } });
      addToast("success", "Komplain berhasil ditarik. Pesanan selesai!");
    } catch (err: any) {
      addToast("error", err.message || "Gagal memproses penarikan komplain.");
    }
  };

  const handleSellerRefund100 = async () => {
    try {
      await refundOrder({ variables: { orderId } });
      addToast("success", "Refund penuh disetujui. Dana dikembalikan ke pembeli!");
    } catch (err: any) {
      addToast("error", err.message || "Gagal memproses refund penuh.");
    }
  };

  const handleProposeSplitSubmit = async (buyerVal: number) => {
    if (isNaN(buyerVal) || buyerVal < 0 || buyerVal > agreedPrice) {
      addToast("error", `Jumlah refund pembeli harus antara Rp 0 - Rp ${agreedPrice.toLocaleString()}`);
      return false;
    }

    const sellerVal = agreedPrice - buyerVal;

    try {
      await proposeSplit({
        variables: {
          orderId,
          buyerAmount: buyerVal,
          sellerAmount: sellerVal,
        }
      });
      addToast("success", "Proposal bagi hasil berhasil diajukan!");
      setIsSplitModalOpen(false);
      return true;
    } catch (err: any) {
      addToast("error", err.message || "Gagal mengajukan proposal bagi hasil.");
      return false;
    }
  };

  const handleAcceptProposal = async () => {
    try {
      await acceptSplit({ variables: { orderId } });
      addToast("success", "Bagi hasil disetujui. Sengketa selesai!");
    } catch (err: any) {
      addToast("error", err.message || "Gagal menyetujui bagi hasil.");
    }
  };

  const handleRejectProposal = async () => {
    try {
      await rejectSplit({ variables: { orderId } });
      addToast("success", "Proposal bagi hasil ditolak.");
    } catch (err: any) {
      addToast("error", err.message || "Gagal menolak proposal.");
    }
  };

  const isActionLoading = advanceLoading || refundLoading || proposeLoading || acceptLoading || rejectLoading;

  return {
    isSplitModalOpen,
    setIsSplitModalOpen,
    buyerInputAmount,
    setBuyerInputAmount,
    handleBuyerTarikKomplain,
    handleSellerRefund100,
    handleProposeSplitSubmit,
    handleAcceptProposal,
    handleRejectProposal,
    isActionLoading,
  };
}

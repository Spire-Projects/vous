"use client";

import { useState } from "react";
import { firestoreOrderRepository } from "@/infrastructure/repositories/firestore-order.repository";
import { uploadPaymentProof } from "@/application/use-cases/order/upload-payment-proof";
import { uploadFileToCloudinary } from "@/utils/cloudinary-upload";

export function usePaymentProofUpload(createdOrderId: string | null, onSuccess: () => void) {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmitProof() {
    if (!proofFile || !createdOrderId) return;
    setUploading(true);
    setProofError(null);
    try {
      const url = await uploadFileToCloudinary(proofFile, "vous/comprobantes");
      await uploadPaymentProof(firestoreOrderRepository, createdOrderId, url);
      onSuccess();
    } catch (e) {
      setProofError(e instanceof Error ? e.message : "Error al subir el comprobante.");
    } finally {
      setUploading(false);
    }
  }

  return {
    proofFile,
    setProofFile,
    proofError,
    uploading,
    handleSubmitProof,
  };
}

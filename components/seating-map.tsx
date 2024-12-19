// components/SeatingMap.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Seat } from "@/types/seat";
import toast from "react-hot-toast";
import { initSeats } from "@/const/seats";
import { CancelModal } from "./cancel-modal";
import { ReservationModal } from "./reservation-modal";
import { SeatButton } from "./seat-button";

const topics = [
  { value: "coffee", label: "コーヒー休憩" },
  { value: "business", label: "ビジネス相談" },
  { value: "tech", label: "技術相談" },
  { value: "casual", label: "カジュアルトーク" },
];

const languages = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "both", label: "Both/どちらでも" },
];

const SeatingMap = () => {
  const [seats, setSeats] = useState<Seat[]>(initSeats);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    topic: "",
    language: "",
    message: "",
  });

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchSeats = async () => {
    try {
      const { data, error } = await supabase
        .from("seats")
        .select("*")
        .order("id");

      if (error) throw error;

      const expiredSeats = data.filter(
        (seat) =>
          seat.status === "occupied" &&
          seat.expires_at &&
          new Date(seat.expires_at) < new Date()
      );

      if (expiredSeats.length > 0) {
        const { error: updateError } = await supabase
          .from("seats")
          .update({
            status: "available",
            username: null,
            topic: null,
            language: null,
            message: null,
            expires_at: null,
          })
          .in(
            "id",
            expiredSeats.map((seat) => seat.id)
          );

        if (updateError) throw updateError;

        const { data: updatedData, error: refetchError } = await supabase
          .from("seats")
          .select("*")
          .order("id");

        if (refetchError) throw refetchError;

        setSeats(updatedData);

        if (expiredSeats.length > 0) {
          toast.success(
            `${expiredSeats.length}件の期限切れ座席をリセットしました`
          );
        }
      } else {
        setSeats(data);
      }
    } catch (error) {
      console.error("Error fetching/updating seats:", error);
      toast.error("座席情報の取得に失敗しました");
    }
  };

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
    if (seat.status === "occupied") {
      setIsCancelModalOpen(true);
    } else {
      setFormData({
        username: "",
        topic: "",
        language: "",
        message: "",
      });
      setIsReservationModalOpen(true);
    }
  };

  const handleReservationModalClose = () => {
    setIsReservationModalOpen(false);
    setTimeout(() => {
      setFormData({
        username: "",
        topic: "",
        language: "",
        message: "",
      });
      setSelectedSeat(null);
    }, 300);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setTimeout(() => {
      setSelectedSeat(null);
    }, 300);
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedSeat ||
      !formData.username ||
      !formData.topic ||
      !formData.language
    ) {
      return;
    }

    const toastId = toast.loading("予約中...");

    try {
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("seats")
        .update({
          status: "occupied",
          username: formData.username,
          topic: formData.topic,
          language: formData.language,
          message: formData.message,
          expires_at: expiresAt,
        })
        .eq("id", selectedSeat.id);

      if (error) throw error;

      await fetchSeats();
      toast.success("座席を予約しました", { id: toastId });
      handleReservationModalClose();
    } catch (error) {
      console.error("Error updating seat:", error);
      toast.error("座席の予約に失敗しました", { id: toastId });
    }
  };

  const handleCancel = async () => {
    if (!selectedSeat) return;

    const toastId = toast.loading("予約解除中...");

    try {
      const { error } = await supabase
        .from("seats")
        .update({
          status: "available",
          username: null,
          topic: null,
          language: null,
          message: null,
          expires_at: null,
        })
        .eq("id", selectedSeat.id);

      if (error) throw error;

      await fetchSeats();
      toast.success("予約を解除しました", { id: toastId });
      handleCancelModalClose();
    } catch (error) {
      console.error("Error canceling reservation:", error);
      toast.error("予約の解除に失敗しました", { id: toastId });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src="/google_for_startups.jpeg"
            alt="Google for Startups Space"
            layout="fill"
            objectFit="contain"
            className="opacity-90"
          />

          <div className="absolute inset-0">
            {seats.map((seat) => (
              <SeatButton
                key={seat.id}
                seat={seat}
                topics={topics}
                languages={languages}
                onSeatClick={handleSeatClick}
              />
            ))}
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleReservationModalClose}
        selectedSeat={selectedSeat}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleReservation}
        topics={topics}
        languages={languages}
      />

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={handleCancelModalClose}
        selectedSeat={selectedSeat}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SeatingMap;

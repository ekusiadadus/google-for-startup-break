"use client";
import React, { useState } from "react";
import {
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Input,
  Textarea,
} from "@nextui-org/react";
import Image from "next/image";
import { initSeats } from "@/const/seats";

const SeatingMap = () => {
  const [seats, setSeats] = useState(initSeats);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    topic: "",
    language: "",
    message: "",
  });

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

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setFormData({
      user: seat.user || "",
      topic: seat.topic || "",
      language: seat.language || "",
      message: seat.message || "",
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // モーダルが完全に閉じた後にフォームをリセット
    setTimeout(() => {
      setFormData({
        user: "",
        topic: "",
        language: "",
        message: "",
      });
      setSelectedSeat(null);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.user || !formData.topic || !formData.language) {
      return;
    }

    const updatedSeats = seats.map((seat) =>
      seat.id === selectedSeat.id
        ? {
            ...seat,
            status: "occupied",
            ...formData,
          }
        : seat
    );

    setSeats(updatedSeats);
    handleModalClose();
  };

  const handleFormChange = (field, value) => {
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
              <Tooltip
                key={seat.id}
                content={
                  seat.status === "occupied"
                    ? `${seat.user}: ${
                        topics.find((t) => t.value === seat.topic)?.label
                      } (${
                        languages.find((l) => l.value === seat.language)?.label
                      })`
                    : "空席"
                }
              >
                <button
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
                    seat.status === "occupied"
                      ? "bg-red-500 bg-opacity-80"
                      : "bg-green-500 bg-opacity-50 hover:bg-opacity-70"
                  }`}
                  style={{
                    left: `${seat.x}%`,
                    top: `${seat.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.id}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        placement="center"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader>座席 {selectedSeat?.id} の設定</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    value={formData.user}
                    onChange={(e) => handleFormChange("user", e.target.value)}
                    label="お名前"
                    placeholder="お名前を入力してください"
                    isRequired
                  />

                  <Select
                    label="話したいトピック"
                    placeholder="トピックを選択してください"
                    selectedKeys={formData.topic ? [formData.topic] : []}
                    onChange={(e) => handleFormChange("topic", e.target.value)}
                    isRequired
                  >
                    {topics.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="希望言語"
                    placeholder="言語を選択してください"
                    selectedKeys={formData.language ? [formData.language] : []}
                    onChange={(e) =>
                      handleFormChange("language", e.target.value)
                    }
                    isRequired
                  >
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      handleFormChange("message", e.target.value)
                    }
                    label="メッセージ"
                    placeholder="任意でメッセージを入力してください"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button color="primary" type="submit">
                  設定する
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SeatingMap;

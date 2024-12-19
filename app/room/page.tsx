"use client";
import React, { useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import {
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";

const SeatingMap = () => {
  const [seats, setSeats] = useState([
    // 左側ラウンジエリア（スクリーン前）
    { id: 1, x: 23, y: 61, status: "available", topic: "", language: "" },
    { id: 2, x: 22, y: 56, status: "available", topic: "", language: "" },
    { id: 3, x: 29, y: 58, status: "available", topic: "", language: "" },
    { id: 4, x: 28, y: 54, status: "available", topic: "", language: "" },
    // 左側2つ目
    { id: 5, x: 33, y: 57, status: "available", topic: "", language: "" },
    { id: 6, x: 32, y: 53, status: "available", topic: "", language: "" },
    { id: 7, x: 40, y: 55, status: "available", topic: "", language: "" },
    { id: 8, x: 38, y: 50, status: "available", topic: "", language: "" },

    // 右側ラウンジエリア（スクリーン前）
    { id: 9, x: 45, y: 53, status: "available", topic: "", language: "" },
    { id: 10, x: 43, y: 48, status: "available", topic: "", language: "" },
    { id: 11, x: 50, y: 52, status: "available", topic: "", language: "" },
    { id: 12, x: 48, y: 47, status: "available", topic: "", language: "" },
    // 右側ラウンジエリア（スクリーン前）
    { id: 13, x: 60, y: 41, status: "available", topic: "", language: "" },
    { id: 14, x: 63, y: 43, status: "available", topic: "", language: "" },
    { id: 15, x: 66, y: 46, status: "available", topic: "", language: "" },

    { id: 16, x: 62, y: 58, status: "available", topic: "", language: "" },
    { id: 17, x: 43, y: 80, status: "available", topic: "", language: "" },
    { id: 18, x: 68, y: 66, status: "available", topic: "", language: "" },
  ]);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  const handleSeatUpdate = (topic, language) => {
    const updatedSeats = seats.map((seat) =>
      seat.id === selectedSeat.id
        ? { ...seat, status: "occupied", topic, language }
        : seat
    );
    setSeats(updatedSeats);
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="relative w-full h-full">
          {/* 背景画像 */}
          <Image
            src="/google_for_startups.jpeg"
            alt="Google for Startups Space"
            layout="fill"
            objectFit="contain"
            className="opacity-90"
          />

          {/* 座席オーバーレイ */}
          <div className="absolute inset-0">
            {seats.map((seat) => (
              <Tooltip
                key={seat.id}
                content={
                  seat.status === "occupied"
                    ? `${seat.topic} (${seat.language})`
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

      {/* 座席設定モーダル */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>座席 {selectedSeat?.id} の設定</ModalHeader>
          <ModalBody>
            <Select
              label="話したいトピック"
              placeholder="トピックを選択してください"
              className="mb-4"
            >
              {topics.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>
                  {topic.label}
                </SelectItem>
              ))}
            </Select>
            <Select label="希望言語" placeholder="言語を選択してください">
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => handleSeatUpdate("コーヒー休憩", "日本語")}
            >
              設定する
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SeatingMap;

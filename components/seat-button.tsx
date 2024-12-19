// components/SeatButton.tsx (変更なし)
import { Tooltip } from "@nextui-org/react";
import type { Seat } from "@/types/seat";
import { CountdownTimer } from "./countdown-timer";

interface SeatButtonProps {
  seat: Seat;
  topics: Array<{ value: string; label: string }>;
  languages: Array<{ value: string; label: string }>;
  onSeatClick: (seat: Seat) => void;
}

export const SeatButton = ({
  seat,
  topics,
  languages,
  onSeatClick,
}: SeatButtonProps) => {
  const topicLabel = topics.find((t) => t.value === seat.topic)?.label;
  const languageLabel = languages.find((l) => l.value === seat.language)?.label;

  return (
    <Tooltip
      content={
        <div className="text-sm">
          {seat.status === "occupied" ? (
            <div className="space-y-1">
              <div>{`${seat.username}: ${topicLabel} (${languageLabel})`}</div>
              {seat.expires_at && (
                <div>
                  残り時間: <CountdownTimer expiresAt={seat.expires_at} />
                </div>
              )}
            </div>
          ) : (
            "空席"
          )}
        </div>
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
        onClick={() => onSeatClick(seat)}
      >
        {seat.id}
      </button>
    </Tooltip>
  );
};

// components/ReservationModal.tsx
import { Seat } from "@/types/seat";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSeat: Seat | null;
  formData: {
    username: string;
    topic: string;
    language: string;
    message: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  topics: Array<{ value: string; label: string }>;
  languages: Array<{ value: string; label: string }>;
}

export const ReservationModal = ({
  isOpen,
  onClose,
  selectedSeat,
  formData,
  onFormChange,
  onSubmit,
  topics,
  languages,
}: ReservationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      isDismissable={false}
    >
      <ModalContent>
        {(onModalClose) => (
          <form onSubmit={onSubmit}>
            <ModalHeader>座席 {selectedSeat?.id} の予約</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  value={formData.username}
                  onChange={(e) => onFormChange("username", e.target.value)}
                  label="お名前"
                  placeholder="お名前を入力してください"
                  isRequired
                />

                <Select
                  label="話したいトピック"
                  placeholder="トピックを選択してください"
                  selectedKeys={formData.topic ? [formData.topic] : []}
                  onChange={(e) => onFormChange("topic", e.target.value)}
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
                  onChange={(e) => onFormChange("language", e.target.value)}
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
                  onChange={(e) => onFormChange("message", e.target.value)}
                  label="メッセージ"
                  placeholder="任意でメッセージを入力してください"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onModalClose}>
                キャンセル
              </Button>
              <Button color="primary" type="submit">
                予約する
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

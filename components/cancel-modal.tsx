// components/CancelModal.tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSeat: Seat | null;
  onCancel: () => Promise<void>;
}

export const CancelModal = ({
  isOpen,
  onClose,
  selectedSeat,
  onCancel,
}: CancelModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      isDismissable={false}
    >
      <ModalContent>
        {(onModalClose) => (
          <>
            <ModalHeader>座席 {selectedSeat?.id} の予約解除</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <p>現在の予約情報:</p>
                <div className="pl-4">
                  <p>予約者: {selectedSeat?.username}</p>
                  {selectedSeat?.message && (
                    <p>メッセージ: {selectedSeat.message}</p>
                  )}
                </div>
                <p className="text-danger">
                  この座席の予約を解除してもよろしいですか？
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onModalClose}>
                キャンセル
              </Button>
              <Button color="danger" onPress={onCancel}>
                予約を解除する
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

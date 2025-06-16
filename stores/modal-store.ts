import { create } from "zustand";
import { devtools } from "zustand/middleware";

// 모달 타입 정의
export type ModalType =
  | "comments"
  | "details"
  | "confirmation"
  | "error"
  | null;

// 모달 데이터 타입 정의
export interface ModalData {
  title?: string;
  message?: string;
  productData?: {
    koreanTitle: string;
    englishTitle: string;
  };
  onConfirm?: () => void;
  onCancel?: () => void;
  [key: string]: any;
}

// 모달 상태 인터페이스
interface ModalState {
  // 상태
  currentModal: ModalType;
  modalData: ModalData | null;
  isAnimating: boolean;
  modalHistory: ModalType[];

  // 액션
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  closeAllModals: () => void;
  goBackModal: () => void;

  // 특정 모달 액션
  openCommentsModal: (productData?: ModalData["productData"]) => void;
  openDetailsModal: () => void;
  openConfirmationModal: (
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => void;
  openErrorModal: (message: string) => void;
}

export const useModalStore = create<ModalState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      currentModal: null,
      modalData: null,
      isAnimating: false,
      modalHistory: [],

      // 기본 액션
      openModal: (type, data = undefined) => {
        const { currentModal, modalHistory } = get();

        set({
          currentModal: type,
          modalData: data,
          modalHistory: currentModal
            ? [...modalHistory, currentModal]
            : modalHistory,
        });
      },

      closeModal: () => {
        set({
          currentModal: null,
          modalData: null,
        });
      },

      closeAllModals: () => {
        set({
          currentModal: null,
          modalData: null,
          modalHistory: [],
        });
      },

      goBackModal: () => {
        const { modalHistory } = get();
        const previousModal = modalHistory[modalHistory.length - 1];

        if (previousModal) {
          set({
            currentModal: previousModal,
            modalHistory: modalHistory.slice(0, -1),
          });
        } else {
          set({
            currentModal: null,
            modalData: null,
          });
        }
      },
    }),
    {
      name: "modal-store", // devtools에서 보여질 이름
    }
  )
);

// 편의 훅들q
export const useModalData = () => useModalStore((state) => state.modalData);
export const useModal = () => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const closeAllModals = useModalStore((state) => state.closeAllModals);
  const goBackModal = useModalStore((state) => state.goBackModal);
  const currentModal = useModalStore((state) => state.currentModal);
  return { openModal, closeModal, closeAllModals, goBackModal, currentModal };
};

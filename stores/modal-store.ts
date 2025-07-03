import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 모달 타입 정의
type ModalType = 'comments' | 'details' | null;

// 모달 상태 인터페이스
interface ModalState {
  // 상태
  currentModal: ModalType;
  modalHistory: ModalType[];

  // 액션
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  goBackModal: () => void;
}

export const useModalStore = create<ModalState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      currentModal: null,
      modalHistory: [],

      // 기본 액션
      openModal: (type) => {
        const { currentModal, modalHistory } = get();

        set({
          currentModal: type,
          modalHistory: currentModal
            ? [...modalHistory, currentModal]
            : modalHistory,
        });
      },

      closeModal: () => {
        set({
          currentModal: null,
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
            modalHistory: [],
          });
        }
      },
    }),
    {
      name: 'modal-store', // devtools에서 보여질 이름
    }
  )
);

// 편의 훅들
export const useModal = () => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const goBackModal = useModalStore((state) => state.goBackModal);
  const currentModal = useModalStore((state) => state.currentModal);
  return { openModal, closeModal, goBackModal, currentModal };
};

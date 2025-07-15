import { RealTimeQuotesData } from '@/types/ProductTypes';

export interface QuotesUpdateCallback {
  (data: RealTimeQuotesData): void;
}

class QuotesStreamService {
  private static instance: QuotesStreamService;
  private eventSources: Map<string, EventSource> = new Map();
  private callbacks: Map<string, QuotesUpdateCallback[]> = new Map();
  private connectionStatus: Map<string, boolean> = new Map();

  private constructor() {}

  static getInstance(): QuotesStreamService {
    if (!QuotesStreamService.instance) {
      QuotesStreamService.instance = new QuotesStreamService();
    }
    return QuotesStreamService.instance;
  }

  // SSE 연결 시작
  connectToQuotesStream(
    pieceProductUuid: string,
    callback: QuotesUpdateCallback
  ): () => void {
    const key = `quotes-${pieceProductUuid}`;

    // 기존 EventSource가 있으면 재사용, 없으면 새로 생성
    let eventSource = this.eventSources.get(key);

    if (!eventSource) {
      // 새로운 EventSource 생성
      const sseUrl = `/api/sse/quotes/${pieceProductUuid}`;
      console.log(`SSE 연결 시도: ${sseUrl}`);

      eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        console.log(`SSE 연결 성공: ${pieceProductUuid}`);
        this.connectionStatus.set(key, true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: RealTimeQuotesData = JSON.parse(event.data);
          console.log('실시간 호가 데이터 수신:', data);

          // 등록된 모든 콜백 호출
          const callbacks = this.callbacks.get(key);
          if (callbacks && callbacks.length > 0) {
            console.log(
              `콜백 실행: ${pieceProductUuid} (${callbacks.length}개 콜백)`
            );
            callbacks.forEach((cb) => {
              try {
                cb(data);
              } catch (error) {
                console.error('콜백 실행 중 오류:', error);
              }
            });
          } else {
            console.warn(`콜백이 없음: ${pieceProductUuid}`);
          }
        } catch (error) {
          console.error(
            'SSE 데이터 파싱 오류:',
            error,
            'Raw data:',
            event.data
          );
        }
      };

      eventSource.onerror = (error) => {
        console.error(`SSE 연결 오류 (${pieceProductUuid}):`, error);
        this.connectionStatus.set(key, false);

        if (eventSource) {
          console.error('EventSource readyState:', eventSource.readyState);

          // 연결 상태에 따른 처리
          if (eventSource.readyState === EventSource.CLOSED) {
            console.log(`SSE 연결이 닫힘: ${pieceProductUuid}`);
          } else if (eventSource.readyState === EventSource.CONNECTING) {
            console.log(`SSE 재연결 시도 중: ${pieceProductUuid}`);
          }
        }
      };

      this.eventSources.set(key, eventSource);
    } else {
      console.log(`기존 SSE 연결 재사용: ${pieceProductUuid}`);
    }

    // 콜백 등록
    if (!this.callbacks.has(key)) {
      this.callbacks.set(key, []);
    }

    // 중복 콜백 방지
    const existingCallbacks = this.callbacks.get(key)!;
    if (!existingCallbacks.includes(callback)) {
      existingCallbacks.push(callback);
      console.log(
        `콜백 등록: ${pieceProductUuid} (총 ${existingCallbacks.length}개)`
      );
    } else {
      console.log(`콜백 이미 존재: ${pieceProductUuid}`);
    }

    // 연결 해제 함수 반환 (특정 콜백만 제거)
    return () => {
      this.removeCallback(pieceProductUuid, callback);
    };
  }

  // 특정 콜백 제거
  private removeCallback(
    pieceProductUuid: string,
    callback: QuotesUpdateCallback
  ): void {
    const key = `quotes-${pieceProductUuid}`;
    const callbacks = this.callbacks.get(key);

    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        console.log(
          `콜백 제거: ${pieceProductUuid} (남은 콜백: ${callbacks.length}개)`
        );
      }

      // 콜백이 없으면 EventSource도 해제
      if (callbacks.length === 0) {
        this.disconnectFromQuotesStream(pieceProductUuid);
      }
    }
  }

  // SSE 연결 해제
  disconnectFromQuotesStream(pieceProductUuid: string): void {
    const key = `quotes-${pieceProductUuid}`;

    // EventSource 연결 해제
    const eventSource = this.eventSources.get(key);
    if (eventSource) {
      eventSource.close();
      this.eventSources.delete(key);
      this.connectionStatus.delete(key);
      console.log(`SSE 연결 해제: ${pieceProductUuid}`);
    }

    // 콜백 제거
    this.callbacks.delete(key);
  }

  // 연결 상태 확인
  isConnected(pieceProductUuid: string): boolean {
    const key = `quotes-${pieceProductUuid}`;
    return this.connectionStatus.get(key) || false;
  }

  // 모든 연결 해제
  disconnectAll(): void {
    this.eventSources.forEach((eventSource) => {
      eventSource.close();
    });
    this.eventSources.clear();
    this.callbacks.clear();
    this.connectionStatus.clear();
    console.log('모든 SSE 연결 해제');
  }
}

export default QuotesStreamService;

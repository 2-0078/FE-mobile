import { RealTimeQuotesData } from '@/types/ProductTypes';

export interface QuotesUpdateCallback {
  (data: RealTimeQuotesData): void;
}

class QuotesStreamService {
  private static instance: QuotesStreamService;
  private eventSources: Map<string, EventSource> = new Map();
  private callbacks: Map<string, QuotesUpdateCallback[]> = new Map();

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

    // 기존 연결이 있다면 제거
    this.disconnectFromQuotesStream(pieceProductUuid);

    // 콜백 등록
    if (!this.callbacks.has(key)) {
      this.callbacks.set(key, []);
    }
    this.callbacks.get(key)!.push(callback);

    // 내부 API를 통해 SSE 연결 생성
    const eventSource = new EventSource(`/api/sse/quotes/${pieceProductUuid}`);

    eventSource.onopen = () => {
      console.log(`SSE 연결 시작: ${pieceProductUuid}`);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: RealTimeQuotesData = JSON.parse(event.data);
        console.log('실시간 호가 데이터 수신:', data);

        // 등록된 모든 콜백 호출
        const callbacks = this.callbacks.get(key);
        if (callbacks) {
          callbacks.forEach((cb) => cb(data));
        }
      } catch (error) {
        console.error('SSE 데이터 파싱 오류:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error(`SSE 연결 오류 (${pieceProductUuid}):`, error);
      this.disconnectFromQuotesStream(pieceProductUuid);
    };

    this.eventSources.set(key, eventSource);

    // 연결 해제 함수 반환
    return () => {
      this.disconnectFromQuotesStream(pieceProductUuid);
    };
  }

  // SSE 연결 해제
  disconnectFromQuotesStream(pieceProductUuid: string): void {
    const key = `quotes-${pieceProductUuid}`;

    // EventSource 연결 해제
    const eventSource = this.eventSources.get(key);
    if (eventSource) {
      eventSource.close();
      this.eventSources.delete(key);
      console.log(`SSE 연결 해제: ${pieceProductUuid}`);
    }

    // 콜백 제거
    this.callbacks.delete(key);
  }

  // 모든 연결 해제
  disconnectAll(): void {
    this.eventSources.forEach((eventSource, key) => {
      eventSource.close();
    });
    this.eventSources.clear();
    this.callbacks.clear();
    console.log('모든 SSE 연결 해제');
  }
}

export default QuotesStreamService;

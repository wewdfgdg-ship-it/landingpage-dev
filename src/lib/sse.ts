/** SSE 이벤트 타입 */
export interface SSEEvent {
  event: string;
  data: Record<string, unknown>;
}

/** SSE ReadableStream 생성 */
export function createSSEStream(
  onStart: (send: (event: SSEEvent) => void) => Promise<void> | void,
): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller: ReadableStreamDefaultController<Uint8Array>): Promise<void> {
      const send = (event: SSEEvent): void => {
        const message = `event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // 하트비트
      const heartbeat = setInterval(() => {
        send({ event: 'heartbeat', data: { ts: Date.now() } });
      }, 30_000);

      try {
        await onStart(send);
      } finally {
        clearInterval(heartbeat);
        controller.close();
      }
    },
  });
}

/** SSE Response 헤더 */
export function sseHeaders(): HeadersInit {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };
}

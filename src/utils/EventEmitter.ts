/**
 * EventEmitter — Typed event system for decoupled communication.
 *
 * All core systems extend this to emit/listen for events without
 * direct coupling. Supports typed events via generic parameter.
 */

type Listener<T = unknown> = (data: T) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<EventMap = any> {
  private listeners: Map<string, Set<Listener>> = new Map();

  on<K extends keyof EventMap & string>(event: K, callback: Listener<EventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as Listener);
  }

  off<K extends keyof EventMap & string>(event: K, callback: Listener<EventMap[K]>): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback as Listener);
    }
  }

  once<K extends keyof EventMap & string>(event: K, callback: Listener<EventMap[K]>): void {
    const wrapper: Listener<EventMap[K]> = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  protected emit<K extends keyof EventMap & string>(event: K, data: EventMap[K]): void {
    const set = this.listeners.get(event);
    if (set) {
      for (const cb of set) {
        (cb as Listener<EventMap[K]>)(data);
      }
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

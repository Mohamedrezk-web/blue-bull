export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    this.listeners.set(
      event,
      this.listeners.get(event).filter((listener) => listener !== callback),
    );
  }

  emit(event, payload) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach((listener) => listener(payload));
  }
}

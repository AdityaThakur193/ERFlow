// Custom Toast Subscription System
// Replaces react-hot-toast with custom events

const listeners = new Set();

export const toast = {
  success: (message, options) => emit("success", message, options),
  error: (message, options) => emit("error", message, options),
  info: (message, options) => emit("info", message, options),
  dismiss: (id) => emit("dismiss", null, { id }),
};

function emit(type, message, options) {
  const id = options?.id || Math.random().toString(36).substring(2, 9);
  const event = {
    id,
    type,
    message,
    duration: options?.duration || (type === "error" ? 5000 : 3500),
  };
  listeners.forEach((cb) => cb(event));
  return id;
}

export function subscribe(cb) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

import { chatReactHooksMultiply } from "@sendbird/chat-react-hooks";

export function multiply(a: number, b: number): Promise<number> {
  return chatReactHooksMultiply(a, b);
}

export * from "./types";
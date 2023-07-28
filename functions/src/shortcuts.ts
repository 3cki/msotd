import ShortcutInterface from "./interfaces/shortcut";
import { HTMLElement } from "node-html-parser";

export const getShortcutDetailsFromElement = (
  element: HTMLElement
): { command: string; description: string } => {
  const parent = element.parentNode;
  if (!parent) throw new Error("Invalid Element");

  const command = parent.text.split(":")[0].trim();
  const description = parent.text.split(":")[1].trim();

  return { command, description };
};

export const removeDuplicateShortcuts = (
  shortcuts: ShortcutInterface[]
): ShortcutInterface[] => {
  const uniqueShortcuts = shortcuts.filter(
    (shortcut, index, self) =>
      index === self.findIndex((s) => s.shortcut === shortcut.shortcut)
  );

  return uniqueShortcuts;
};

export const constructShortcut = (
  command: string,
  description: string
): ShortcutInterface => {
  const shortcut: ShortcutInterface = {
    shortcut: command,
    description,
  };
  return shortcut;
};

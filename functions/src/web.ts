import axios from "axios";
import { parse } from "node-html-parser";
import { logger } from "firebase-functions/v2";
import ShortcutInterface from "./interfaces/shortcut";
import {
  removeDuplicateShortcuts,
  constructShortcut,
  getShortcutDetailsFromElement,
} from "./shortcuts";

export const getURLFromEnvs = (): string => {
  const url = process.env.URL;
  if (!url) throw new Error("URL not set");
  logger.info(`Reading Shortcuts from ${url}`);
  return url;
};

export const getHTMLFromURL = async (url: string): Promise<string> => {
  const { data } = await axios.get(url);
  logger.info(`HTML: ${data}`);
  return data;
};

export const getShortcutsFromHTML = (html: string): ShortcutInterface[] => {
  const doc = parse(html);
  const elements = doc.querySelectorAll("li strong");

  const shortcuts: ShortcutInterface[] = [];
  elements.forEach((element) => {
    const { command, description } = getShortcutDetailsFromElement(element);
    const shortcut = constructShortcut(command, description);
    shortcuts.push(shortcut);
  });

  const uniqueShortcuts = removeDuplicateShortcuts(shortcuts);
  logger.info(`Read ${uniqueShortcuts.length} Shortcuts from HTML`);

  return uniqueShortcuts;
};

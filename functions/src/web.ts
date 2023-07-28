import axios from "axios";
import { parse } from "node-html-parser";
import { logger } from "firebase-functions/v2";
import ShortcutInterface from "./interfaces/shortcut";

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
    const parent = element.parentNode;
    if (!parent) return;

    const command = parent.text.split(":")[0].trim();
    const description = parent.text.split(":")[1].trim();

    const shortcut: ShortcutInterface = {
      shortcut: command,
      description,
      added: new Date(),
    };
    shortcuts.push(shortcut);
  });

  const uniqueShortcuts = shortcuts.filter(
    (shortcut, index, self) =>
      index === self.findIndex((s) => s.shortcut === shortcut.shortcut)
  );

  logger.info(`Read ${uniqueShortcuts.length} Shortcuts from HTML`);
  return uniqueShortcuts;
};

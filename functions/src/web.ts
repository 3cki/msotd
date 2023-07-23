import axios from "axios";
import { logger } from "firebase-functions/v2";

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

export const getShortcutsFromHTML = (html: string): string[] => {
  const regex = /<li><strong>(.+)<\/strong>":&nbsp;(.+)<\/li>/g;
  const shortcuts: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    shortcuts.push(`${match[1]}: ${match[2]}`);
  }

  logger.info(`Shortcuts: ${shortcuts}`);
  return shortcuts;
};

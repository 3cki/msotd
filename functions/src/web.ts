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
  let matches = Array.from(html.matchAll(regex));
  let result = [];
  for (let match of matches) {
    result.push(match[1]); // This is the first group in the regex
    result.push(match[2]); // This is the second group in the regex
  }
  logger.info(`Shortcuts: ${result}`);
  return result;
};

import { pubsub } from "firebase-functions";
import { logger } from "firebase-functions/v2";

import { getURLFromEnvs, getHTMLFromURL, getShortcutsFromHTML } from "./web";
import {
  getShortcutsFromFirestore,
  removeIdenticalShortcuts,
  addNewShortcuts,
  updateShortcuts,
} from "./firestore";

exports.readShortcuts = pubsub.schedule("* * * * *").onRun(async (context) => {
  try {
    const url = getURLFromEnvs();
    const html = await getHTMLFromURL(url);
    const shortcuts = getShortcutsFromHTML(html);
    const storedShortcuts = await getShortcutsFromFirestore();
    const { newShortcuts, updatedShortcuts } = removeIdenticalShortcuts(
      shortcuts,
      storedShortcuts
    );
    await addNewShortcuts(newShortcuts);
    await updateShortcuts(updatedShortcuts);
  } catch (error) {
    logger.error(error);
  }
});

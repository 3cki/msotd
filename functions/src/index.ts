import { pubsub } from "firebase-functions";
import { logger } from "firebase-functions/v2";

import { getURLFromEnvs, getHTMLFromURL, getShortcutsFromHTML } from "./web";
import {
  getShortcutsFromFirestore,
  removeIdenticalShortcuts,
  addNewShortcuts,
} from "./firestore";

exports.readShortcuts = pubsub.schedule("* * * * *").onRun(async (context) => {
  try {
    const url = getURLFromEnvs();
    const html = await getHTMLFromURL(url);
    const storedShortcuts = await getShortcutsFromFirestore();
    const shortcuts = getShortcutsFromHTML(html);
    const { newShortcuts } = removeIdenticalShortcuts(
      shortcuts,
      storedShortcuts
    );
    await addNewShortcuts(newShortcuts);
    //await updateShortcuts(updatedShortcuts);
  } catch (error) {
    logger.error(error);
  }
});

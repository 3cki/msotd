import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";

const app = initializeApp();
const firestore = getFirestore(app);

export const getShortcutsFromFirestore = async (): Promise<string[]> => {
  const snapshot = await firestore.collection("shortcuts").get();
  const shortcuts = snapshot.docs.map((doc) => doc.data().shortcut);
  logger.info(`Shortcuts: ${shortcuts}`);
  return shortcuts;
};

export const removeIdenticalShortcuts = (
  shortcuts: string[],
  storedShortcuts: string[]
): string[] => {
  const filteredShortcuts = shortcuts.filter(
    (shortcut) => !storedShortcuts.includes(shortcut)
  );
  logger.info(`Identical Shortcuts: ${filteredShortcuts}`);
  return filteredShortcuts;
};

export const updateAndAddShortcuts = async (shortcuts: string[]) => {
  const batch = firestore.batch();
  shortcuts.forEach((shortcut) => {
    const docRef = firestore.collection("shortcuts").doc();
    batch.set(docRef, { shortcut });
  });
  await batch.commit();
  logger.info(`Added Shortcuts: ${shortcuts}`);
};

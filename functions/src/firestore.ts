import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";

import ShortcutInterface from "./interfaces/shortcut";

const app = initializeApp();
const firestore = getFirestore(app);

export const getShortcutsFromFirestore = async (): Promise<
  ShortcutInterface[]
> => {
  const snapshot = await firestore.collection("shortcuts").get();
  const shortcuts: ShortcutInterface[] = [];
  snapshot.forEach((doc) => {
    const shortcut = doc.data() as ShortcutInterface;
    shortcuts.push(shortcut);
  });
  logger.info(`Read ${shortcuts.length} Shortcuts from Firestore`);
  return shortcuts;
};

export const removeIdenticalShortcuts = (
  shortcuts: ShortcutInterface[],
  storedShortcuts: ShortcutInterface[]
): {
  newShortcuts: ShortcutInterface[];
  updatedShortcuts: ShortcutInterface[];
} => {
  const newShortcuts = shortcuts.filter((shortcut) =>
    storedShortcuts.every(
      (storedShortcut) => storedShortcut.shortcut !== shortcut.shortcut
    )
  );

  const updatedShortcuts = shortcuts.filter((shortcut) =>
    storedShortcuts.some(
      (storedShortcut) =>
        storedShortcut.shortcut === shortcut.shortcut &&
        storedShortcut.description !== shortcut.description
    )
  );

  logger.info(`${newShortcuts.length} New Shortcuts`);
  logger.info(`${updatedShortcuts.length} Updated Shortcuts`);

  return { newShortcuts, updatedShortcuts };
};

export const addNewShortcuts = async (shortcuts: ShortcutInterface[]) => {
  const batch = firestore.batch();
  shortcuts.forEach((shortcut) => {
    shortcut.added = new Date();
    const docRef = firestore.collection("shortcuts").doc();
    batch.set(docRef, shortcut);
  });
  await batch.commit();
  logger.info(`Added ${shortcuts.length} Shortcuts`);
};

export const updateShortcuts = async (shortcuts: ShortcutInterface[]) => {
  const batch = firestore.batch();
  shortcuts.forEach((shortcut) => {
    shortcut.updated = new Date();
    const docRef = firestore.collection("shortcuts").doc();
    batch.set(docRef, shortcut);
  });
  await batch.commit();
  logger.info(`Updated ${shortcuts.length} Shortcuts`);
};

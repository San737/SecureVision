import AsyncStorage from '@react-native-async-storage/async-storage';

export type SealedItem = {
  id: string;
  uri: string;
  manifest: any;
  createdAt: string;
  status: 'valid' | 'tampered' | 'none';
  hash?: string;
  assetId?: string;
};

const KEY = 'securevision:sealed';

export async function saveSealedItem(item: SealedItem) {
  const list = await getSealedItems();
  const next = [item, ...list.filter(i => i.id !== item.id)];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function getSealedItems(): Promise<SealedItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function getSealedItem(id: string): Promise<SealedItem | null> {
  const list = await getSealedItems();
  return list.find(i => i.id === id) ?? null;
}

export async function deleteSealedItem(id: string): Promise<SealedItem | null> {
  const list = await getSealedItems();
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return null;
  const [removed] = list.splice(idx, 1);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
  return removed ?? null;
}

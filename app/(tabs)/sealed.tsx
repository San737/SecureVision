import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getSealedItems, deleteSealedItem } from '../../utils/storage';
import { router, useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function SealedListScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      load();
      return () => {};
    }, [])
  );

  const load = async () => {
    setLoading(true);
    const list = await getSealedItems();
    setItems(list);
    setLoading(false);
  };

  const onDelete = async (id: string, uri: string) => {
    try {
  await deleteSealedItem(id);
      // Best-effort: remove the image file and its sidecar manifest if present
      if (uri) {
        try { await FileSystem.deleteAsync(uri, { idempotent: true }); } catch {}
      }
      const sidecar = (uri || '').replace(/\.[^./\\?]+(\?.*)?$/, '') + '.manifest.json';
      try { await FileSystem.deleteAsync(sidecar, { idempotent: true }); } catch {}
      // Refresh list
      const list = await getSealedItems();
      setItems(list);
    } catch (e: any) {
      Alert.alert('Delete failed', String(e?.message ?? e));
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text>No sealed images yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 12, gap: 12 }}
      data={items}
      keyExtractor={(it) => it.id}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <TouchableOpacity style={{ flexDirection: 'row', flex: 1, alignItems: 'center', gap: 12 }} onPress={() => router.push({ pathname: '/details', params: { id: item.id } } as any)}>
            <Image source={{ uri: item.uri }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.title}>{item.manifest?.author ?? 'SecureVision'}</Text>
              <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text style={[styles.badge, item.status === 'valid' ? styles.badgeValid : item.status === 'tampered' ? styles.badgeBad : styles.badgeNeutral]}>{item.status}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id, item.uri)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: '#f7f7f7', padding: 10, borderRadius: 8 },
  thumb: { width: 64, height: 64, borderRadius: 6, backgroundColor: '#ddd' },
  title: { fontWeight: '700' },
  meta: { color: '#666', fontSize: 12 },
  badge: { alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, color: '#000', fontWeight: '700', textTransform: 'capitalize' },
  badgeValid: { backgroundColor: '#b7f7c5' },
  badgeBad: { backgroundColor: '#f7b7b7' },
  badgeNeutral: { backgroundColor: '#f0e68c' },
  deleteBtn: { backgroundColor: '#ff4d4f', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  deleteText: { color: '#fff', fontWeight: '700' },
});

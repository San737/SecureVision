import React, { useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { generateManifest, sealImage } from '../utils/c2pa';
import { saveSealedItem } from '../utils/storage';
import * as MediaLibrary from 'expo-media-library';

export default function ConfirmScreen() {
  const params = useLocalSearchParams<{ photo: string; metadata: string }>();
  const [busy, setBusy] = useState(false);

  const photo = useMemo(() => {
    try { return params.photo ? JSON.parse(params.photo) : null; } catch { return null; }
  }, [params.photo]);
  const metadata = useMemo(() => {
    try { return params.metadata ? JSON.parse(params.metadata) : null; } catch { return null; }
  }, [params.metadata]);

  if (!photo) {
    return <View style={styles.center}><Text>Missing photo</Text></View>;
  }

  const onSeal = async () => {
    try {
      setBusy(true);
      const manifest = generateManifest(metadata ?? {});
      const result = await sealImage(photo, manifest);
      const id = result.id;
      let assetId: string | undefined;
      try {
        const perm = await MediaLibrary.requestPermissionsAsync();
        if (perm.status === 'granted') {
          await MediaLibrary.saveToLibraryAsync(result.uri);
        }
      } catch {}

      await saveSealedItem({
        id,
        uri: result.uri,
        manifest,
        createdAt: metadata?.timestamp ?? new Date().toISOString(),
        status: result.verification?.status ?? 'valid',
        hash: result.hash,
  assetId,
      });

  // already attempted save above

      Alert.alert('Sealed', 'Image sealed successfully');
  router.replace('/(tabs)/sealed' as any);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to seal image');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image source={{ uri: photo.uri }} style={styles.preview} resizeMode="contain" />
      <View style={styles.card}>
        <Text style={styles.h2}>Metadata</Text>
        <Text>Timestamp: {metadata?.timestamp}</Text>
        {metadata?.location && (
          <Text>Location: {metadata.location.lat}, {metadata.location.lon} (±{Math.round(metadata.location.acc ?? 0)}m)</Text>
        )}
        <Text>Device ID: {metadata?.deviceId}</Text>
        <Text>Author: {metadata?.author}</Text>
      </View>
      <TouchableOpacity disabled={busy} onPress={onSeal} style={styles.primary}>
        {busy ? <ActivityIndicator color="#000"/> : <Text style={styles.primaryText}>Seal Image</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  preview: { width: '100%', height: 360, backgroundColor: '#000', borderRadius: 12 },
  card: { backgroundColor: '#f1f1f1', padding: 12, borderRadius: 8, marginTop: 12, gap: 6 },
  h2: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  primary: { backgroundColor: '#ffd33d', paddingVertical: 14, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  primaryText: { fontWeight: '800', color: '#000' },
});

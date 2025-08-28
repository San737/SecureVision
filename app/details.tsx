import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getSealedItem } from '../utils/storage';
import { verifyImage } from '../utils/c2pa';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<any | null>(null);
  const [ver, setVer] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const data = await getSealedItem(String(id));
      setItem(data);
      if (data?.uri) {
        const v = await verifyImage({ uri: data.uri });
        setVer(v);
      }
    })();
  }, [id]);

  if (!item) {
    return <View style={styles.center}><ActivityIndicator /><Text>Loading…</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Image source={{ uri: item.uri }} style={{ width: '100%', height: 320, borderRadius: 12, backgroundColor: '#000' }} resizeMode="contain" />
      <View style={styles.card}>
        <Text style={styles.h2}>Manifest</Text>
        <Text>Author: {item.manifest?.author}</Text>
        <Text>Timestamp: {item.manifest?.timestamp}</Text>
        {item.manifest?.location && (
          <Text>Location: {item.manifest.location.lat}, {item.manifest.location.lon}</Text>
        )}
        <Text>Device ID: {item.manifest?.deviceId}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.h2}>Verification</Text>
        <Text>Status: {ver?.status ?? item.status}</Text>
        {ver?.issuer && <Text>Issuer: {ver?.issuer}</Text>}
        {ver?.errors?.length ? <Text>Errors: {ver.errors.join(', ')}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#f1f1f1', padding: 12, borderRadius: 8 },
  h2: { fontWeight: '700' },
});

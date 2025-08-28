import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { verifyImage } from '../../utils/c2pa';

export default function VerifyScreen() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const img = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!img.canceled && img.assets?.[0]?.uri) {
      setPicked(img.assets[0].uri);
    }
  };

  const onVerify = async () => {
    if (!picked) return;
    setBusy(true);
    const r = await verifyImage({ uri: picked });
    setResult(r);
    setBusy(false);
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TouchableOpacity onPress={pick} style={styles.primary}><Text style={styles.primaryText}>Pick Image</Text></TouchableOpacity>
      {picked && <Image source={{ uri: picked }} style={{ width: '100%', height: 280, borderRadius: 12, backgroundColor: '#000' }} resizeMode="contain"/>}
      <TouchableOpacity onPress={onVerify} disabled={!picked || busy} style={styles.primary}>
        {busy ? <ActivityIndicator color="#000"/> : <Text style={styles.primaryText}>Verify</Text>}
      </TouchableOpacity>
      {result && (
        <View style={styles.card}>
          <Text style={styles.h2}>Verification</Text>
          <Text>Status: {result.status}</Text>
          {result.matchedBy && <Text>Matched by: {result.matchedBy}</Text>}
          {result.issuer && <Text>Issuer: {result.issuer}</Text>}
          {result.fileHash && <Text>File hash: {result.fileHash}</Text>}
          {result.linkedUri && <Text numberOfLines={1}>Linked: {result.linkedUri}</Text>}
          {result.sidecar && <Text numberOfLines={1}>Sidecar: {result.sidecar}</Text>}
          {result.status === 'none' && (
            <Text style={{ marginTop: 6 }}>
              Tip: Seal an image in the Sealed tab, then pick the same file here. If your gallery app creates a copy,
              try verifying from the Sealed list item (tap one to view details) to confirm provenance.
            </Text>
          )}
          {result.errors?.length ? <Text>Errors: {result.errors.join(', ')}</Text> : null}
          {result.manifest && (
            <View style={[styles.card, { marginTop: 8 }]}> 
              <Text style={styles.h2}>Manifest (summary)</Text>
              {result.manifest.author && <Text>Author: {result.manifest.author}</Text>}
              {result.manifest.timestamp && <Text>Timestamp: {result.manifest.timestamp}</Text>}
              {result.manifest.deviceId && <Text>Device ID: {result.manifest.deviceId}</Text>}
              {result.manifest.location && (
                <Text>Location: {result.manifest.location.lat}, {result.manifest.location.lon}</Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  primary: { backgroundColor: '#ffd33d', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  primaryText: { fontWeight: '800', color: '#000' },
  card: { backgroundColor: '#f1f1f1', padding: 12, borderRadius: 8 },
  h2: { fontWeight: '700' },
});

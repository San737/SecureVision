import { Text, View, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
  <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>SecureVision</Text>
  <Text style={{ color: 'white', marginLeft: 18, marginTop: 6, alignContent: 'center', justifyContent: 'center' }}>Demo app to capture and seal photos with provenance metadata and verify them using a simulated C2PA flow.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    
  },
});

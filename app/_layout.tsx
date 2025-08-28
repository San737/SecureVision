import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="confirm" options={{ title: 'Confirm' }} />
  <Stack.Screen name="details" options={{ title: 'Image Details' }} />
    </Stack>
  );
}

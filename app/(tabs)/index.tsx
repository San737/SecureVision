import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    router.replace('/(tabs)/camera' as any);
  }, []);
  return null;
}

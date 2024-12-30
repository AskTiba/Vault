import '../global.css';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

const loadDatabase = async () => {
  const dbName = 'mySQLiteDB.db';
  const dbAsset = require('~/assets/mySQLiteDB.db');
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
      intermediates: true,
    });
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function Layout() {
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded)
    return (
      <View className="flex-1">
        <ActivityIndicator size={'large'} />
        <Text>Loading...</Text>
      </View>
    );

  return (
    <Suspense
      fallback={
        <View className="flex-1 bg-red-600">
          <ActivityIndicator size={'large'} />
          <Text>Loading...</Text>
        </View>
      }>
      <SQLiteProvider useSuspense databaseName="mySQLiteDB.db">
        <Stack />
      </SQLiteProvider>
    </Suspense>
  );
}

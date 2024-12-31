import '../global.css';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

const loadDatabase = async () => {
  const dbName = 'mySQLiteDB.db';
  const dbAsset = require('../assets/mySQLiteDB.db');
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
  const [loaded, error] = useFonts({
    RubikLines: require('../assets/fonts/RubikLines-Regular.ttf'),
    RubikMaps: require('../assets/fonts/RubikMaps-Regular.ttf'),
    RubikMaze: require('../assets/fonts/RubikMaze-Regular.ttf'),
  });

  // useEffect(() => {
  //   if (loaded || error) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded, error]);

  // if (!loaded && !error) {
  //   return null;
  // }

  useEffect(() => {
    loadDatabase()
      .then(() => {
        console.log('Database loaded successfully');
        setDbLoaded(true);
      })
      .catch((e) => console.error('Error loading database:', e));
  }, []);

  if (!dbLoaded)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={'large'} />
        <Text>Loading...</Text>
      </View>
    );

  return (
    <Suspense
      fallback={
        <View className="flex-1 items-center justify-center bg-red-600">
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

import '../global.css';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Alert } from 'react-native';

// Function to load and initialize the database
const loadDatabase = async () => {
  try {
    const dbName = 'mySQLiteDB.db'; // Database file name
    const dbAsset = require('../assets/mySQLiteDB.db'); // Database asset in the project
    const dbUri = Asset.fromModule(dbAsset).uri; // URI for the database asset
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`; // Path where the database will be stored locally

    console.log('Database URI:', dbUri);
    console.log('Document Directory:', FileSystem.documentDirectory);

    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    console.log('Database file exists locally:', fileInfo.exists);

    if (!fileInfo.exists) {
      console.log('Database file not found. Creating directory and downloading...');
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
        intermediates: true,
      });

      const asset = Asset.fromModule(dbAsset);
      await asset.downloadAsync(); // Ensure asset is downloaded
      console.log('Asset downloaded to:', asset.localUri);

      await FileSystem.downloadAsync(dbUri, dbFilePath); // Copy database to the expected location
      console.log('Database downloaded successfully to:', dbFilePath);
    } else {
      console.log('Database already exists at:', dbFilePath);
    }
  } catch (error) {
    console.error('Error in loadDatabase:', error);
    throw error; // Propagate the error for further handling
  }
};

export default function Layout() {
  const [dbLoaded, setDbLoaded] = useState<boolean>(false); // State to track database loading
  const [fontsLoaded, fontsError] = useFonts({
    RubikLines: require('../assets/fonts/RubikLines-Regular.ttf'),
    RubikMaps: require('../assets/fonts/RubikMaps-Regular.ttf'),
    RubikMaze: require('../assets/fonts/RubikMaze-Regular.ttf'),
  }); // Load fonts asynchronously

  // Hide the splash screen once the fonts are loaded
  useEffect(() => {
    if (fontsLoaded && !fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  // Initialize the database once the component is mounted
  useEffect(() => {
    loadDatabase()
      .then(() => {
        console.log('Database loaded successfully');
        setDbLoaded(true);
      })
      .catch((error) => {
        console.error('Error loading database:', error);
        Alert.alert('Database Error', 'Failed to load the database. Please restart the app.');
      });
  }, []);

  // Handle timeout for loading database and fonts
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!dbLoaded || !fontsLoaded) {
        console.error('Timeout: Database or fonts not loaded within the expected time.');
        Alert.alert(
          'Loading Timeout',
          'Database or fonts failed to load in time. Please restart the app.'
        );
      }
    }, 10000); // Set a timeout for 10 seconds

    return () => clearTimeout(timeout);
  }, [dbLoaded, fontsLoaded]);

  // Show loading screen until both fonts and database are ready
  if (!dbLoaded || !fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#32cd32]">
        <ActivityIndicator size="large" />
        <Text>Loading resources, please wait...</Text>
      </View>
    );
  }

  // Once the database and fonts are loaded, render the app
  return (
    <SQLiteProvider useSuspense databaseName="mySQLiteDB.db">
      <Stack screenOptions={{ animation: 'slide_from_left' }} />
    </SQLiteProvider>
  );
}

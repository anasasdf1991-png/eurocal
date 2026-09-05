import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DiaryScreen from './src/screens/DiaryScreen';
import SearchScreen from './src/screens/SearchScreen';
import AddMealScreen from './src/screens/AddMealScreen';
import WeeklyReportScreen from './src/screens/WeeklyReportScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Diary"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Diary" component={DiaryScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="AddMeal" component={AddMealScreen} />
        <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

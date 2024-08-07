import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import getMenuData from './src/menuUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Meal {
  mealTime: string;
  dishes: string[];
}

interface Restaurant {
  name: string;
  meals: Meal[];
}

interface Menu {
  lastUpdate: string;
  restaurants: {
    studentRestaurant: Restaurant[];
    professorRestaurant: Restaurant[];
    dining27Restaurant: Restaurant[];
    dorm1Restaurant: Restaurant[];
  };
}

const Tab = createMaterialTopTabNavigator();

interface DiningProps {
  data: Restaurant[];
  theme: any;
}

const DiningScreen = ({ data, theme }: DiningProps) => {
  if (data.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.BACKGROUND_COLOR }]}>
        <Text style={[styles.message, { color: theme.TEXT_COLOR_LIGHT }]}>
          메뉴가 준비되지 않았어요
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.fullScreen, { backgroundColor: theme.BACKGROUND_COLOR }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View
            style={[
              styles.restaurantCard,
              { backgroundColor: theme.LIST_BACKGROUND_COLOR },
            ]}
          >
            <Text style={[styles.restaurantTitle, { color: theme.TEXT_COLOR_BLACK }]}>
              {item.name}
            </Text>
            {item.meals.length > 0 ? (
              item.meals.map((meal, index) => (
                <View key={index} style={styles.mealContainer}>
                  <Text style={[styles.mealTime, { color: theme.TEXT_COLOR }]}>
                    {meal.mealTime}
                  </Text>
                  {meal.dishes.length > 0 ? (
                    meal.dishes.map((dish, idx) => (
                      <Text key={idx} style={[styles.dish, { color: theme.TEXT_COLOR }]}>
                        {dish}
                      </Text>
                    ))
                  ) : (
                    <Text style={[styles.message, { color: theme.TEXT_COLOR_LIGHT }]}>
                      메뉴가 준비되지 않았어요
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={[styles.message, { color: theme.TEXT_COLOR_LIGHT }]}>
                메뉴가 준비되지 않았어요
              </Text>
            )}
          </View>
        )}
        contentContainerStyle={{ backgroundColor: theme.BACKGROUND_COLOR }}
      />
    </View>
  );
};

// Light theme color constants
const LIGHT_THEME = {
  BACKGROUND_COLOR: '#f9f9f9',
  HEADER_BACKGROUND_COLOR: '#ffffff',
  HEADER_SELECTED_COLOR: '#d0e1ff',
  HEADER_UNSELECTED_COLOR: '#f0f0f0',
  TEXT_COLOR: '#333333',
  TEXT_COLOR_LIGHT: '#757575',
  TEXT_COLOR_BLACK: '#000000',
  LIST_BACKGROUND_COLOR: '#ffffff',
  LIST_BORDER_COLOR: '#e0e0e0',
  TAB_BAR_BACKGROUND_COLOR: '#ffffff',
  TAB_BAR_ACTIVE_COLOR: '#000000',
  TAB_BAR_INACTIVE_COLOR: '#757575',
};

// Dark theme color constants
const DARK_THEME = {
  BACKGROUND_COLOR: '#121212',
  HEADER_BACKGROUND_COLOR: '#1e1e1e',
  HEADER_SELECTED_COLOR: '#373737',
  HEADER_UNSELECTED_COLOR: '#272727',
  TEXT_COLOR: '#e0e0e0',
  TEXT_COLOR_LIGHT: '#a1a1a1',
  TEXT_COLOR_BLACK: '#ffffff',
  LIST_BACKGROUND_COLOR: '#1e1e1e',
  LIST_BORDER_COLOR: '#373737',
  TAB_BAR_BACKGROUND_COLOR: '#1e1e1e',
  TAB_BAR_ACTIVE_COLOR: '#ffffff',
  TAB_BAR_INACTIVE_COLOR: '#a1a1a1',
};

const App = () => {
  const [menuData, setMenuData] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(LIGHT_THEME);

  const toggleTheme = async () => {
    const newTheme = theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    setTheme(newTheme);
    await AsyncStorage.setItem(
      'theme',
      newTheme === LIGHT_THEME ? 'light' : 'dark',
    );
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await getMenuData();
        setMenuData(data); // 상태 업데이트
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setTheme(DARK_THEME);
      } else {
        setTheme(LIGHT_THEME);
      }
    };

    fetchMenuData(); // 비동기 함수 호출
    loadTheme(); // Load theme from AsyncStorage
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={[styles.container, { backgroundColor: theme.BACKGROUND_COLOR }]}
      />
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <View style={styles.rootContainer}>
            {/* Background View */}
            <View
              style={[
                styles.background,
                { backgroundColor: theme.BACKGROUND_COLOR },
              ]}
            />

            <SafeAreaView style={styles.content}>
              {/* Display the current date */}
              <View
                style={[
                  styles.dateContainer,
                  { backgroundColor: theme.HEADER_BACKGROUND_COLOR },
                ]}
              >
                <Text style={[styles.dateText, { color: theme.TEXT_COLOR }]}>
                  {`${menuData?.lastUpdate}`}
                </Text>

                {/* Theme Toggle Button */}
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    { backgroundColor: theme.HEADER_BACKGROUND_COLOR },
                  ]}
                  onPress={toggleTheme}
                >
                  <Text style={{ color: theme.TEXT_COLOR }}>
                    {theme === LIGHT_THEME ? '🌙' : '☀️'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Tab.Navigator
                screenOptions={{
                  tabBarStyle: {
                    backgroundColor: theme.TAB_BAR_BACKGROUND_COLOR,
                  },
                  tabBarActiveTintColor: theme.TAB_BAR_ACTIVE_COLOR,
                  tabBarInactiveTintColor: theme.TAB_BAR_INACTIVE_COLOR,
                  tabBarIndicatorStyle: {
                    backgroundColor: theme.TAB_BAR_ACTIVE_COLOR,
                  },
                }}
              >
                <Tab.Screen name="학생 식당">
                  {() => (
                    <DiningScreen
                      data={menuData?.restaurants.studentRestaurant || []}
                      theme={theme}
                    />
                  )}
                </Tab.Screen>
                <Tab.Screen name="교수 식당">
                  {() => (
                    <DiningScreen
                      data={menuData?.restaurants.professorRestaurant || []}
                      theme={theme}
                    />
                  )}
                </Tab.Screen>
                <Tab.Screen name="27호관 식당">
                  {() => (
                    <DiningScreen
                      data={menuData?.restaurants.dining27Restaurant || []}
                      theme={theme}
                    />
                  )}
                </Tab.Screen>
                <Tab.Screen name="1기숙사 식당">
                  {() => (
                    <DiningScreen
                      data={menuData?.restaurants.dorm1Restaurant || []}
                      theme={theme}
                    />
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            </SafeAreaView>
          </View>
        </SafeAreaProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

// Additional style for full-screen background
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
  restaurantCard: {
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  mealContainer: {
    marginBottom: 16,
    padding: 8,
    borderBottomWidth: 1,
  },
  mealTime: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  dish: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  dateContainer: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  dateText: {
    fontSize: 18,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 20,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Ensuring it appears above other components
  },
});

export default App;

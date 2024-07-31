import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import getMenuData from './src/menuUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WidgetPreview} from 'react-native-android-widget';
import {HaksickWidget} from './src/widgets/HaksickWidget.tsx';

export function HaksickWidgetPreviewScreen() {
  return (
    <View style={styles22.container}>
      <WidgetPreview
        renderWidget={() => <HaksickWidget type={'asdasd'} />}
        width={320}
        height={200}
      />
    </View>
  );
}

const styles22 = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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
}

const DiningScreen = ({data}: DiningProps) => {
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>메뉴가 준비되지 않았어요</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.name}
      renderItem={({item}) => (
        <View style={styles.restaurantCard}>
          <Text style={styles.restaurantTitle}>{item.name}</Text>
          {item.meals.length > 0 ? (
            item.meals.map((meal, index) => (
              <View key={index} style={styles.mealContainer}>
                <Text style={styles.mealTime}>{meal.mealTime}</Text>
                {meal.dishes.length > 0 ? (
                  meal.dishes.map((dish, idx) => (
                    <Text key={idx} style={styles.dish}>
                      {dish}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.message}>메뉴가 준비되지 않았어요</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.message}>메뉴가 준비되지 않았어요</Text>
          )}
        </View>
      )}
    />
  );
};

const App = () => {
  const [menuData, setMenuData] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await getMenuData();
        // console.log(data); // 데이터를 콘솔에 출력
        setMenuData(data); // 상태 업데이트
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    // AsyncStorage.clear(); // 전체 데이터 삭제, 필요에 따라 주석 처리
    fetchMenuData(); // 비동기 함수 호출
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={styles.container}
      />
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <Tab.Navigator>
            <Tab.Screen name="Student Dining">
              {() => (
                <DiningScreen
                  data={menuData?.restaurants.studentRestaurant || []}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Professor Dining">
              {() => (
                <DiningScreen
                  data={menuData?.restaurants.professorRestaurant || []}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="27호관 Dining">
              {() => (
                <DiningScreen
                  data={menuData?.restaurants.dining27Restaurant || []}
                />
              )}
            </Tab.Screen>
            {/*<Tab.Screen name="1기숙사 Dining">*/}
            {/*  {() => <DiningScreen data={menuData?.restaurants.dorm1Restaurant || []} />}*/}
            {/*</Tab.Screen>*/}
            <Tab.Screen name="1기숙사 Dining">
              {() => <HaksickWidgetPreviewScreen />}
            </Tab.Screen>
          </Tab.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  message: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  restaurantCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    borderBottomColor: '#eee',
  },
  mealTime: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  dish: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
    textAlign: 'center',
  },
});

export default App;

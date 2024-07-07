import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Button, Card, Title, Paragraph, Appbar, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fetchStudentMenu, fetchProfessorMenu, saveMenuToStorage } from './src/menuUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Menu {
  mealTime: string;
  dishes: string[];
}

const App: React.FC = () => {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [menuType, setMenuType] = useState<'student' | 'professor'>('student');
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // 항상 새로 데이터를 불러오게 설정
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
      const studentMenu = await fetchStudentMenu();
      const professorMenu = await fetchProfessorMenu();

      // 주석 처리: 기존 데이터를 확인하지 않고 항상 새 데이터를 저장
      // const studentData = await getMenuFromStorage('studentMenu');
      // const professorData = await getMenuFromStorage('professorMenu');

      // const studentMenu = studentData && studentData.date === currentDate ? studentData.menu : await fetchStudentMenu();
      // const professorMenu = professorData && professorData.date === currentDate ? professorData.menu : await fetchProfessorMenu();

      await saveMenuToStorage('studentMenu', studentMenu, currentDate);
      await saveMenuToStorage('professorMenu', professorMenu, currentDate);

      const menuFromStorage = menuType === 'student' ? studentMenu : professorMenu;
      setMenu(menuFromStorage);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [menuType]);

  const renderItem = ({ item }: { item: Menu }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.mealTime}</Title>
        {item.dishes.map((dish, index) => (
          <Paragraph key={index} style={styles.dish}>{dish}</Paragraph>
        ))}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          <Appbar.Header>
            <Appbar.Content title="식단 메뉴" />
          </Appbar.Header>
          <View style={styles.buttonContainer}>
            <Button mode={menuType === 'student' ? 'contained' : 'outlined'} onPress={() => setMenuType('student')}>학생 식당</Button>
            <Button mode={menuType === 'professor' ? 'contained' : 'outlined'} onPress={() => setMenuType('professor')}>교수 식당</Button>
          </View>
          <FlatList
            data={menu}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  dish: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

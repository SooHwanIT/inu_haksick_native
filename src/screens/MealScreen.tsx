import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllMealData } from '../services/fetchAllMealData'; // 식단 데이터를 가져오는 함수 임포트

// 고정된 식당 정보
const cafeterias = [
    { name: '학생식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNEMSUyNg%3D%3D' },
    { name: '제 1기숙사 식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNEMiUyNg%3D%3D' },
    { name: '2호관 교직원 식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNEMyUyNg%3D%3D' },
    { name: '27호관 식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNENCUyNg%3D%3D' },
    { name: '사범대 식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNENSUyNg%3D%3D' },
];

const MealScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCafeteria, setSelectedCafeteria] = useState(cafeterias[0].name); // 첫 번째 식당을 기본 선택
    const [dates, setDates] = useState<string[]>([]);
    const [mealData, setMealData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    // 오늘 날짜 가져오기 (YYYY-MM-DD(요일) 형식)
    const getTodayDateWithDay = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(today.getDate()).padStart(2, '0');
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][today.getDay()];
        return `${year}-${month}-${day}(${dayOfWeek})`;
    };

    // 날짜에서 요일 제거하기
    const removeDayOfWeek = (dateString: string) => {
        // YYYY-MM-DD(요일) 형식에서 (요일)을 제거
        return dateString.replace(/\(\w+\)$/, '');
    };

    useEffect(() => {
        const fetchData = async () => {
            // 데이터를 불러오는 동안 로딩 상태를 true로 설정
            setLoading(true);

            // 오늘 날짜
            const today = getTodayDateWithDay();

            // 로컬 스토리지에서 식단 데이터를 불러옴
            const storedData = await AsyncStorage.getItem('allMealData');
            // console.log(storedData);
            const allMeals = storedData ? JSON.parse(storedData) : [];
            const uniqueDates = Array.from(new Set(allMeals.filter((meal: any) => meal.cafeteria === cafeterias[0].name).map((meal: any) => meal.date)));

            // console.log("Unique Dates:", uniqueDates); // 디버깅: 고유 날짜 확인

            setDates(uniqueDates);

            // 오늘 날짜가 있으면 선택, 없으면 fetchAllMealData 호출
            if (uniqueDates.includes(today)) {
                setSelectedDate(today);
                setMealData(allMeals.filter((meal: any) => meal.date === today && meal.cafeteria === cafeterias[0].name));
                setLoading(false);
            } else {
                // 오늘 날짜가 없으면 fetchAllMealData 호출
                await fetchAllMealData();

                // 데이터를 다시 불러옴
                const updatedStoredData = await AsyncStorage.getItem('allMealData');
                const updatedAllMeals = updatedStoredData ? JSON.parse(updatedStoredData) : [];
                const updatedUniqueDates = Array.from(new Set(updatedAllMeals.filter((meal: any) => meal.cafeteria === cafeterias[0].name).map((meal: any) => meal.date)));

                setDates(updatedUniqueDates);

                // 오늘 날짜가 데이터에 포함되어 있으면 선택
                if (updatedUniqueDates.includes(today)) {
                    setSelectedDate(today);
                    setMealData(updatedAllMeals.filter((meal: any) => meal.date === today && meal.cafeteria === cafeterias[0].name));
                } else if (updatedUniqueDates.length > 0) {
                    setSelectedDate(updatedUniqueDates[0]);
                    setMealData(updatedAllMeals.filter((meal: any) => meal.date === updatedUniqueDates[0] && meal.cafeteria === cafeterias[0].name));
                }

                // 데이터를 모두 불러왔으니 로딩 상태를 false로 변경
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filterMeals = async () => {
            const storedData = await AsyncStorage.getItem('allMealData');
            const allMeals = storedData ? JSON.parse(storedData) : [];
            const filteredMeals = allMeals
                .filter((meal: any) =>
                    (!selectedDate || meal.date === selectedDate) &&
                    (!selectedCafeteria || meal.cafeteria === selectedCafeteria)
                );
            setMealData(filteredMeals);
        };

        filterMeals();
    }, [selectedDate, selectedCafeteria]);

    // 로딩 중일 때 표시할 화면
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6fa3ef" />
                <Text style={styles.loadingText}>데이터를 불러오는 중입니다...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* 날짜 선택기 */}
                <FlatList
                    horizontal
                    data={dates}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedDate(item)}>
                            <Text style={[styles.button, selectedDate === item && styles.selectedButton]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />

                {/* 식당 선택기 */}
                <FlatList
                    horizontal
                    data={cafeterias}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedCafeteria(item.name)}>
                            <Text style={[styles.button, selectedCafeteria === item.name && styles.selectedButton]}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* 식단 데이터 표시 */}
            <ScrollView style={styles.mealList}>
                {mealData.length > 0 ? (
                    mealData.map((meal, index) => (
                        <View key={index} style={styles.mealItem}>
                            <Text style={styles.mealDate}>{meal.date}</Text>
                            <Text style={styles.mealType}>{meal.type}</Text>
                            <Text style={styles.mealMenu}>{meal.menu}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>선택된 날짜와 식당에 대한 식단 데이터가 없습니다.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { paddingBottom: 16 },
    button: { padding: 10, margin: 5, borderWidth: 1, borderRadius: 5, fontSize: 14 },
    selectedButton: { backgroundColor: '#6fa3ef', color: 'white' },
    mealList: { flex: 1 },
    mealItem: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 },
    mealDate: { fontSize: 12, color: '#666' },
    mealType: { fontSize: 16, fontWeight: 'bold' },
    mealMenu: { fontSize: 14 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16 },
    noDataText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#888' },
});

export default MealScreen;

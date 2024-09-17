import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllMealData } from '../services/fetchAllMealData'; // 식단 데이터를 가져오는 함수 임포트

const cafeterias = [
    { name: '학생식당' },
    { name: '제 1기숙사 식당' },
    { name: '2호관 교직원 식당' },
    { name: '27호관 식당' },
    { name: '사범대 식당' },
];

const MealScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCafeteria, setSelectedCafeteria] = useState(cafeterias[0].name);
    const [dates, setDates] = useState<string[]>([]);
    const [mealData, setMealData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getTodayDateWithDay = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][today.getDay()];
        return `${year}-${month}-${day}(${dayOfWeek})`;
    };

    const removeDayOfWeek = (dateString: string) => {
        return dateString.replace(/\(\w+\)$/, '');
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const today = getTodayDateWithDay();
            const storedData = await AsyncStorage.getItem('allMealData');
            const allMeals = storedData ? JSON.parse(storedData) : [];
            const uniqueDates = Array.from(new Set(allMeals.filter((meal: any) => meal.cafeteria === cafeterias[0].name).map((meal: any) => meal.date)));
            setDates(uniqueDates);

            if (uniqueDates.includes(today)) {
                setSelectedDate(today);
                setMealData(allMeals.filter((meal: any) => meal.date === today && meal.cafeteria === cafeterias[0].name));
                setLoading(false);
            } else {
                await fetchAllMealData();
                const updatedStoredData = await AsyncStorage.getItem('allMealData');
                const updatedAllMeals = updatedStoredData ? JSON.parse(updatedStoredData) : [];
                const updatedUniqueDates = Array.from(new Set(updatedAllMeals.filter((meal: any) => meal.cafeteria === cafeterias[0].name).map((meal: any) => meal.date)));

                setDates(updatedUniqueDates);

                if (updatedUniqueDates.includes(today)) {
                    setSelectedDate(today);
                    setMealData(updatedAllMeals.filter((meal: any) => meal.date === today && meal.cafeteria === cafeterias[0].name));
                } else if (updatedUniqueDates.length > 0) {
                    setSelectedDate(updatedUniqueDates[0]);
                    setMealData(updatedAllMeals.filter((meal: any) => meal.date === updatedUniqueDates[0] && meal.cafeteria === cafeterias[0].name));
                }
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
                <View style={styles.flatListWrapper}>
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
                </View>
                <View style={styles.flatListWrapper}>
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
            </View>

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
    container: {
        flex: 1,
        // paddingHorizontal: 16, // 좌우 패딩을 조정해 화면에서 너무 붙지 않게
        paddingVertical: 8,    // 상하 패딩을 추가해 자연스럽게
        backgroundColor: '#f0f4f8',
    },
    header: {
        marginBottom: 10,       // 아래에 더 넉넉한 간격 추가
        // paddingVertical: 8,     // 위아래 패딩 조정
        // paddingHorizontal: 5,   // 좌우 패딩 조금 줄임
        // borderRadius: 12,
        // backgroundColor: '#ffffff',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        // elevation: 5,
    },
    flatListWrapper: {
        marginBottom: 5,       // 리스트 간의 간격을 조금 더 넓힘
    },
    button: {
        paddingVertical: 10,    // 버튼 안의 패딩을 유지
        paddingHorizontal: 12,  // 좌우 패딩을 조금 줄여 더 컴팩트하게
        marginHorizontal: 8,    // 버튼 사이의 간격을 적당히 유지
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        fontSize: 14,
        backgroundColor: '#f9fafb',
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    selectedButton: {
        backgroundColor: '#1e90ff',
        color: 'white',
        borderWidth: 0,
    },
    mealList: {
        flex: 1,

        paddingHorizontal: 16, // 좌우 패딩을 조정해 화면에서 너무 붙지 않게
        // marginTop: 10,          // 위아래 여백을 조금 추가
    },
    mealItem: {
        marginBottom: 15,       // 각 식단 아이템 간의 간격
        padding: 12,            // 내부 패딩을 조금 줄여 너무 커 보이지 않게
        borderRadius: 8,        // 모서리 둥글기 살짝 줄임
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    mealDate: {
        fontSize: 12,
        color: '#999',
    },
    mealType: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    mealMenu: {
        fontSize: 14,
        color: '#555',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
});

export default MealScreen;

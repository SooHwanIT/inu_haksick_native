// 필요한 모듈 및 라이브러리 임포트
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllMealData } from '../services/fetchAllMealData'; // 식단 데이터를 가져오는 함수 임포트
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';

import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';

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
    const viewShotRefs = useRef<any>({});

    const getTodayDateWithDay = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
        return `${year}-${month}-${day}(${dayOfWeek})`;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const today = getTodayDateWithDay();
            const storedData = await AsyncStorage.getItem('allMealData');
            const allMeals = storedData ? JSON.parse(storedData) : [];
            const uniqueDates = Array.from(
                new Set(
                    allMeals
                        .filter((meal: any) => meal.cafeteria === cafeterias[0].name)
                        .map((meal: any) => meal.date)
                )
            );
            setDates(uniqueDates);

            if (uniqueDates.includes(today)) {
                setSelectedDate(today);
                setMealData(
                    allMeals.filter(
                        (meal: any) => meal.date === today && meal.cafeteria === cafeterias[0].name
                    )
                );
                setLoading(false);
            } else {
                await fetchAllMealData();
                const updatedStoredData = await AsyncStorage.getItem('allMealData');
                const updatedAllMeals = updatedStoredData ? JSON.parse(updatedStoredData) : [];
                const updatedUniqueDates = Array.from(
                    new Set(
                        updatedAllMeals
                            .filter((meal: any) => meal.cafeteria === cafeterias[0].name)
                            .map((meal: any) => meal.date)
                    )
                );

                setDates(updatedUniqueDates);

                if (updatedUniqueDates.includes(today)) {
                    setSelectedDate(today);
                    setMealData(
                        updatedAllMeals.filter(
                            (meal: any) => meal.date === today && meal.cafeteria === cafeterias[0].name
                        )
                    );
                } else if (updatedUniqueDates.length > 0) {
                    setSelectedDate(updatedUniqueDates[0]);
                    setMealData(
                        updatedAllMeals.filter(
                            (meal: any) =>
                                meal.date === updatedUniqueDates[0] && meal.cafeteria === cafeterias[0].name
                        )
                    );
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
            const filteredMeals = allMeals.filter(
                (meal: any) =>
                    (!selectedDate || meal.date === selectedDate) &&
                    (!selectedCafeteria || meal.cafeteria === selectedCafeteria)
            );
            setMealData(filteredMeals);
        };

        filterMeals();
    }, [selectedDate, selectedCafeteria]);

    // 앱 실행 시 권한 요청
    useEffect(() => {
        const checkAndRequestPermissions = async () => {
            const hasPermission = await checkStoragePermission();
            if (!hasPermission) {
                const granted = await requestStoragePermission();
                if (!granted) {
                    Alert.alert(
                        '권한 필요',
                        '이미지를 저장하기 위해 저장소 접근 권한이 필요합니다.',
                        [
                            {
                                text: '권한 설정',
                                onPress: () => openSettings(),
                            },
                            {
                                text: '취소',
                                style: 'cancel',
                            },
                        ],
                        { cancelable: false }
                    );
                }
            }
        };
        checkAndRequestPermissions();
    }, []);

    // 저장 권한 확인 함수
    const checkStoragePermission = async () => {
        try {
            let permission;
            if (Platform.OS === 'android') {
                if (Platform.Version >= 33) {
                    permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
                } else if (Platform.Version >= 29) {
                    permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
                } else {
                    permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
                }
            } else {
                permission = PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
            }

            const result = await check(permission);
            return result === RESULTS.GRANTED;
        } catch (error) {
            console.error('Permission check error:', error);
            return false;
        }
    };

    // 저장 권한 요청 함수
    const requestStoragePermission = async () => {
        try {
            let permission;
            if (Platform.OS === 'android') {
                if (Platform.Version >= 33) {
                    permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
                } else if (Platform.Version >= 29) {
                    permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
                } else {
                    permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
                }
            } else {
                permission = PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
            }

            const result = await request(permission);

            return result === RESULTS.GRANTED;
        } catch (error) {
            console.error('Permission request error:', error);
            return false;
        }
    };

    // 스크린샷 찍어서 갤러리에 저장하는 함수
    const captureAndSave = async (index: number) => {
        const hasPermission = await checkStoragePermission();
        if (!hasPermission) {
            const granted = await requestStoragePermission();
            if (!granted) {
                Alert.alert(
                    '권한 필요',
                    '이미지를 저장하기 위해 저장소 접근 권한이 필요합니다.',
                    [
                        {
                            text: '권한 설정',
                            onPress: () => openSettings(),
                        },
                        {
                            text: '취소',
                            style: 'cancel',
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }
        }

        const ref = viewShotRefs.current[index];
        if (ref) {
            try {
                const uri = await ref.capture();
                const fileName = `meal_${Date.now()}.jpg`;
                const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;

                await RNFS.moveFile(uri, destPath);

                if (Platform.OS === 'android') {
                    // Android에서 갤러리에 이미지가 나타나도록 스캔
                    await RNFS.scanFile(destPath);
                }

                Alert.alert('성공', '이미지가 갤러리에 저장되었습니다.');
            } catch (error) {
                console.error('Image capture error:', error);
                Alert.alert('오류', '이미지를 저장하는 데 실패했습니다.');
            }
        }
    };

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
            {/* 헤더 섹션 */}
            <View style={styles.header}>
                <View style={styles.flatListWrapper}>
                    <FlatList
                        horizontal
                        data={dates}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setSelectedDate(item)}>
                                <Text style={[styles.button, selectedDate === item && styles.selectedButton]}>
                                    {item}
                                </Text>
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
                                <Text
                                    style={[
                                        styles.button,
                                        selectedCafeteria === item.name && styles.selectedButton,
                                    ]}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>

            {/* 식단 리스트 */}
            <ScrollView style={styles.mealList}>
                {mealData.length > 0 ? (
                    mealData.map((meal, index) => (
                        <ViewShot
                            key={index}
                            ref={(ref) => (viewShotRefs.current[index] = ref)}
                            options={{ format: 'jpg', quality: 0.9 }}
                            style={styles.mealItem}
                        >
                            <View style={styles.mealContent}>
                                <Text style={styles.mealDate}>{meal.date}</Text>
                                <Text style={styles.mealType}>{meal.type}</Text>
                                <Text style={styles.mealMenu}>{meal.menu}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={() => captureAndSave(index)}
                            >

                                <Icon name="camera" size={24} color="black" />
                            </TouchableOpacity>
                        </ViewShot>
                    ))
                ) : (
                    <Text style={styles.noDataText}>
                        선택된 날짜와 식당에 대한 식단 데이터가 없습니다.
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    header: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    flatListWrapper: {
        marginBottom: 5,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        fontSize: 14,
        backgroundColor: '#f9fafb',
        color: '#333',
    },
    selectedButton: {
        backgroundColor: '#1e90ff',
        color: 'white',
        borderWidth: 0,
    },
    mealList: {
        flex: 1,
    },
    mealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 12,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    mealContent: {
        flex: 1,
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
    captureButton: {
        padding: 8,
        backgroundColor: '#1e90ff',
        borderRadius: 24,
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

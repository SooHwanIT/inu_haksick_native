import React from 'react';
import { Button, Text, View, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchAllMealData from '../services/fetchAllMealData.ts'
// const fetchAllMealData = async () => {
//     // 여기에 데이터를 다시 가져오는 로직을 구현하세요
//     console.log("데이터를 다시 가져오는 중...");
// };

const clearStorageAndFetchData = async () => {
    try {
        await AsyncStorage.clear();
        console.log("스토리지 초기화 완료");
        await fetchAllMealData();
        Alert.alert('성공', '모든 데이터가 초기화되고 다시 가져왔습니다.');
    } catch (error) {
        console.error('초기화 중 오류 발생:', error);
        Alert.alert('오류', '데이터 초기화에 실패했습니다.');
    }
};

const SettingsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>설정 화면</Text>

            <TouchableOpacity style={styles.button} onPress={clearStorageAndFetchData}>
                <Text style={styles.buttonText}>데이터 초기화</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>돌아가기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;

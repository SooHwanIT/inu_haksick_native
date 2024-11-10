import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MealScreen from './src/screens/MealScreen'; // 경로에 맞게 수정
import SettingsScreen from './src/screens/SettingsScreen'; // 경로에 맞게 수정
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false, // 헤더를 숨기기 위한 옵션
                    }}
                >
                    <Stack.Screen
                        name="MealScreen"
                        component={MealScreen}
                        options={{ title: 'Meal Screen' }}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{ title: 'Settings' }}
                    />
                </Stack.Navigator>

                {/* 하단에 배너 광고 추가 */}
                <BannerAd
                    unitId="ca-app-pub-9011101777574758/4163481682" // 실제 광고 유닛 ID로 교체
                    size={BannerAdSize.FULL_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true, // 비개인화 광고 옵션 사용
                    }}
                    onAdLoaded={() => {
                        console.log('광고가 성공적으로 로드되었습니다.');
                    }}
                    onAdFailedToLoad={(error) => {
                        console.error('광고 로드 실패', error);
                    }}
                />
            </View>
        </NavigationContainer>
    );
};

export default App;

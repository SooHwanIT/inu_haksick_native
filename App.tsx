import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MealScreen from './src/screens/MealScreen'; // Adjust the path if needed
import SettingsScreen from './src/screens/SettingsScreen'; // Adjust the path if needed
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import Icon from 'react-native-vector-icons/Ionicons'; // Import an icon set from react-native-vector-icons

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            height: 50, // Set the height of the header to make it thinner
                        },
                        headerTitleStyle: {
                            fontSize: 16, // Adjust the font size for a compact look
                        },
                    }}
                >
                    <Stack.Screen
                        name="MealScreen"
                        component={MealScreen}
                        options={({ navigation }) => ({
                            title: 'Meal Screen',
                            headerRight: () => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Settings')}
                                    style={{ marginRight: 15 }} // Adjust margin if needed
                                >
                                    <Icon name="settings-outline" size={24} color="#000" />
                                </TouchableOpacity>
                            ),
                        })}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{ title: 'Settings' }}
                    />
                </Stack.Navigator>

                {/* Add the banner ad at the bottom */}
                <BannerAd
                    unitId="ca-app-pub-9011101777574758/4163481682" // Replace with your Ad Unit ID
                    size={BannerAdSize.FULL_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true, // Use this if you want non-personalized ads
                    }}
                    onAdLoaded={() => {
                        console.log('Ad loaded successfully');
                    }}
                    onAdFailedToLoad={(error) => {
                        console.error('Failed to load ad', error);
                    }}
                />
            </View>
        </NavigationContainer>
    );
};

export default App;

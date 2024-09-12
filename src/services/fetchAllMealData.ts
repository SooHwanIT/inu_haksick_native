import axios from 'axios';
import * as cheerio from 'cheerio';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MealInfo {
    date: string;
    type: string;
    menu: string;
    cafeteria: string;
}

const cafeterias = [
    { name: '학생식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNEMSUyNg%3D%3D' },
    { name: '제 1기숙사 식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNEMiUyNg%3D%3D' },
    { name: '2호관 교직원 식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNEMyUyNg%3D%3D' },
    { name: '27호관 식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNENCUyNg%3D%3D' },
    { name: '사범대 식당', url: 'https://www.inu.ac.kr/inu/643/subview.do?enc=Zm5jdDF8QEB8JTJGZGluaW5nUm9vbSUyRmludSUyRnZpZXcuZG8lM0ZkYXlUeXBlJTNEd2VlayUyNnJvb21UeXBlJTNENSUyNg%3D%3D' },
];

export async function fetchAllMealData(): Promise<MealInfo[]> {
    try {
        const allMeals: MealInfo[] = [];
        for (const cafeteria of cafeterias) {
            const { data } = await axios.get(cafeteria.url);
            const $ = cheerio.load(data);

            $('.wrap-week').each((index, element) => {
                const date = $(element).find('.date').text().trim();

                $(element).find('table tbody tr').each((_, row) => {
                    const type = $(row).find('th').text().trim();
                    const menu = $(row).find('td').text().trim();

                    if (type && menu) {
                        allMeals.push({ date, type, menu, cafeteria: cafeteria.name });
                    }
                });
            });
        }

        // Save data to local storage
        await AsyncStorage.setItem('allMealData', JSON.stringify(allMeals));

        console.log(allMeals)
        return allMeals;
    } catch (error) {
        console.error('Error fetching all meal data:', error);
        return [];
    }
}

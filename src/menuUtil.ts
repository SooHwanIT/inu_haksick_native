import axios from 'axios';
import { load } from 'cheerio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STUDENT_DINING_URL = 'https://inucoop.com/main.php?mkey=2&w=2&l=1';
const PROFESSOR_DINING_URL = 'https://inucoop.com/main.php?mkey=2&w=2&l=2';

interface Menu {
  mealTime: string;
  dishes: string[];
}

const fetchMenu = async (url: string): Promise<Menu[]> => {
  try {
    const response = await axios.get(url);
    const htmlString = response.data;
    const $ = load(htmlString);

    let newMenu: Menu[] = [];
    const todayIndex = new Date().getDay() % 7; // 일요일이 0이 되도록 조정
    console.log(`Fetching menu for index: ${todayIndex}`); // 디버깅 로그

    $('#menuBox tbody tr').each((i, row) => {
      if (i === 0) {
        return;
      }

      const mealTime = $(row).find('td.corn_nm').text().trim();
      console.log(`Meal time: ${mealTime}`); // 디버깅 로그

      $(row).find('td.din_lists, td.din_list').each((j, cell) => {
        if (j === todayIndex) {
          const dishes = $(cell).html()?.split('<br>').map(d => d.trim()).filter(d => d && d !== "--------------") || [];
          if (dishes.length > 0) {
            newMenu.push({ mealTime, dishes });
          }
        }
      });
    });
    console.log(newMenu); // 디버깅 로그
    return newMenu;
  } catch (error) {
    console.error('Error fetching or parsing HTML:', error);
    throw new Error('Failed to fetch menu data');
  }
};

export const fetchStudentMenu = async (): Promise<Menu[]> => {
  return fetchMenu(STUDENT_DINING_URL);
};

export const fetchProfessorMenu = async (): Promise<Menu[]> => {
  return fetchMenu(PROFESSOR_DINING_URL);
};

export const saveMenuToStorage = async (key: string, menu: Menu[], date: string) => {
  try {
    const data = { date, menu };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving menu to storage:', error);
  }
};

export const getMenuFromStorage = async (key: string): Promise<{ date: string, menu: Menu[] } | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching menu from storage:', error);
    return null;
  }
};

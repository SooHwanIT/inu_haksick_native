import axios from 'axios';
import { load } from 'cheerio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STUDENT_DINING_URL = 'https://inucoop.com/main.php?mkey=2&w=2&l=1';
const PROFESSOR_DINING_URL = 'https://inucoop.com/main.php?mkey=2&w=2&l=2';
const DINING27_URL = 'https://inucoop.com/main.php?mkey=2&w=2&l=4'; // 예시 URL
const DORM1_URL = 'https://inucoop.com/main.php?mkey=2&w=2&l=3'; // 예시 URL

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

// URL로부터 메뉴 데이터를 가져오는 함수
const fetchMenu = async (url: string): Promise<Meal[]> => {
  try {
    const response = await axios.get(url);
    const htmlString = response.data;
    const $ = load(htmlString);

    const newMenu: Meal[] = [];
    const todayIndex = new Date().getDay()-1 % 7;

    $('#menuBox tbody tr').each((i, row) => {
      if (i === 0) return;

      const mealTime = $(row).find('td.corn_nm').text().trim();

      $(row).find('td.din_lists, td.din_list').each((j, cell) => {
        if (j === todayIndex) {
          const dishes = $(cell).html()?.split('<br>')
            .map(d => d.trim())
            .filter(d => d && d !== "--------------") || [];
          if (dishes.length > 0) {
            newMenu.push({ mealTime, dishes });
          }
        }
      });
    });

    return newMenu;
  } catch (error) {
    console.error('Error fetching or parsing HTML:', error);
    throw new Error('Failed to fetch menu data');
  }
};

// 메뉴 데이터를 가져오고 업데이트하는 함수
const getMenuData = async (): Promise<Menu> => {
  try {
    const storedMenuStr = await AsyncStorage.getItem('menu');
    let storedMenu: Menu | null = storedMenuStr ? JSON.parse(storedMenuStr) : null;

    const today = new Date().toISOString().split('T')[0];
    console.log(today)
    // 메뉴 데이터가 없거나 오늘 날짜로 업데이트되지 않은 경우 새로 가져오기
    if (!storedMenu || storedMenu.lastUpdate !== today) {
      const studentRestaurant = await fetchMenu(STUDENT_DINING_URL);
      const professorRestaurant = await fetchMenu(PROFESSOR_DINING_URL);
      const dining27Restaurant = await fetchMenu(DINING27_URL);
      const dorm1Restaurant = await fetchMenu(DORM1_URL);

      // 새로운 메뉴 데이터 생성
      storedMenu = {
        lastUpdate: today,
        restaurants: {
          studentRestaurant: [{ name: 'Student Restaurant', meals: studentRestaurant }],
          professorRestaurant: [{ name: 'Professor Restaurant', meals: professorRestaurant }],
          dining27Restaurant: [{ name: '27호관 Restaurant', meals: dining27Restaurant }],
          dorm1Restaurant: [{ name: '1기숙사 Restaurant', meals: dorm1Restaurant }],
        },
      };

      // 새로운 메뉴 데이터와 업데이트 날짜를 저장
      await AsyncStorage.setItem('menu', JSON.stringify(storedMenu));
    }

    return storedMenu;
  } catch (error) {
    console.error('Error fetching and storing menu data:', error);
    throw new Error('Failed to get menu data');
  }
};

export default getMenuData;

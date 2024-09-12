import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { HaksickWidget } from './src/widgets/HaksickWidget.tsx';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAllMealData } from './src/menuUtil.ts';  // 이미 구현된 데이터 fetch 함수

const nameToWidget = {
  Haksick: HaksickWidget,
};

// 서울 시간 기준으로 현재 날짜 가져오기 (yyyy-mm-dd 형식)
const getTodayDate = () => {
  const seoulTime = new Date();
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [{ value: year }, , { value: month }, , { value: day }] = formatter.formatToParts(seoulTime);
  return `${year}-${month}-${day}`;
};

// item.date에서 요일 정보 제거 (yyyy-mm-dd로 변환)
const removeDayInfo = (dateWithDay: string) => {
  return dateWithDay.split('(')[0]; // 'yyyy-mm-dd' 형식만 남김
};

// 로컬 스토리지에서 오늘 날짜에 해당하는 meal data 가져오기/필터링
async function getTodayAllMealDataFromStorage(): Promise<any> {
  try {
    const today = getTodayDate(); // 오늘 날짜 가져오기
    const storedUpdateDate = await AsyncStorage.getItem('updateDate'); // 저장된 업데이트 날짜
    const storedMealData = await AsyncStorage.getItem('todayMealData'); // 오늘자 식단 데이터

    // 만약 저장된 데이터가 있고, 업데이트 날짜가 오늘이면 해당 데이터 반환
    if (storedUpdateDate === today && storedMealData) {
      console.log("storedMealData", storedMealData);
      return JSON.parse(storedMealData);
    } else {
      // 저장된 데이터가 없거나 업데이트 날짜가 오늘이 아니면 새로운 데이터를 가져옴
      const allMealData = await AsyncStorage.getItem('allMealData');

      // 만약 allMealData가 없다면 fetchAllMealData() 호출해서 데이터를 가져옴
      let fetchedData;
      if (!allMealData) {
        fetchedData = await fetchAllMealData();
        await AsyncStorage.setItem('allMealData', JSON.stringify(fetchedData)); // 새로 가져온 데이터를 저장
      } else {
        fetchedData = JSON.parse(allMealData); // 기존 데이터를 사용
      }

      // 오늘 날짜에 해당하는 데이터를 필터링
      const todayMealData = fetchedData.filter((item: any) => {
        const itemDate = removeDayInfo(item.date); // 'yyyy-mm-dd' 형식으로 변환
        return itemDate === today; // 오늘 날짜와 일치하는 데이터만 반환
      });

      // 필터링된 오늘자 데이터를 로컬 스토리지에 저장

      await AsyncStorage.setItem('todayMealData', JSON.stringify(todayMealData));
      await AsyncStorage.setItem('updateDate', today); // 업데이트 날짜 저장
      console.log('todayMealData',todayMealData)
      return todayMealData;
    }
  } catch (error) {
    console.error('Failed to load or update today meal data:', error);
    return [];
  }
}

// 테마 가져오기
async function getThemeFromStorage(): Promise<'light' | 'dark'> {
  try {
    const theme = await AsyncStorage.getItem('theme');
    return (theme === 'dark' || theme === 'light') ? (theme as 'light' | 'dark') : 'light';
  } catch (error) {
    console.error('Failed to load theme from storage:', error);
    return 'light'; // Default to 'light' on error
  }
}

// 위젯 핸들러 함수
export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  try {
    // 공통적으로 테마를 가져옴
    const theme = await getThemeFromStorage();

    // 공통적으로 로컬 스토리지에서 todayMealData를 가져옴
    const todayMealData = await getTodayAllMealDataFromStorage();

    if (!todayMealData.length) {
      console.error('No meal data available');
      return;
    }

    switch (props.widgetAction) {
      case 'WIDGET_ADDED':
        if (widgetInfo.widgetName === 'Haksick') {
          // console.log('Widget added with data:', todayMealData);
          props.renderWidget(<Widget data={todayMealData} theme={theme} />);
        }
        break;

      case 'WIDGET_UPDATE':
        if (widgetInfo.widgetName === 'Haksick') {
          // console.log('Widget updated with data:', todayMealData);
          props.renderWidget(<Widget data={todayMealData} theme={theme} />);
        }
        break;

      case 'WIDGET_RESIZED':
        if (widgetInfo.widgetName === 'Haksick') {
          // console.log('Widget resized with data:', todayMealData);
          props.renderWidget(<Widget data={todayMealData} theme={theme} />);
        }
        break;

      case 'WIDGET_DELETED':
        // 위젯이 삭제된 경우 특별한 처리는 필요 없으므로 pass
        break;

      case 'WIDGET_CLICK':
        if (props.clickAction === 'CHANGE_MENU') {
          const clickedType = props.clickActionData?.id || '학생식당';
          // console.log(`Widget clicked to change menu to: ${clickedType}`);
          props.renderWidget(<Widget data={todayMealData} type={clickedType} theme={theme} />);
        } else if (props.clickAction === 'REFRESH_WIDGET') {
          // console.log('Widget refreshed with data:', todayMealData);
          props.renderWidget(<Widget data={todayMealData} theme={theme} />);
        }
        break;

      default:
        break;
    }
  } catch (error) {
    console.error('Failed to handle widget task:', error);
  }
}

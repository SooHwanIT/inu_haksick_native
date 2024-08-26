import React from 'react';
import {FlexWidget, ListWidget, TextWidget} from 'react-native-android-widget';

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

interface HaksickWidgetProps {
  data: Menu;
  type?: string; // type을 선택적으로 변경 (기본값을 설정할 수 있도록)
  theme: 'light' | 'dark';
}

// Light theme color constants
const LIGHT_THEME = {
  BACKGROUND_COLOR: '#f9f9f9',
  HEADER_BACKGROUND_COLOR: '#ffffff',
  HEADER_SELECTED_COLOR: '#d0e1ff',
  HEADER_UNSELECTED_COLOR: '#f0f0f0',
  TEXT_COLOR: '#333333',
  TEXT_COLOR_LIGHT: '#757575',
  TEXT_COLOR_BLACK: '#000000',
  LIST_BACKGROUND_COLOR: '#ffffff',
  LIST_BORDER_COLOR: '#e0e0e0',
};

// Dark theme color constants
const DARK_THEME = {
  BACKGROUND_COLOR: '#2e2e2e',
  HEADER_BACKGROUND_COLOR: '#3a3a3a',
  HEADER_SELECTED_COLOR: '#6c7ae0',
  HEADER_UNSELECTED_COLOR: '#4a4a4a',
  TEXT_COLOR: '#ffffff',
  TEXT_COLOR_LIGHT: '#cccccc',
  TEXT_COLOR_BLACK: '#ffffff',
  LIST_BACKGROUND_COLOR: '#3a3a3a',
  LIST_BORDER_COLOR: '#5a5a5a',
};

export function HaksickWidget({data, type = 'student', theme}: HaksickWidgetProps) { // 기본값 설정
  const headerHeight = 42;
  const headerFontSize = 14;
  const bodyFontSize = 12;

  // Select the theme colors based on the theme prop
  const colors = theme === 'dark' ? DARK_THEME : LIGHT_THEME;

  // Select restaurant data based on type
  const selectedRestaurant = (() => {
    switch (type) {
      case 'student':
        return data.restaurants.studentRestaurant;
      case 'professor':
        return data.restaurants.professorRestaurant;
      case 'dining27':
        return data.restaurants.dining27Restaurant;
      case 'dorm1':
        return data.restaurants.dorm1Restaurant;
      default:
        return [];
    }
  })();

  const hasData = selectedRestaurant.length > 0 && selectedRestaurant[0].meals.length > 0;

  return (
    <FlexWidget
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: colors.BACKGROUND_COLOR,
        height: 'match_parent',
        width: 'match_parent',
        borderRadius: 8,
        padding: 4,
        flexDirection: 'column',
      }}>
      {/* Date */}
      <TextWidget
        style={{
          fontSize: headerFontSize,
          color: colors.TEXT_COLOR,
          textAlign: 'center',
          paddingVertical: 6,
          width: 'match_parent',
        }}
        text={`${data.lastUpdate}`}
      />

      {/* Header */}
      <FlexWidget
        style={{
          backgroundColor: colors.HEADER_BACKGROUND_COLOR,
          height: headerHeight,
          width: 'match_parent',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          flexDirection: 'row',
        }}>
        {/* Student Restaurant */}
        <FlexWidget
          clickAction="CHANGE_MENU"
          clickActionData={{id: 'student'}}
          style={{
            height: headerHeight,
            justifyContent: 'center',
            backgroundColor: type === 'student' ? colors.HEADER_SELECTED_COLOR : colors.HEADER_UNSELECTED_COLOR,
            paddingHorizontal: 12,
            borderTopLeftRadius: 12,
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: colors.TEXT_COLOR_BLACK}}
            text="학생 식당"
          />
        </FlexWidget>
        {/* Professor Restaurant */}
        <FlexWidget
          clickAction="CHANGE_MENU"
          clickActionData={{id: 'professor'}}
          style={{
            height: headerHeight,
            justifyContent: 'center',
            backgroundColor: type === 'professor' ? colors.HEADER_SELECTED_COLOR : colors.HEADER_UNSELECTED_COLOR,
            paddingHorizontal: 12,
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: colors.TEXT_COLOR_BLACK}}
            text="교수 식당"
          />
        </FlexWidget>

        {/* Dining27 Restaurant */}
        <FlexWidget
          clickAction="CHANGE_MENU"
          clickActionData={{id: 'dining27'}}
          style={{
            height: headerHeight,
            justifyContent: 'center',
            backgroundColor: type === 'dining27' ? colors.HEADER_SELECTED_COLOR : colors.HEADER_UNSELECTED_COLOR,
            paddingHorizontal: 12,
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: colors.TEXT_COLOR_BLACK}}
            text="27호관 식당"
          />
        </FlexWidget>

        {/* Dorm1 Restaurant */}
        <FlexWidget
          clickAction="CHANGE_MENU"
          clickActionData={{id: 'dorm1'}}
          style={{
            height: headerHeight,
            justifyContent: 'center',
            backgroundColor: type === 'dorm1' ? colors.HEADER_SELECTED_COLOR : colors.HEADER_UNSELECTED_COLOR,
            paddingHorizontal: 12,
            borderTopRightRadius: 12,
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: colors.TEXT_COLOR_BLACK}}
            text="1기숙사 식당"
          />
        </FlexWidget>
      </FlexWidget>

      {/* Selected Restaurant's Menu List */}
      {hasData ? (
        <ListWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            backgroundColor: colors.LIST_BACKGROUND_COLOR,
          }}>
          {selectedRestaurant[0].meals.map((item, i) => (
            <FlexWidget
              key={`meal-${i}`}
              clickAction={'OPEN_APP'}
              style={{
                width: 'match_parent',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: colors.LIST_BORDER_COLOR,
              }}>
              <TextWidget
                style={{
                  fontSize: headerFontSize + 8,
                  fontWeight: 'bold',
                  marginBottom: 8,
                  color: colors.TEXT_COLOR,
                  textAlign: 'center',
                }}
                text={item.mealTime}
              />
              {item.dishes.map((meal, j) => (
                <TextWidget
                  key={`dish-${i}-${j}`}
                  style={{
                    fontSize: bodyFontSize,
                    color: colors.TEXT_COLOR_LIGHT,
                    textAlign: 'center',
                  }}
                  text={meal}
                />
              ))}
            </FlexWidget>
          ))}
        </ListWidget>
      ) : (
        <FlexWidget
          clickAction="REFRESH_WIDGET" // 새로고침 동작
          style={{
            height: 'match_parent',
            width: 'match_parent',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.LIST_BACKGROUND_COLOR,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}>
          <TextWidget
            style={{
              fontSize: headerFontSize,
              color: colors.TEXT_COLOR_LIGHT,
              textAlign: 'center',
            }}
            text="메뉴가 준비되지 않았습니다. 새로고침하려면 클릭하세요."
          />
        </FlexWidget>
      )}
    </FlexWidget>
  );
}

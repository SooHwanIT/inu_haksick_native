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
  type: string;
}

// Color constants
const BACKGROUND_COLOR = '#F0F0F0';
const HEADER_BACKGROUND_COLOR = '#404040';
const HEADER_SELECTED_COLOR = '#5cb0ff';
const HEADER_UNSELECTED_COLOR = '#808080';
const TEXT_COLOR = '#2D2D2D';
const TEXT_COLOR_LIGHT = '#4A4A4A';
const TEXT_COLOR_WHITE = '#FFFFFF';
const LIST_BACKGROUND_COLOR = '#FAFAFA';
const LIST_BORDER_COLOR = '#afafaf';

export function HaksickWidget({data, type}: HaksickWidgetProps) {
  const headerHeight = 42;
  const headerFontSize = 14;
  const bodyFontSize = 12;

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

  return (
    <FlexWidget
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: BACKGROUND_COLOR,
        height: 'match_parent',
        width: 'match_parent',
        borderRadius: 8,
        padding: 8,
        flexDirection: 'column',
      }}>
      {/* Date */}
      <TextWidget
        style={{
          fontSize: headerFontSize,
          color: TEXT_COLOR,
          textAlign: 'center',
          paddingVertical: 6, // Less padding
          width: 'match_parent',
        }}
        text={`${data.lastUpdate}`}
      />

      {/* Header */}
      <FlexWidget
        style={{
          backgroundColor: HEADER_BACKGROUND_COLOR,
          height: headerHeight,
          width: 'match_parent',
          justifyContent: 'space-around', // Use space-around for even spacing
          alignItems: 'center',
          flexDirection: 'row',
          //borderRadius: 4, // Rounded corners for a softer look
        }}>
        {/* Student Restaurant */}
        <FlexWidget
          clickAction="CHANGE_MENU"
          clickActionData={{id: 'student'}}
          style={{
            height: headerHeight,
            justifyContent: 'center',
            backgroundColor: type === 'student' ? HEADER_SELECTED_COLOR : HEADER_UNSELECTED_COLOR,
            //borderRadius: 4,
            paddingHorizontal: 12, // Add some horizontal padding
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: TEXT_COLOR_WHITE}}
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
            backgroundColor: type === 'professor' ? HEADER_SELECTED_COLOR : HEADER_UNSELECTED_COLOR,
            //borderRadius: 4,
            paddingHorizontal: 12,
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: TEXT_COLOR_WHITE}}
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
            backgroundColor: type === 'dining27' ? HEADER_SELECTED_COLOR : HEADER_UNSELECTED_COLOR,
            //borderRadius: 4,
            paddingHorizontal: 12,
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: TEXT_COLOR_WHITE}}
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
            backgroundColor: type === 'dorm1' ? HEADER_SELECTED_COLOR : HEADER_UNSELECTED_COLOR,
            borderRadius: 4,
            paddingHorizontal: 12,
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: TEXT_COLOR_WHITE}}
            text="1기숙사 식당"
          />
        </FlexWidget>
      </FlexWidget>

      {/* Selected Restaurant's Menu List */}
      {selectedRestaurant[0].meals.length === 0 ? (
        <TextWidget
          style={{
            fontSize: headerFontSize,
            color: TEXT_COLOR_LIGHT,
            textAlign: 'center',
            height: 'match_parent',
            width: 'match_parent',
            backgroundColor: LIST_BACKGROUND_COLOR,
          }}
          text="메뉴가 준비되지 않았습니다."
        />
      ) : (
        <ListWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
            backgroundColor: LIST_BACKGROUND_COLOR,
          }}>
          {selectedRestaurant[0]?.meals.map((item, i) => (
            <FlexWidget
              key={`meal-${i}`}
              clickAction={'OPEN_APP'}
              style={{
                width: 'match_parent',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: LIST_BORDER_COLOR,
              }}>
              <TextWidget
                style={{
                  fontSize: headerFontSize + 8, // Increase font size for mealTime
                  fontWeight: 'bold',
                  marginBottom: 8,
                  color: TEXT_COLOR,
                  textAlign: 'center',
                }}
                text={item.mealTime}
              />
              {item.dishes.map((meal, j) => (
                <TextWidget
                  key={`dish-${i}-${j}`}
                  style={{
                    fontSize: bodyFontSize,
                    color: TEXT_COLOR_LIGHT,
                    textAlign: 'center',
                  }}
                  text={meal}
                />
              ))}
            </FlexWidget>
          ))}
        </ListWidget>
      )}
    </FlexWidget>
  );
}

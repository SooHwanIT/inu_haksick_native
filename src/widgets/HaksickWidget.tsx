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

export function HaksickWidget({data, type}: HaksickWidgetProps) {
  const haederTapSize = 42;
  const headerFontSize = 16;
  const bodyFontSize = 13;

  // type에 따른 레스토랑 데이터 선택
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
        backgroundColor: '#F5F5F5',
        height: 'match_parent',
        width: 'match_parent',
        borderRadius: 4,
        flexDirection: 'column',
      }}>
      {/* 해더 */}
      <FlexWidget
        style={{
          backgroundColor: '#3A3A3A',
          height: haederTapSize,
          width: 'match_parent',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {/* 학생 식당 */}
        <FlexWidget
          clickAction="CHANGE_MENU"
          clickActionData={{id: 'student'}}
          style={{
            flex: 1,
            height: haederTapSize,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: type === 'student' ? '#007AFF' : '#6E6E6E',
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: '#FFFFFF'}}
            text="학생 식당"
          />
        </FlexWidget>
        {/* 교수 식당 */}
        <FlexWidget
          clickAction="CHANGE_MENU"
          clickActionData={{id: 'professor'}}
          style={{
            flex: 1,
            height: haederTapSize,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: type === 'professor' ? '#007AFF' : '#6E6E6E',
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: '#FFFFFF'}}
            text="교수 식당"
          />
        </FlexWidget>

        {/* 27호관 식당 */}
        <FlexWidget
          clickAction="CHANGE_MENU"
          clickActionData={{id: 'dining27'}}
          style={{
            flex: 1,
            height: haederTapSize,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: type === 'dining27' ? '#007AFF' : '#6E6E6E',
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: '#FFFFFF'}}
            text="27호관 식당"
          />
        </FlexWidget>

        {/* 1기숙사 식당 */}
        <FlexWidget
          clickAction="CHANGE_MENU"
          clickActionData={{id: 'dorm1'}}
          style={{
            flex: 1,
            height: haederTapSize,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: type === 'dorm1' ? '#007AFF' : '#6E6E6E',
          }}>
          <TextWidget
            style={{fontSize: headerFontSize, color: '#FFFFFF'}}
            text="1기숙사 식당"
          />
        </FlexWidget>
      </FlexWidget>

      {/* 선택된 식당의 메뉴 리스트 */}
      {selectedRestaurant[0].meals.length === 0 ? (
        <TextWidget
          style={{
            fontSize: headerFontSize,
            color: '#555555',
            textAlign: 'center', // 텍스트 중앙 정렬

            height: 'match_parent',
            width: 'match_parent',
            backgroundColor: '#ffffff',
          }}
          text="메뉴가 준비되지 않았습니다."
        />
      ) : (
        <ListWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
            backgroundColor: '#ffffff',
          }}>
          {selectedRestaurant[0]?.meals.map((item, i) => (
            <FlexWidget
              key={`meal-${i}`}
              clickAction={'OPEN_APP'}
              style={{
                width: 'match_parent',
                alignItems: 'center', // 중앙 정렬
                borderBottomWidth: 1,
              }}>
              <TextWidget
                style={{
                  fontSize: headerFontSize + 8, // mealTime 글씨 크기 키움
                  fontWeight: 'bold',
                  marginBottom: 8,
                  color: '#333333',
                  textAlign: 'center', // 텍스트 중앙 정렬
                }}
                text={item.mealTime}
              />
              {item.dishes.map((meal, j) => (
                <TextWidget
                  key={`dish-${i}-${j}`}
                  style={{
                    fontSize: bodyFontSize,
                    color: '#555555',
                    textAlign: 'center', // 텍스트 중앙 정렬
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

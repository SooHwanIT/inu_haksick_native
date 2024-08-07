import React, {useState} from 'react';
import type {WidgetTaskHandlerProps} from 'react-native-android-widget';
import {HaksickWidget} from './src/widgets/HaksickWidget.tsx';
import getMenuData, {
  fetchStudentMenu,
  getMenuFromStorage,
} from './src/menuUtil.ts';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Menu {
  mealTime: string;
  dishes: string[];
}

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Haksick: HaksickWidget,
};

async function getThemeFromStorage(): Promise<'light' | 'dark'> {
  try {
    const theme = await AsyncStorage.getItem('theme');
    // Handle cases where theme is null or invalid
    return (theme === 'dark' || theme === 'light') ? (theme as 'light' | 'dark') : 'light';
  } catch (error) {
    console.error('Failed to load theme from storage:', error);
    return 'light'; // Default to 'light' on error
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  try {
    const theme = await getThemeFromStorage();
    const data = await getMenuData();

    switch (props.widgetAction) {
      case 'WIDGET_ADDED':
        if (widgetInfo.widgetName === 'Haksick') {
          console.log(data); // 데이터를 콘솔에 출력
          props.renderWidget(<Widget data={data} type={'student'} theme={theme} />);

        } else {
        }
        break;

      case 'WIDGET_UPDATE':
        if (widgetInfo.widgetName === 'Haksick') {
          console.log(data); // 데이터를 콘솔에 출력
          props.renderWidget(<Widget data={data} type={'student'} theme={theme} />);

        } else {
        }
        break;

      case 'WIDGET_RESIZED':
        if (widgetInfo.widgetName === 'Haksick') {
          console.log(data); // 데이터를 콘솔에 출력
          props.renderWidget(<Widget data={data} type={'student'} theme={theme} />);

        } else {
        }
        break;

      case 'WIDGET_DELETED':
        // Not needed for now
        break;

      case 'WIDGET_CLICK':
        if (props.clickAction === 'CHANGE_MENU') {
          // Do stuff when primitive with `clickAction="MY_ACTION"` is clicked
          // props.clickActionData === { id: 0 }

            props.renderWidget(<Widget data={data} type={props.clickActionData?.id} theme={theme} />);

          console.log(props.clickActionData?.id);
        }
        break;

      default:
        break;
    }
  } catch (error) {
    console.error('Failed to handle widget task:', error);
  }
}

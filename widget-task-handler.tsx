import React, {useState} from 'react';
import type {WidgetTaskHandlerProps} from 'react-native-android-widget';
import {HaksickWidget} from './src/widgets/HaksickWidget.tsx';
import getMenuData, {
  fetchStudentMenu,
  getMenuFromStorage,
} from './src/menuUtil.ts';

interface Menu {
  mealTime: string;
  dishes: string[];
}

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Haksick: HaksickWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      if (widgetInfo.widgetName === 'Haksick') {
        const data = await getMenuData();
        console.log(data); // 데이터를 콘솔에 출력
        props.renderWidget(<Widget data={data} type={'student'} />);
      } else {
      }
      break;

    case 'WIDGET_UPDATE':
      if (widgetInfo.widgetName === 'Haksick') {
        const data = await getMenuData();
        console.log(data); // 데이터를 콘솔에 출력
        props.renderWidget(<Widget data={data} type={'student'} />);
      } else {
      }
      break;

    case 'WIDGET_RESIZED':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_DELETED':
      // Not needed for now
      break;

    case 'WIDGET_CLICK':
      if (props.clickAction === 'CHANGE_MENU') {
        // Do stuff when primitive with `clickAction="MY_ACTION"` is clicked
        // props.clickActionData === { id: 0 }
        const data = await getMenuData();
        props.renderWidget(<Widget data={data} type={props.clickActionData?.id} />);
        console.log(props.clickActionData?.id);
      }
      break;

    default:
      break;
  }
}

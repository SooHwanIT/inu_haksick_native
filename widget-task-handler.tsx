import React, { useState } from "react";
import type {WidgetTaskHandlerProps} from 'react-native-android-widget';
import {HaksickWidget} from './src/widgets/HaksickWidget.tsx';
import { getMenuFromStorage } from "./src/menuUtil.ts";

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
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_UPDATE':
      if (widgetInfo.widgetName === 'Haksick') {
        const data:any = await getMenuFromStorage('studentMenu');
        console.log("테스트 1 : "+ data);
        props.renderWidget(<Widget data = {data}/>);
      } else {
      }
      break;
      break;

    case 'WIDGET_RESIZED':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_DELETED':
      // Not needed for now
      break;

    case 'WIDGET_CLICK':
      // Not needed for now
      break;

    default:
      break;
  }
}

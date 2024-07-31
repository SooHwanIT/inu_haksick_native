import React from 'react';
import { FlexWidget, ListWidget, TextWidget } from "react-native-android-widget";

export function HaksickWidget( data:any ) {
  console.log(data);
  return (
    <ListWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1F3529',
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <FlexWidget
          key={i}
          style={{
            width: 'match_parent',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 8,
          }}
          clickAction="OPEN_URI"
          clickActionData={{
            uri: `androidwidgetexample://list/list-demo/${i + 1}`,
          }}
        >
          <TextWidget text={`React Native Android Widget Release 0.${i + 1}`} />
        </FlexWidget>
      ))}
    </ListWidget>
  );
}

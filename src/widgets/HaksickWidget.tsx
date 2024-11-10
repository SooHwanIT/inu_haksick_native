import React from 'react';
import { FlexWidget, ListWidget, TextWidget } from 'react-native-android-widget';



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

export function HaksickWidget({ data = [], type = 'student', theme = 'dark' }) {
    const headerHeight = 42;
    const headerFontSize = 14;
    const bodyFontSize = 16;

    // Select the theme colors based on the theme prop
    const colors = theme === 'dark' ? DARK_THEME : LIGHT_THEME;

    // 1. 서울 시간 기준으로 현재 날짜 가져오기 (yyyy-mm-dd 형식)
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


// 3. 오늘 날짜와 비교하여 필터링
    const today = getTodayDate(); // 오늘 날짜 yyyy-mm-dd 형식으로 가져옴
    const filteredData = data.filter(item => {
        return item.cafeteria === type;
    });

    const hasData = filteredData.length > 0;

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
            }}
        >
            {/* Date */}
            <TextWidget
                style={{
                    fontSize: headerFontSize,
                    color: colors.TEXT_COLOR,
                    textAlign: 'center',
                    paddingVertical: 6,
                    width: 'match_parent',
                }}
                text={`${today}`}
            />

            {/* Header */}
            <FlexWidget
                style={{
                    backgroundColor: colors.HEADER_BACKGROUND_COLOR,
                    height: headerHeight,
                    width: 'match_parent',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'row',
                    overflow: 'scroll',  // 가로 스크롤 가능하도록 설정
                }}
            >
                {/* Student Restaurant */}
                <FlexWidget
                    clickAction="CHANGE_MENU"
                    clickActionData={{ id: '학생식당' }}
                    style={{
                        height: headerHeight,
                        justifyContent: 'center',
                        backgroundColor: type === '학생식당' ? colors.HEADER_SELECTED_COLOR : colors.HEADER_UNSELECTED_COLOR,
                        paddingHorizontal: 12,
                        borderTopLeftRadius: 12,
                        border:1,
                        flex: 1,
                    }}
                >
                    <TextWidget
                        style={{ fontSize: headerFontSize, color: colors.TEXT_COLOR_BLACK }}
                        text='학생식당'
                    />
                </FlexWidget>
                {/* Professor Restaurant */}
                <FlexWidget
                    clickAction="CHANGE_MENU"
                    clickActionData={{ id: '2호관 교직원 식당' }}
                    style={{
                        height: headerHeight,
                        justifyContent: 'center',
                        backgroundColor: type === '2호관 교직원 식당' ? colors.HEADER_SELECTED_COLOR : colors.HEADER_UNSELECTED_COLOR,
                        paddingHorizontal: 12,
                        flex: 1,
                    }}
                >
                    <TextWidget
                        style={{ fontSize: headerFontSize, color: colors.TEXT_COLOR_BLACK }}
                        text='2호관 교직원 식당'
                    />
                </FlexWidget>
                {/* Dorm1 Restaurant */}
                <FlexWidget
                    clickAction="CHANGE_MENU"
                    clickActionData={{ id: '제 1기숙사 식당' }}
                    style={{
                        height: headerHeight,
                        justifyContent: 'center',
                        backgroundColor: type === '제 1기숙사 식당' ? colors.HEADER_SELECTED_COLOR : colors.HEADER_UNSELECTED_COLOR,
                        paddingHorizontal: 12,
                        borderTopRightRadius: 12,
                        flex: 1,
                    }}
                >
                    <TextWidget
                        style={{ fontSize: headerFontSize, color: colors.TEXT_COLOR_BLACK }}
                        text="제 1기숙사 식당"
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
                    }}
                >
                    {filteredData.map((item, i) => (
                        <FlexWidget
                            key={`meal-${i}`}
                            clickAction={'OPEN_APP'}
                            style={{
                                width: 'match_parent',
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: colors.LIST_BORDER_COLOR,
                                padding: 8,
                            }}
                        >
                            {/* 날짜 및 식사 유형 표시 */}
                            <TextWidget
                                style={{
                                    fontSize: headerFontSize + 8,
                                    fontWeight: 'bold',
                                    marginBottom: 8,
                                    color: colors.TEXT_COLOR,
                                    textAlign: 'center',
                                }}
                                text={`${item.type}`}
                            />

                            {/* 메뉴 표시 */}
                            {item.menu.split('\n').map((menuItem, j) => (
                                <TextWidget
                                    key={`dish-${i}-${j}`}
                                    style={{
                                        fontSize: bodyFontSize,
                                        color: colors.TEXT_COLOR_LIGHT,
                                        textAlign: 'center',
                                    }}
                                    text={menuItem}
                                />
                            ))}
                        </FlexWidget>
                    ))}

                </ListWidget>
            ) : (
                <FlexWidget
                    clickAction="REFRESH_WIDGET"
                    style={{
                        height: 'match_parent',
                        width: 'match_parent',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.LIST_BACKGROUND_COLOR,
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                    }}
                >
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

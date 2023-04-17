import React, { useCallback,useState, useEffect } from 'react';
import { PressableProps, Pressable, PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';
import {GestureResponderEvent} from "react-native/Libraries/Types/CoreEventTypes";


export interface PressableOpacityProps extends PressableProps {
	/**
	 * The opacity to use when `disabled={true}`
	 *
	 * @default 0.3
	 */
	disabledOpacity?: number;
	/**
	 * The opacity to animate to when the user presses the button
	 *
	 * @default 0.2
	 */
	activeOpacity?: number;
	/**
	 * The delay(ms) when mult press happend
	 *
	 * @default 500
	 */
	multPressDelay?: number;
}

export type StyleType = (state: PressableStateCallbackType) => StyleProp<ViewStyle>;

export function PressableOpacity({
	style,
	disabled = false,
	disabledOpacity = 0.3,
	activeOpacity = 0.2,
	multPressDelay = 500,
	...passThroughProps
}: PressableOpacityProps): React.ReactElement {
	const getOpacity = useCallback(
		(pressed: boolean) => {
			if (disabled) {
				return disabledOpacity;
			} else {
				if (pressed) return activeOpacity;
				else return 1;
			}
		},
		[activeOpacity, disabled, disabledOpacity],
	);
	const [isPressed, setIsPressed] = useState(false);
	const onSafePress = (event: GestureResponderEvent) => {
		if(isPressed) {
			console.log("已点击，忽略",multPressDelay);
			return
		};
		setIsPressed(true);
		passThroughProps.onPress && passThroughProps.onPress(event);
		// @ts-ignore
		setTimeout(() => {
			try{setIsPressed(false);}catch(e){}
		},multPressDelay);
	}


	const _style = useCallback<StyleType>(({ pressed }) => [style as ViewStyle, { opacity: getOpacity(pressed) }], [getOpacity, style]);


	return <Pressable style={_style}  disabled={disabled} {...passThroughProps} onPress={(e) => onSafePress(e)} />;
}

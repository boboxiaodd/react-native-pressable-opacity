import React, { useCallback,useState } from 'react';
import { PressableProps, Pressable, PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';
import type {GestureResponderEvent} from "react-native/Libraries/Types/CoreEventTypes";


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
	let isPressed = false;
	const [isDisabled, setIsDisabled] = useState(disabled);
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
	const onSafePress = (event: GestureResponderEvent) => {
		if(multPressDelay > 0) {
			if (isPressed) {
				setIsDisabled(true);
				console.log("已点击，忽略", multPressDelay);
				return
			}
			isPressed = true;
			setTimeout(() => {
				try {
					isPressed = false;
					setIsDisabled(false);
				} catch (e) {
				}
			}, multPressDelay);
		}
		passThroughProps.onPress && passThroughProps.onPress(event);
	}


	const _style = useCallback<StyleType>(({ pressed }) => [style as ViewStyle, { opacity: getOpacity(pressed) }], [getOpacity, style]);


	return <Pressable style={_style}  disabled={isDisabled} {...passThroughProps} onPress={(e) => onSafePress(e)} />;
}

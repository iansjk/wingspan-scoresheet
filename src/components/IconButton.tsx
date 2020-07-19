
import React from "react";
import { TextProps, TouchableHighlightProps, TouchableWithoutFeedbackProps, ViewStyle } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface IconButtonProps {
    name: string,
    iconStyle?: ViewStyle,
    backgroundColor?: string
}

export default class IconButton extends React.Component<IconButtonProps & TextProps & TouchableHighlightProps & TouchableWithoutFeedbackProps> {
    render(): JSX.Element {
        const { style, ...otherProps } = this.props;
        return (
            <FontAwesome.Button
                iconStyle={[
                    style,
                    {marginRight: 0}
                ]}
                backgroundColor='transparent'
                size={26}
                underlayColor='lightgray'
                onPress={this.props.onPress}
                {...otherProps}
            />
        );
    }
}

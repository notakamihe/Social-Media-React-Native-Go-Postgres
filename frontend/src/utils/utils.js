import { Platform, PixelRatio, Dimensions } from "react-native";

export function normalize (size) {
    const newSize = size * (Math.min(Dimensions.get("window").width / 350, 2)) 

    if (Platform.OS === "ios") {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
         return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export function navigate (navigation, name) {
    navigation.navigate(name)
}
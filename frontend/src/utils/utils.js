import { Platform, PixelRatio, Dimensions } from "react-native";
import moment from "moment"

export function normalize (size) {
    const newSize = size * (Math.min(Dimensions.get("window").width / 350, 2)) 

    if (Platform.OS === "ios") {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
         return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export function timeAgoShort (date) {
    moment.updateLocale("en", {
        relativeTime: {
            future: '%s',
            past: '%s',
            s: '%ds',
            ss: '%ds',
            m: '%dm',
            mm: '%dm',
            w: "%dw",
            ww: "%dw",
            h: '%dh',
            hh: '%dh',
            d: '%dd',
            dd: '%dd',
            y: "%dy",
            yy: "%dy"
        }
    })
    
    return moment(date).fromNow()
}

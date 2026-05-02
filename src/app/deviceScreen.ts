import { Platform, useWindowDimensions } from "react-native";
import * as Device from "expo-device";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

export type DeviceScreenProfile = {
  bottomInset: number;
  height: number;
  isLargePhone: boolean;
  modelName: string;
  platform: string;
  topInset: number;
  width: number;
};

export function useDeviceScreenProfile(): DeviceScreenProfile {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return {
    bottomInset: getComfortableBottomInset(insets),
    height,
    isLargePhone: Platform.OS === "ios" && Math.max(height, width) >= 900,
    modelName: Device.modelName ?? "Unknown device",
    platform: Platform.OS,
    topInset: getComfortableTopInset(insets),
    width
  };
}

function getComfortableTopInset(insets: EdgeInsets) {
  if (Platform.OS !== "ios") return Math.max(insets.top, 16);
  return Math.max(insets.top, 18);
}

function getComfortableBottomInset(insets: EdgeInsets) {
  if (Platform.OS !== "ios") return Math.max(insets.bottom, 16);
  return Math.max(insets.bottom, 18);
}

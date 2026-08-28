import { Stack } from "expo-router";
import Home from "../components/Home/Home";

export default function Homes() {
  return (
    <>
      <Stack.Screen options={{ headerBackVisible: false, gestureEnabled: false }} />
      <Home />
    </>
  );
}

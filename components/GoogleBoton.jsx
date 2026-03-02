import {
  Text,
  Image,
  View,
  TouchableOpacity,
} from "react-native";

export default function GoogleBotoon({handleGoogleLogin}){

    return(
      <>     
         <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-3 text-gray-400 text-sm">o</Text>
        <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity
                  onPress={handleGoogleLogin}
                  className="w-full flex-row items-center justify-center border-2 border-gray-200 rounded-2xl py-4 bg-white shadow-sm"
                >
                  <Image
                    source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                    resizeMode="contain"
                  />
                  <Text className="text-black font-semibold text-base">Continuar con Google</Text>
        </TouchableOpacity>
      </>
    );

}
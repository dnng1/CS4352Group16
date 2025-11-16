import AsyncStorage from "@react-native-async-storage/async-storage";

export const resetStorage = async () => //clears joined events and groups
{
    try
    {
        await AsyncStorage.removeItem("joinedGroups");
        await AsyncStorage.removeItem("joinedEventIds");
        await AsyncStorage.removeItem("events");
        console.log("Storage reset");
    } catch(error) {
        console.error("Error resetting storage", error);
    }
}
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultEvents = [
    { event: "Musical Boat Party", image: "https://m.media-amazon.com/images/I/81s4Yq0JJWL._AC_UF350,350_QL80_.jpg", date: "December 1st", time: "2:00 pm", location: "1234 Sesame St. ", id: 1 },
    { event: "Cornhole Toss", image: "https://www.cornholeworldwide.com/wp-content/uploads/2020/07/shutterstock_717048238.jpg", date: "December 2nd", time: "9:00 am", location: "456 Boat Port ", id: 2 },
    { event: "Friendsgiving Party", image:"https://www.mashed.com/img/gallery/52-thanksgiving-dishes-to-make-you-the-star-of-friendsgiving/intro-1637165015.jpg", date: "November 25th", time: "4:00 pm", location: "1234 ABC St. ", id: 3 }
];

const defaultJoinedGroups = {
    0: true,
    1: false,
    2: false, 
    3: false, 
    4: false, 
    5: false
};

//clears joined events and groups
export const resetStorage = async () => 
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

// Clear cache and reset events and joined groups to default
export const clearCacheAndResetToDefault = async () => {
    try {
       
        await AsyncStorage.clear();
        console.log("Cache cleared");
        
        await AsyncStorage.setItem("events", JSON.stringify(defaultEvents));
        console.log("Events reset to default");
        
        await AsyncStorage.setItem("joinedGroups", JSON.stringify(defaultJoinedGroups));
        console.log("Joined groups reset to default");
        
        await AsyncStorage.setItem("joinedEventIds", JSON.stringify([]));
        console.log("Joined event IDs reset to default");
        
        console.log("Cache cleared and all data reset to default");
    } catch(error) {
        console.error("Error clearing cache and resetting to default", error);
    }
}
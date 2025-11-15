import Asyncstorage from "@react-native-async-storage/async-storage";

const KEY = "joinedEventIds";

//join event
export const joinEvent = async (eventId: number) =>
{
    const stored = await Asyncstorage.getItem(KEY);
    const joinedIds: number[] = stored ? JSON.parse(stored) : []; //if stored exists turn string back into array

    //only add if not already joined
    if(!joinedIds.includes(eventId)) //check if event id already in array
    {
        joinedIds.push(eventId);
    }

    await Asyncstorage.setItem(KEY, JSON.stringify(joinedIds)); //save updated list
};

//leave event
export const leaveEvent = async (eventId: number) =>
{
    //load current list of joined events
    const stored = await Asyncstorage.getItem(KEY);
    const joinedIds: number[] = stored ? JSON.parse(stored) : [];
    const updated = joinedIds.filter(id => id !== eventId); //create new array without that event

    await Asyncstorage.setItem(KEY, JSON.stringify(updated));
};

//returns list of all joined event id
export async function getJoinedEventIds()
{
    const stored = await Asyncstorage.getItem(KEY);
    return stored ? JSON.parse(stored) as number[] : [];
};

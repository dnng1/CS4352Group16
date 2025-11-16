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

// Map group names to group IDs
const groupNameToId: { [key: string]: number } = {
  "Welcome Wonders": 0,
  "International Student Association": 1,
  "Musical Wonders": 2,
  "Cooking Ninjas": 3,
  "Bridge Between Us": 4,
  "Town Travellers": 5,
};

// Map group IDs to their event IDs
const groupEventIds: { [key: number]: number[] } = {
  0: [26, 27, 28], // Welcome Wonders events
  1: [12, 13, 14, 15, 16, 17], // ISA events
  2: [8, 9, 10, 11], // Musical Wonders events
  3: [18, 19, 20, 7], // Cooking Ninjas events
  4: [22, 23, 24, 25], // Bridge Between Us events
  5: [4, 5, 6, 7], // Town Travellers events
};

// Leave a group - removes from joinedGroups and removes all events from that group
export const leaveGroup = async (groupName: string) => {
  const groupId = groupNameToId[groupName];
  if (groupId === undefined) return;

  // Remove group from joinedGroups
  const storedGroups = await Asyncstorage.getItem('joinedGroups');
  const joinedGroups: { [key: number]: boolean } = storedGroups ? JSON.parse(storedGroups) : {};
  joinedGroups[groupId] = false;
  await Asyncstorage.setItem('joinedGroups', JSON.stringify(joinedGroups));

  // Remove events from this group
  const eventIds = groupEventIds[groupId] || [];
  if (eventIds.length > 0) {
    // Remove from joinedEventIds
    const stored = await Asyncstorage.getItem(KEY);
    const joinedIds: number[] = stored ? JSON.parse(stored) : [];
    const updated = joinedIds.filter(id => !eventIds.includes(id));
    await Asyncstorage.setItem(KEY, JSON.stringify(updated));

    // Remove from events storage
    const storedEvents = await Asyncstorage.getItem('events');
    if (storedEvents) {
      const events = JSON.parse(storedEvents);
      const updatedEvents = events.filter((event: any) => !eventIds.includes(event.id));
      await Asyncstorage.setItem('events', JSON.stringify(updatedEvents));
    }
  }
};

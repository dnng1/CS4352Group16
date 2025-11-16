# INTERLINK
**From New Lands to New Friends**

## About
Mobile app for international migrants struggling to find a support system or looking for low pressure ways to socially adapt to their new country.

## Core Features
* **Personality test/Cultural Survey**: Used to determine group formations 
* **Groups**: Groups based on culture, hobbies, geolocation, and more which users can join
* **Events**: Social activities, pre-planned by other group members, which users can join and participate 
* **Chat**: Each group has a chat feature for all users to communicate with each other 
* **Create events**: Users can create custom social events for a social group 
* **Search**: Search on the homepage for upcoming events 

## Requirements
* iOS mobile device or Android 
* Expo Go (download from Play Store or App Store)

## Installation
```bash
git clone https://github.com/dnng1/CS4352Group16.git
cd frontend
```

## Dependencies
```bash
npm install
```
For Expo-specific packages, ensure you're using the correct Expo SDK version (54.0.18) as dependencies are version-locked to ensure compatibility.

## Running the App
```bash
npx expo start
```
Scan the given QR code through the Expo Go app (if using Android) or Camera app (if using iOS).

## UI Explanation

### 1. Create Account
Allows new users to create an account and take a personality test to analyze them before personalizing recommended groups.

1. Create a username and password
2. Fill out personal information
3. Take a personality test  
4. Fill out information regarding personal culture and background 
5. Upload a photo to confirm identity 
6. Submit personality quiz
7. Join suggested groups or skip

### 2. Login
Allows existing users to login to their account.

1. Enter username and password 

### 3. Home Screen
Displays all upcoming events with event details.

* If you want to search a specific upcoming event, use the search bar on top 

### 4. My Groups
Displays all groups user is currently involved in.

* Click on a specific group to know more information about upcoming/past events and members

### 5. Events
Displays upcoming and past social events and allows users to sign up for an event.

1. View new events posted by group members
2. Accept or reject an event
3. View previous events attended 

### 6. Chat
Allows users to communicate with other members.

1. Chat with other members in the same group 
2. Send images through chat feature if needed

### 7. Find Groups
Allows users to manually join groups.

1. Click "join" for any group that interests you
2. Click again if you want to unjoin a group 

### 8. Create Events Screen
Allows users to create a custom social event.

1. Enter event details as instructed 
2. Post event 

## Demonstration
* Video Link: 

## Limitations
* We don't have a backend or database for user IDs and passwords, events, and groups. Everything is currently hardcoded
* Since we hardcoded groups, we have a limited number of groups displayed for users to join 

## Future Implementations
* Create a database for user information, groups, and events 
* Integrate app with backend  
* Extend the personality quiz to have more questions to create more niche sets of groups 
* Allow users to create their own groups
* Add more social aspects such as tailored events (based on culture), interactive map

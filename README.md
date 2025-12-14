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

## Quality Argument
InterLink is a social platform developed for international migrants looking for low pressure ways to adapt socially. It aims to create personalized experiences through which users can maximize benefits and minimize struggles as a community. Our team has developed a clear, efficient, and user friendly app for users to engage easily and have a pleasurable experience. 

VISUALIZATION
Using a visual hierarchy system, different levels and depth of information are presented in layers. For instance, on our home page, each event has a title, location, and time on the main card for quick scanning. If the user wants to find more information, they can click on the event, which will pull a pop up that displays more details. This way, we prevent any sort of cognitive overload and make it easier for the user to read and manage information.  

In addition, we have utilized a minimalist design, with few colors, simple layouts, and bubbly presentation styles. This keeps it easy to locate various levels of information while also creating a pleasing experience when moving through workflows in the app. 

NAVIGATION
Through the use of purposeful icons, symbols, labels, and buttons, we have made it easy for users to navigate through the app. Everything is self explanatory as the buttons speak for themselves and utilize color coding to help the user understand what has been processed. For instance, when the user accepts an event, the button turns green, helping confirm that the event has been updated as per the user’s request. In addition, we have made it extremely easy for users to navigate between pages. In our personality quiz, rather than having to backtrack all the way to a specific question to edit it, the user can simply click on an edit icon at the end and a back to summary icon at every question to simply jump from anywhere. This prevents overload and effort on the users side, saving time and energy by making everything quickly accessible. In addition, the app includes a help guide that walks users through the app at any point with a visual of where various features are located. 

PERSONALIZATION
Interlink reads users' personalities based on a short quiz during the registration process. Based on answers, it will process a set of groups they can join. This creates a more personalized experience as the events and people they interact with will align with their expectations and create smooth transitions into friendships. 

Overall, we have designed our app in a way that simplifies work, clearly manages data, and provides a satisfying overall experience for the user. 


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

### 8. Create Events Screen
Allows users to create a custom social event.

1. Enter event details as instructed 
2. Post event 

## Demonstration
* Video Link: https://www.youtube.com/shorts/72CBEaOlbK0

## Limitations
* We don't have a backend or database for user IDs and passwords, events, and groups. Everything is currently hardcoded
* Since we hardcoded groups, we have a limited number of groups displayed for users to join 

## Future Implementations
* Create a database for user information, groups, and events 
* Integrate app with backend  
* Extend the personality quiz to have more questions to create more niche sets of groups 
* Allow users to create their own groups
* Add more social aspects such as tailored events (based on culture), interactive map

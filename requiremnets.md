# Software Requirements

## Vision

An organising tool for self-paced online learners, that will help them manage their courses the way they like.
It helps with keeping track of the learning progress for each course.
The web app will enable a community of learners to share their thoughts on the courses they took, and connect them together through their learning journey.

## Scope (In/Out)

* IN/MVP
The web app will get courses playlists from YOutube where the user can add them to his courses list.  
The user will be able to organize and group the course structure.  
The user will be able to add notes to the course videos and keep track of the completed courses.  
The user will be able to publish his organized courses and notes where other users can see and add them.  
Users will be able to join each other in study parties and communicate their thoughts live.  

* OUT

The user will not be able to remove or add videos to a course playlist.  
The user will not be able to upload new courses.  

* stretch goals

Users can up-vote public organized courses.
Users can add comments to public organized courses.
Users can add annotation to the videos in Study Parties.

### Functional Requirements

* Data Flow

![UML](./project.png)

### Non-Functional Requirements

* Security: Only Authorized users can modify the content of the courses lists, where the routes of which they can do that are protected by Basic Auth/ Open Auth.
The user's private data will be hashed and saved in the database.
Only Users with a password can join a Study Party room.

* Modularity: The web app will depend on Youtube API for now for acquiring the courses' data, but in the future more APIs can be connected to the server.

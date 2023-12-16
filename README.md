# Real-Time Chat Application with AWS S3 Integration

A real-time chat application developed using HTML, CSS, and Bootstrap for the frontend, and Node.js, Express.js, TypeScript, Socket.IO, and AWS S3 for the backend. The app enables users to sign in, create multiple groups, exchange real-time messages, send multimedia messages, and perform group management actions.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Introduction

The Real-Time Chat Application provides a platform for users to sign in, create multiple groups, and communicate in real time through chat messages. Additionally, users can exchange multimedia messages, with AWS S3 used for storage, and perform various group management actions.

## Features

- **User Authentication**:
  - Sign in and login functionality
  - Forgot password feature (under development)

- **Group Creation and Management**:
  - Create multiple groups
  - Add members to groups
  - Make users admin and remove members

- **Real-Time Chat**:
  - Instant messaging within groups using Socket.IO
  - Multimedia message sending capability with AWS S3 integration

- **Message Archiving**:
  - Scheduled task (using a chron job) to archive today's messages into an archived message database table

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   - git clone https://github.com/shubham-369/chatApp.git
 
3. Install dependencies:
  - cd chatApp
  - npm install

3. Configure environment variables:
- Create `.env` file
- Add necessary environment variables (e.g., database connection string, AWS credentials)

4. Start the application:
   - npm run start-dev

## Usage

Once the application is running, users can access the chat app via the provided URL. 
- Users can sign in, create groups, chat in real time, and perform group management actions.
- Multimedia messages are stored in AWS S3 for seamless integration.

## Technologies Used

- **Frontend**:
- HTML, CSS, Bootstrap

- **Backend**:
- Node.js, Express.js, TypeScript
- Socket.IO (for real-time messaging)
- AWS S3 (for storing multimedia messages)
- Chron job for archiving messages
- MVC pattern for organizing the codebase


# SpaceX Launch Web App

Welcome to the SpaceX Launch Web App! This application displays a list of SpaceX launches and provides features like searching, filtering, and infinite scrolling.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the App](#running-the-app)
- [Running Cypress Tests](#running-cypress-tests)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Follow the instructions below to set up and run the project on your local machine.

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/dwaynedmello/SpaceXLaunch.git

Navigate to the project directory:

bash
Copy code
cd spacex-launch-app
Install project dependencies using npm:

bash
Copy code
npm install
Running the App
To start the web application locally, use the following command:

bash
Copy code
npm run dev
This will build and run the application, and you can access it in your web browser at http://localhost:3000.

Running Cypress Tests
Cypress is used for end-to-end testing. To run Cypress tests, use the following commands:

Start the development server (if not already running):

bash
Copy code
npm run dev
Open Cypress test runner:

bash
Copy code
npx cypress open
Click on a test file in the Cypress UI to run the tests interactively.

Deployment
The project is deployed on Vercel and can be accessed at the following URL:

https://spacexlaunch.vercel.app/

Built With
Vite - A fast development build tool.
React - A JavaScript library for building user interfaces.
Cypress - End-to-end testing framework.
Contributing
Contributions are welcome! If you find any issues or have improvements to suggest, please open an issue or create a pull request.
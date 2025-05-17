# Text Summarizer

## Overview

This project is a web application that allows users to input text and receive a concise summary. It leverages a backend API to perform the summarization and provides a user-friendly interface built with React. The application also features a history of previous summaries, stored locally in the browser.

## Features

* **Text Input:** A clear and easy-to-use text area for users to paste or type in the text they want to summarize.
* **Summarization:** Sends the input text to a backend API to generate a summary.
* **Summary Display:** Presents the generated summary to the user, including an optional title if provided by the API.
* **Error Handling:** Displays informative error messages if the summarization process fails.
* **Summary History:** Keeps a record of the last 10 summarized texts, including the original text, summary, title (if available), and timestamp.
* **Load from History:** Allows users to easily load previous original texts and their summaries from the history for review.
* **Clear History:** Provides a button to clear the locally stored summary history.

## Technologies Used

* **Frontend:**
    * React
    * JavaScript
    * CSS 
* **Backend :**
    * Node.js (Express).
    * Running on `http://localhost:5000` and providing a `/get-summary` endpoint.
* **Local Storage:** Used to persist the summary history in the user's browser.

## API Calls

The frontend application communicates with the backend API using the following calls:

* **`POST /get-summary`:**
    * **Endpoint:** `http://localhost:5000/get-summary`
    * **Method:** `POST`
    * **Request Body:** Plain text containing the text to be summarized.
    * **Response (JSON):**
        ```json
        {
          "summary": "The generated summary of the input text.",
          "title": "Optional title generated for the summary."
        }
        ```
    * **Summarization Engine:** This endpoint on the backend utilizes the **Google Gemini API - Model 2.0 Flash** to generate the text summary.

## Setup and Installation

To run this project locally, you'll need to have Node.js and npm (or yarn) installed on your machine for the frontend, and the necessary environment set up for the backend API.

### Frontend Setup

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd <your-frontend-directory>
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    This will usually open the application in your browser at `http://localhost:3000`.

### Backend Setup

1.  **Navigate to your backend directory:**
    ```bash
    cd <your-backend-directory>
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install # Installs dependencies listed in package.json (e.g., express, @google/generative-ai)
    ```
    Ensure your `package.json` file includes the necessary dependencies for interacting with the Gemini API (e.g., `@google/generative-ai`). You might need to install it specifically if it's not already there:
    ```bash
    npm install @google/genai
    ```

3.  **Obtain Google Gemini API Key:**
    * Go to the [Google AI Studio API Key](https://aistudio.google.com/apikey).
    * If you haven't already, create a new project.
    * Create a new API key. **Treat your API key with utmost security and do not commit it directly to your repository.**

4.  **Create a `.env` file:**
    In your backend root directory, create a file named `.env`.

5.  **Add your API key to the `.env` file:**
    Open the `.env` file and add your Gemini API key in the following format:
    ```
    api_key=YOUR_GEMINI_API_KEY
    ```
    Replace `YOUR_GEMINI_API_KEY` with the actual API key you obtained from Google AI Studio.

6.  **Configure your backend to use the `.env` file:**
    You'll need to install the `dotenv` package in your backend:
    ```bash
    npm install dotenv
    ```
    Then, in your main backend file (e.g., `index.js`), make sure to load the environment variables from the `.env` file at the beginning of your code:
    ```javascript
    // index.js
    require('dotenv').config();
    const apiKey = process.env.api_key;
    // ... your other backend code that uses the apiKey with the Gemini API client library
    ```

7.  **Run the backend server:**
    ```bash
    node index.js
    # or
    nodemon index.js
    ```
    **Important:** Ensure your backend server is running on `http://localhost:5000` as the frontend is configured to communicate with this address. Your backend code should now be able to access the Gemini API key from the `process.env.API_KEY` variable and use it with the `@google/generative-ai` library to interact with the Gemini API, specifically the **Model 2.0 Flash**.

## Usage

1.  Open the application in your web browser (usually at `http://localhost:3000` after starting the frontend).
2.  In the "Enter text to summarize..." text area, paste or type the text you want to summarize.
3.  Click the "Summarize" button.
4.  The generated summary (and optional title) will be displayed below the input area.
5.  The summarized text and original input will be added to the "Previous Summaries" list.
6.  You can toggle the visibility of the history panel by clicking the "Show History" / "Hide History" button.
7.  To view a previous summary and its original text, click the "Load" button next to the history item. This will populate the input area and the summary display.
8.  To clear the entire summary history, click the "Clear History" button.


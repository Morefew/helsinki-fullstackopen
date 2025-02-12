# Single Page App Diagram

This sequence diagram shows what happens when a user first visits the SPA
version of the notes app.

The main differences from the traditional webpage version are:
- The page requests a different JavaScript file (spa.js instead of main.js)
- This JavaScript code is set up to handle the SPA functionality
- The page rendering is handled by the JavaScript code using the DOM-API
- There's no form submission that causes a page reload

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2024-1-30" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes using DOM-API
```
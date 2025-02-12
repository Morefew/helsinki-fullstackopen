# New Note Diagram

The following diagram shows the flow of creating a new note:

1. First, the user enters text and clicks the save button, triggering a POST 
request to /new_note.
2. The server processes the new note and responds with a redirect.
3. Due to the redirect, the browser reloads the notes page, requiring:
   - A request for the HTML document
   - A request for the CSS file
   - A request for the JavaScript file
   - A request for the updated notes data (JSON)

Finally, the browser renders all notes including the new one.

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types a new note and clicks the "Save" button

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note left of server: Server receives the new note data and saves it
    server-->>browser: HTTP 201 new resource was created as a result
    server-->>browser: HTTP 302 Redirect to /exampleapp/notes
    deactivate server

    Note right of browser: Browser follows the redirect and reloads the notes page

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the CSS file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the updated JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the updated notes, including the new note
```
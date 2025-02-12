# New Note Single Page App Diagram

The following diagram shows the flow of creating a new note in the SPA version of the notes.

This sequence diagram shows the flow
when a user creates a new note in the SPA version,
which is notably different from the traditional wepage version,
since it doesn't reload the page.

```mermaid  
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes text and clicks Save button
    Note right of browser: The browser executes the event handler<br/>that renders the new note and<br/>sends it to the server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note left of server: Server adds the new note<br/>to the notes array
    server-->>browser: Status code 201 Created
    deactivate server

    Note right of browser: Browser stays on the same page,<br/>no additional HTTP requests needed
```
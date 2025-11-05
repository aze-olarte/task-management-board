# Task Management Board

A task management app with a dashboard and Kanban board to organize and track tasks. Includes sorting, filtering, and full CRUD functionality.

---

## 🛠️ Built With

- **Angular v18.2.21**  
- **SCSS** for styling  
- **JSON Server** for mock API calls  
- **NG ZORRO Antd** UI library  
- **ng2-charts** for data visualization  
- **Angular CDK** for drag-and-drop features  


## 🚀 Setup and Instructions

1. Install the Angular CLI.  

    ```
      npm install -g @angular/cli
    ```

2. Install dependencies.

    ```
      npm install
    ```

3. Start the Angular app and then nvigate to <http://localhost:4200￼>.

   ```bash
   ng serve
   ```

4. Start the mock API server with:

    ```
    npm run start:json
    ```

## ⚙️ Design Decisions and Trade-offs

### UI Framework

NG ZORRO Antd was chosen to speed up development by using pre-built components that require minimal customization.
Component-specific styles are defined in their respective SCSS files, while global styles handle overall layout and spacing.

Wireframes and a UI style guide were provided. However, these are only used for reference, so most layout-related styles were AI-generated.

A notable trade-off is accessibility. Form labels are not properly read by screen readers even when using nzFor, as documented in the library.

### Architecture and Structure

The project follows Angular’s standard folder structure with core, features, and shared directories inside the app folder.

The board-container component includes both the board-filters component and the cdkDropList. This simplifies state management and avoids excessive component nesting. In a larger project, these could be separated (e.g., into board-filters and board-dragdrop) for better scalability.

### Known Limitations (Due to Time Constraints)

- Tags / labels not implemented
- Test files (.spec.ts) are auto-generated and not customized
- Only 2 out of 3 required data visualizations were implemented (calendar view omitted)
- Sorting by status omitted (not relevant for Kanban layout)
- Bulk actions (update/delete) not implemented
- Filters and sorting apply only when clicking Apply Filters, for consistency with mobile view and to reduce redundant API calls
- Search highlighting not implemented

---

### Overall

All core features are functional. Future improvements could include the items above and more comprehensive unit and E2E testing.

⏱️ Total Time Spent: ~10 hours

## 1. Page Shell Width

- [x] 1.1 Update `src\App.tsx` so the main page shell uses a wider maximum width on large and high-resolution screens.
- [x] 1.2 Preserve existing mobile and tablet padding so smaller screens keep the current stacked layout behavior.

## 2. Desktop Grid Proportions

- [x] 2.1 Tune the desktop sidebar width so controls remain readable without making the result column feel cramped.
- [x] 2.2 Ensure the main result column can expand into available horizontal space without grid overflow.

## 3. Validation

- [x] 3.1 Confirm the high-resolution layout uses more horizontal space than the current `max-w-6xl` shell.
- [x] 3.2 Confirm the result column receives the majority of additional desktop width.
- [x] 3.3 Run the existing build command to ensure the React/TypeScript app still compiles.

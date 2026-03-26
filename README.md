# 💰 Money Manager App

A simple web app to track your income and expenses. Built using HTML, CSS, and JavaScript as part of a Capstone Project.

---

## 📌 About the Project

This is a personal finance tracker where you can add, edit, and delete transactions. It shows your total income, total expenses, and net balance. All data is saved in the browser using localStorage so it stays even after you refresh the page.

---

## 🛠️ Technologies Used

- HTML
- CSS
- JavaScript (OOP using Classes)
- Chart.js (for pie chart and bar chart)
- localStorage (for saving data)

---

## 📁 Project Structure

```
money-manager/
│
├── index.html      → Main HTML file (structure of the app)
├── style.css       → All the styles and design
└── script.js       → All the JavaScript logic
```

---

## ✨ Features

### Core Features
- **Add Transaction** — Enter amount, date, category, sub-category, and description
- **Edit Transaction** — Click Edit to update any transaction
- **Delete Transaction** — Click Delete (asks for confirmation first)
- **View Summary** — See Total Income, Total Expenses, and Net Balance at the top
- **Transaction History** — All transactions shown in a table

### Filter & Sort
- Filter by Category (Income / Expense)
- Filter by Sub-Category
- Filter by Date Range
- Sort by Date (Newest / Oldest)
- Sort by Amount (High to Low / Low to High)

### Bonus Features
- 📊 **Pie Chart** — Shows expense breakdown by sub-category
- 📊 **Bar Chart** — Compares total income vs total expenses
- 📥 **Download CSV** — Export all transactions as a .csv file

---

## 🗂️ Sub-Categories

|   Income   | Expense       |
|------------|---------------|
| Salary     | Rent          |
| Allowances | Food          |
| Bonus      | Shopping      |
| Petty Cash | Entertainment |
| Other      | Transport     |
|            | Other         |

---

## ✅ Form Validations

- Amount cannot be empty or zero
- Date cannot be a future date
- Category must be selected (radio button)
- Sub-category must be selected from dropdown
- Description is optional but limited to 100 characters
- Invalid fields are highlighted with a red border and show an error message

---

## 💾 How Data is Saved

All transactions are saved to `localStorage` as a JSON string. When you open the app again, it reads from localStorage and shows your saved transactions automatically.

---

## 🧱 OOP Structure (JavaScript)

The JavaScript is organized using two classes:

**`Transaction` class**
- A simple blueprint for each transaction
- Stores: id, amount, date, category, subcategory, description

**`App` class**
- Handles everything — adding, editing, deleting, filtering, rendering
- Has methods like `saveTransaction()`, `deleteTransaction()`, `renderAll()`, `downloadCSV()`, etc.

---

## 🚀 How to Run

1. Download or clone the project files
2. Open `index.html` in any browser
3. No installation or server needed — it runs directly in the browser

---

## 🖼️ App Sections

|      Section      |             Description                |
|-------------------|----------------------------------------|
| Navbar            | App title and "Add Transaction" button |
| Summary Cards     | Shows Income, Expense, and Balance     |
| Filter Bar        | Filter and sort transactions           |
| Transaction Table | Lists all transactions with Edit/Delete|
| Charts            | Pie and Bar chart for visual summary   |
| Download Button   | Export data as CSV                     |

---

## ⚠️ Challenges Faced

- Understanding how `localStorage` works and converting objects to JSON
- Using classes in JavaScript for the first time (OOP was new to me)
- Figuring out how to destroy and recreate Chart.js charts when data updates
- Making the filter and sort work together correctly

---

## 📚 Key Learnings

- How to use ES6 Classes and OOP in JavaScript
- How `localStorage.setItem()` and `getItem()` work
- How to dynamically create and update HTML elements using JavaScript
- How to use Chart.js for simple data visualization
- Form validation and error handling in vanilla JavaScript

---

## 👩‍💻 Made By

Deepti  
Capstone Project — Money Manager App
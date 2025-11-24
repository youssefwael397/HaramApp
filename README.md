# Daily To-Do & Monthly Salary Manager

A complete cross-platform mobile application built with React Native, Expo, and TypeScript that helps you manage daily tasks and monthly finances.

## Features

### 📋 Daily To-Do Manager
- ✅ Create, edit, and delete daily tasks
- ✅ Mark tasks as completed with checkbox
- ✅ Optional description, category, and due time
- ✅ View tasks by: Today, Completed, Missed
- ✅ Tasks persist locally using SQLite
- ✅ Daily task archiving

### 💰 Monthly Salary & Payments Manager
- 💵 Track monthly salary
- 📊 Automatic calculations:
  - Total Obligations (التزامات)
  - Total Withdrawals/Borrowed (استلافات)
  - Net Remaining Salary
- 💳 Payment items with:
  - Category
  - Cost
  - Type (Obligations/Borrowed)
  - Notes
  - Payment status (Paid/Not Paid)
  - Optional payment date
- 📤 Export monthly report to CSV
- 🎨 Color-coded categories

### 🌍 Internationalization
- 🇬🇧 English
- 🇸🇦 Arabic (with RTL support)
- Toggle between languages with one tap

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Database**: SQLite (expo-sqlite)
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Internationalization**: i18next, react-i18next
- **Icons**: Lucide React Native
- **Date Handling**: date-fns

## Project Structure

```
joo-todo-app/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── (tabs)/            # Tab navigation
│   │   │   ├── _layout.tsx    # Tab layout
│   │   │   ├── index.tsx      # Daily Tasks screen
│   │   │   └── money.tsx      # Money Manager screen
│   │   └── _layout.tsx        # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── AddTaskModal.tsx
│   │   ├── AddTransactionModal.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── TaskItem.tsx
│   │   └── TransactionItem.tsx
│   ├── data/                  # Data layer
│   │   ├── db.ts             # Database initialization
│   │   └── repositories/     # Repository pattern
│   │       ├── TaskRepository.ts
│   │       ├── TransactionRepository.ts
│   │       └── SettingsRepository.ts
│   ├── domain/               # Domain models
│   │   └── models.ts         # TypeScript interfaces
│   ├── i18n/                 # Internationalization
│   │   ├── index.ts          # i18n configuration
│   │   ├── en.json           # English translations
│   │   └── ar.json           # Arabic translations
│   ├── store/                # State management
│   │   ├── useTaskStore.ts
│   │   └── useTransactionStore.ts
│   └── utils/                # Utilities
│       └── csvExporter.ts    # CSV export functionality
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── global.css                # Global styles
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device (iOS/Android)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd joo-todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## Usage

### Daily Tasks
1. Tap the **Daily Tasks** tab
2. Tap the **+** button to add a new task
3. Enter task title and optional category
4. Tap checkbox to mark as completed
5. Swipe or tap delete icon to remove

### Money Manager
1. Tap the **Monthly Payments** tab
2. Tap the salary amount to edit it
3. Tap the **+** button to add a transaction
4. Choose type: Obligation or Borrowed
5. Enter title, amount, and optional category
6. Tap transaction to toggle paid status
7. Tap export icon to download CSV report

### Language Toggle
- Tap the language button in the header to switch between English and Arabic
- The app will reload to apply RTL layout for Arabic

## Database Schema

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  dueTime TEXT,
  isCompleted INTEGER DEFAULT 0,
  date TEXT NOT NULL
)
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  notes TEXT,
  isPaid INTEGER DEFAULT 0,
  date TEXT NOT NULL
)
```

### Settings Table
```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  salary REAL DEFAULT 0
)
```

## Calculations Logic

The app replicates spreadsheet-style calculations:

```
Total Obligations = SUM(all transactions where type = 'obligation')
Total Borrowed = SUM(all transactions where type = 'borrowed')
Remaining Salary = Salary - Total Obligations - Total Borrowed
```

## Troubleshooting

### App won't start
```bash
# Clear cache and restart
npx expo start -c
```

### Database issues
The database is automatically initialized on first launch. If you encounter issues, uninstall and reinstall the app.

### Styling not working
Make sure NativeWind is properly configured in `babel.config.js` and `tailwind.config.js`.

## Development

### Adding a new screen
1. Create a new file in `src/app/` or `src/app/(tabs)/`
2. Export a default React component
3. Expo Router will automatically create a route

### Adding translations
1. Add keys to `src/i18n/en.json` and `src/i18n/ar.json`
2. Use `useTranslation()` hook in components:
   ```tsx
   const { t } = useTranslation();
   <Text>{t('key.path')}</Text>
   ```

### Modifying database schema
1. Update table creation in `src/data/db.ts`
2. Update models in `src/domain/models.ts`
3. Update repositories in `src/data/repositories/`

## Future Enhancements

- [ ] Charts/Graphs for salary distribution
- [ ] Recurring transactions
- [ ] Cloud sync
- [ ] Notifications for tasks
- [ ] Categories management
- [ ] Dark mode
- [ ] PDF export

## License

MIT

## Author

Built with ❤️ using React Native and Expo

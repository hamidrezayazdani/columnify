# Columnify 🏆

Columnify is an advanced, flexible JavaScript library for dynamic table column visibility management. It provides a powerful, customizable solution for controlling column display in HTML tables.

## 🌟 Features

- **Flexible Column Management**
  - Show/hide individual columns
  - Preserve required columns
  - Multiple selector layouts

- **Responsive Design**
  - Mobile-friendly
  - Adaptive layout
  - Configurable breakpoints

- **Internationalization**
  - Multi-language support
  - RTL (Right-to-Left) compatibility

- **Dropdown Enhancements**
  - Smart positioning based on scroll
  - Overflow handling
  - Quick select/deselect actions

## 🚀 Installation

```bash
npm install columnify
```

## 💡 Basic Usage

```javascript
import Columnify from 'columnify';

const columnManager = new Columnify({
  tableSelector: '#myTable',
  initialVisibleColumns: [0, 2],
  requiredColumns: [0],
  responsiveMode: 'mobile',
  selectorLayout: 'dropdown'
});
```

## 🔧 Configuration Options

### Table Selection
- `tableSelector`: CSS selector for your table
- `initialVisibleColumns`: Control initial column visibility
  - `'all'`: Show all columns
  - `[0, 2]`: Show specific columns by index

### Column Management
- `requiredColumns`: Specify columns that can't be hidden
- `hiddenColumnMessage`: Optional text for hidden columns

### Responsive Behavior
- `responsiveMode`: 
  - `'always'`: Selector always visible
  - `'mobile'`: Show only on mobile
  - `'desktop'`: Hide on mobile/tablet

### Selector Layouts
- `selectorLayout`:
  - `'toggle'`: Toggle switches
  - `'checkbox'`: Checkboxes
  - `'dropdown'`: Dropdown selector

### Internationalization
- `i18n`: Customize text for different languages
- `rtl`: Automatic RTL detection and layout adjustment

## 📦 Examples

### 1. Basic Table with Toggle Selector
```javascript
new Columnify({
  tableSelector: '#salesTable',
  selectorLayout: 'toggle'
});
```

### 2. Financial Report with Dropdown
```javascript
new Columnify({
  tableSelector: '#financialReport',
  requiredColumns: [0], // Always show first column
  selectorLayout: 'dropdown',
  initialVisibleColumns: [0, 1, 2],
  hiddenColumnMessage: 'Additional details hidden'
});
```

### 3. Responsive Mobile Dashboard
```javascript
new Columnify({
  tableSelector: '#mobileDashboard',
  responsiveMode: 'mobile',
  selectorLayout: 'checkbox',
  breakpoints: {
    mobile: 600,
    tablet: 900
  }
});
```

## 🌐 RTL Support

Columnify automatically detects page direction:
- Supports `dir="rtl"` on `<body>` or parent elements
- Adjusts layout and dropdown positioning

## 🤝 Contributing

Contributions are welcome! Please check our [Contributing Guidelines](CONTRIBUTING.md).

## 📄 License

MIT License

## 🚦 Performance

- Minimal overhead
- Vanilla JavaScript
- No external dependencies
- Lightweight and fast
```
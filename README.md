# XML Form Renderer Documentation

## Project Overview
The XML Form Renderer is a React Native application that parses XML-based form definitions and renders them as interactive forms. The application supports various form elements including text fields, date/time inputs, radio buttons, and signature drawing fields.

## Project Structure

```plaintext
XMLFormRenderer/
├── components/
│   ├── FormRenderer.js
│   ├── TextField.js
│   ├── DateTimeField.js
│   ├── RadioButtons.js
│   └── DrawingField.js
├── utils/
│   ├── xmlParser.js
│   └── validation.js
└── App.js
```

## Component Documentation

### App.js
The root component that sets up the application environment.

```javascript
// Main application wrapper
export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HomeScreen />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
```
**Purpose**: Provides necessary providers and root layout for the application.

### FormRenderer.js
The main component responsible for rendering the form based on parsed XML data.

**Key Functions**:
```javascript
const FormRenderer = ({ xml }) => {
  // State management for form data
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
}
```

**Responsibilities**:
- Parses XML input using xmlParser
- Manages form state
- Renders appropriate form components
- Handles form data changes
- Provides form validation

### TextField.js
Handles character-by-character text input with auto-progression.

**Key Features**:
```javascript
const TextField = ({ label, value, onChangeText, length = 20 }) => {
  const inputRefs = useRef(Array(length).fill(null));
  
  const handleCharChange = (text, index) => {
    // Auto-progression logic
  };
}
```

**Functionality**:
- Individual character inputs
- Automatic cursor progression
- Backspace handling
- Character validation
- Visual formatting

### DateTimeField.js
Provides date and time input functionality.

**Implementation**:
```javascript
const DateTimeField = ({ label, value, onChange }) => {
  const formattedDate = value ? new Date(value) : new Date();
  
  return (
    <DateTimePicker
      value={formattedDate}
      mode="date"
      // ...
    />
  );
}
```

**Features**:
- Native date picker integration
- Date formatting
- Date validation
- Default value handling

### RadioButtons.js
Implements radio button group functionality.

**Core Logic**:
```javascript
const RadioButtons = ({ label, options, selectedValue, onSelect }) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          onPress={() => onSelect(option.value)}
          // ...
        />
      ))}
    </View>
  );
}
```

**Features**:
- Multiple option support
- Custom styling
- Selection state management
- Accessibility support

### DrawingField.js
Provides signature or drawing functionality.

**Implementation**:
```javascript
const DrawingField = ({ label, onDrawingChange }) => {
  const pathRef = useRef('');
  const pointsRef = useRef([]);

  const pan = Gesture.Pan()
    .onBegin((e) => {
      // Drawing logic
    });
}
```

**Features**:
- Gesture handling
- SVG path drawing
- Real-time updates
- Drawing state management

## Utility Functions

### xmlParser.js
Handles XML parsing and form field extraction.

**Key Functions**:
```javascript
export const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    // XML parsing logic
  });
}
```

**Responsibilities**:
- XML string cleanup
- Structure parsing
- Field extraction
- Label finding
- Radio button label handling

### validation.js
Provides form validation functionality.

**Implementation**:
```javascript
export const validateField = (field, value) => {
  const errors = [];
  // Validation logic per field type
  return errors;
};
```

**Validation Types**:
- Required field validation
- Length validation
- Date format validation
- Option validation

## XML Structure
The application expects XML in the following format:

```xml
<div>
  <div class="formSide">
    <svg>
      <!-- Form elements defined here -->
      <g fdtType="iso">
        <!-- Text input definition -->
      </g>
      <g fdtType="radioList">
        <!-- Radio button definition -->
      </g>
      <!-- Other form elements -->
    </svg>
  </div>
</div>
```

## Usage Example

```javascript
// In your screen component
import FormRenderer from './components/FormRenderer';

const HomeScreen = () => {
  return (
    <FormRenderer xml={yourXMLString} />
  );
};
```

## Dependencies
- @react-native-community/datetimepicker: ^7.6.1
- react-native-gesture-handler: ~2.14.0
- react-native-svg: ^14.1.0

## Error Handling
The application includes comprehensive error handling:
- XML parsing errors
- Validation errors
- Input errors
- State management errors

## Performance Considerations
- Uses refs for optimized input handling
- Implements proper React state management
- Optimizes re-renders
- Handles memory management for drawing operations

## Accessibility
The application implements accessibility features:
- Screen reader support
- Keyboard navigation
- Focus management
- Clear labeling

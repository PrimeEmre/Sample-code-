// --- Pin Definitions ---
// Segments: A, B, C, D, E, F, G, DP
const int segmentPins[8] = {2, 3, 4, 5, 6, 7, 8, 9}; 
// Digits: 1, 2, 3, 4
const int digitPins[4] = {10, 11, 12, 13}; 

const int timerSwitch = A0;   // Starts/Pauses Pomodoro
const int pomodoroLED = A1;   // Solid when working
const int aiStatusLED = A2;   // Pulses/Solid for AI status
const int manualAISwitch = A3; // Forces AI to run

// --- Variables ---
unsigned long previousMillis = 0;
const long interval = 1000; // 1 second update
int minutes = 5;
int seconds = 0;
bool isTimerRunning = false;

// --- AI research status (red LED blinks while Python is still working) ---
bool isResearching = false;
unsigned long lastBlinkMillis = 0;
const long blinkInterval = 250; // ms between blinks while researching
bool blinkState = false;

// 0-9 Segment Truth Table (Common Cathode)
const byte numbers[10][8] = {
  {1,1,1,1,1,1,0,0}, // 0
  {0,1,1,0,0,0,0,0}, // 1
  {1,1,0,1,1,0,1,0}, // 2
  {1,1,1,1,0,0,1,0}, // 3
  {0,1,1,0,0,1,1,0}, // 4
  {1,0,1,1,0,1,1,0}, // 5
  {1,0,1,1,1,1,1,0}, // 6
  {1,1,1,0,0,0,0,0}, // 7
  {1,1,1,1,1,1,1,0}, // 8
  {1,1,1,1,0,1,1,0}  // 9
};

void setup() {
  Serial.begin(9600); // Start serial for Python communication
  
  for(int i = 0; i < 8; i++) pinMode(segmentPins[i], OUTPUT);
  for(int i = 0; i < 4; i++) pinMode(digitPins[i], OUTPUT);
  
  pinMode(timerSwitch, INPUT_PULLUP);
  pinMode(manualAISwitch, INPUT_PULLUP);
  pinMode(pomodoroLED, OUTPUT);
  pinMode(aiStatusLED, OUTPUT);
}

void loop() {
  unsigned long currentMillis = millis();

  // 1. Check Timer Switch
  if (digitalRead(timerSwitch) == LOW) {
    delay(200); // Simple debounce
    isTimerRunning = !isTimerRunning;
    digitalWrite(pomodoroLED, isTimerRunning ? HIGH : LOW);
  }

  // 2. Check Manual AI Switch
  if (digitalRead(manualAISwitch) == LOW) {
    delay(200);
    Serial.println("TRIGGER_AI"); // Send signal to Python
    startResearching();
  }

  // 3. Handle Countdown
  if (isTimerRunning && (currentMillis - previousMillis >= interval)) {
    previousMillis = currentMillis;
    if (seconds == 0) {
      if (minutes == 0) {
        // Timer Hit Zero!
        isTimerRunning = false;
        digitalWrite(pomodoroLED, LOW);
        Serial.println("TRIGGER_AI"); // Send signal to Python
        startResearching();
        minutes = 5; // Reset for next time
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }
  }

  // 4. Blink the AI status LED while Python is still working
  if (isResearching && (currentMillis - lastBlinkMillis >= blinkInterval)) {
    lastBlinkMillis = currentMillis;
    blinkState = !blinkState;
    digitalWrite(aiStatusLED, blinkState ? HIGH : LOW);
  }

  // 5. Listen for Python telling us the research is done
  if (Serial.available() > 0) {
    String incoming = Serial.readStringUntil('\n');
    incoming.trim();
    if (incoming == "AI_DONE") {
      isResearching = false;
      digitalWrite(aiStatusLED, LOW);
    }
  }

  // 6. Multiplex the Display
  displayNumber(minutes * 100 + seconds);
}

void displayNumber(int num) {
  int displayDigits[4];
  displayDigits[0] = num / 1000;
  displayDigits[1] = (num / 100) % 10;
  displayDigits[2] = (num / 10) % 10;
  displayDigits[3] = num % 10;

  for (int digit = 0; digit < 4; digit++) {
    // Turn off all digits
    for (int i = 0; i < 4; i++) digitalWrite(digitPins[i], HIGH); 
    
    // Set segments for current digit
    for (int seg = 0; seg < 8; seg++) {
      digitalWrite(segmentPins[seg], numbers[displayDigits[digit]][seg]);
    }
    
    // Turn on current digit
    digitalWrite(digitPins[digit], LOW); 
    delay(5); // Wait a tiny bit so the eye sees it
  }
}

void startResearching() {
  // Kicks off the blinking state; the actual blinking happens non-blocking
  // in loop() so the countdown display keeps running smoothly.
  isResearching = true;
  lastBlinkMillis = millis();
  blinkState = true;
  digitalWrite(aiStatusLED, HIGH);
}
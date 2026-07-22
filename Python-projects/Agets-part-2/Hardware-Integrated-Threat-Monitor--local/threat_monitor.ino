const int redLedPin = 9;   // Critical Alert Pin
const int greenLedPin = 10; // Nominal Status Pin

void setup() {
  Serial.begin(9600); // Initialize the serial bus at 9600 baud
  
  pinMode(redLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);
  
  // Boot Sequence: Default to Nominal Status
  digitalWrite(greenLedPin, HIGH);
  digitalWrite(redLedPin, LOW);
}

void loop() {
  // Listen for the byte signals from the Python Flask backend
  if (Serial.available() > 0) {
    char incomingSignal = Serial.read(); 
    
    if (incomingSignal == 'C') {
      // OVERRIDE: TRIGGER RED ALERT
      digitalWrite(redLedPin, HIGH);
      digitalWrite(greenLedPin, LOW);
    } 
    else if (incomingSignal == 'O') {
      // OVERRIDE: TRIGGER GREEN NOMINAL
      digitalWrite(greenLedPin, HIGH);
      digitalWrite(redLedPin, LOW);
    }
  }
}
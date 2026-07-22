// J.A.R.V.I.S. hardware state machine.
// Receives one-character state signals over serial (9600 baud) from app.py's
// trigger_hardware_state() and drives LEDs/servo to match:
//   '0' idle          -> everything off, servo parked/stopped
//   'B' researching    -> blue LED pulses, loading servo sweeps
//   'Y' debating        -> yellow LED pulses (faster), loading servo sweeps
//   'W' complete        -> LEDs off, loading servo parks/stops (work is done)

#include <Servo.h>

const int PIN_RESEARCH_BLUE = 12;
const int PIN_DEBATE_YELLOW = 13;
const int PIN_LOADING_SERVO = 8;

const int SERVO_PARKED_ANGLE = 90;   // "stopped" position
const int SERVO_MIN_ANGLE = 0;
const int SERVO_MAX_ANGLE = 180;
const int SERVO_STEP_DEGREES = 2;
const unsigned long SERVO_STEP_INTERVAL_MS = 15; // lower = faster sweep

Servo loadingServo;

char state = '0';
unsigned long lastLedToggle = 0;
bool pulseOn = false;

unsigned long lastServoStep = 0;
int servoAngle = SERVO_PARKED_ANGLE;
int servoDirection = 1;
bool servoParked = true;

void setLedsOff() {
  digitalWrite(PIN_RESEARCH_BLUE, LOW);
  digitalWrite(PIN_DEBATE_YELLOW, LOW);
}

void parkServo() {
  if (!servoParked) {
    loadingServo.write(SERVO_PARKED_ANGLE);
    servoAngle = SERVO_PARKED_ANGLE;
    servoParked = true;
  }
}

// Continuously sweeps end-to-end while loading, like an old modem's
// activity indicator spinning to show something is happening.
void sweepServo() {
  servoParked = false;
  unsigned long now = millis();
  if (now - lastServoStep < SERVO_STEP_INTERVAL_MS) return;
  lastServoStep = now;

  servoAngle += servoDirection * SERVO_STEP_DEGREES;
  if (servoAngle >= SERVO_MAX_ANGLE) {
    servoAngle = SERVO_MAX_ANGLE;
    servoDirection = -1;
  } else if (servoAngle <= SERVO_MIN_ANGLE) {
    servoAngle = SERVO_MIN_ANGLE;
    servoDirection = 1;
  }
  loadingServo.write(servoAngle);
}

void setup() {
  pinMode(PIN_RESEARCH_BLUE, OUTPUT);
  pinMode(PIN_DEBATE_YELLOW, OUTPUT);
  setLedsOff();

  loadingServo.attach(PIN_LOADING_SERVO);
  loadingServo.write(SERVO_PARKED_ANGLE);

  Serial.begin(9600);
}

void pulse(int pin, unsigned long intervalMs) {
  unsigned long now = millis();
  if (now - lastLedToggle >= intervalMs) {
    pulseOn = !pulseOn;
    lastLedToggle = now;
  }
  digitalWrite(pin, pulseOn ? HIGH : LOW);
}

void loop() {
  if (Serial.available() > 0) {
    char incoming = Serial.read();
    if (incoming == '0' || incoming == 'B' || incoming == 'Y' || incoming == 'W') {
      state = incoming;
      setLedsOff();
      lastLedToggle = millis();
      pulseOn = true;
    }
  }

  switch (state) {
    case 'B':
      pulse(PIN_RESEARCH_BLUE, 400);
      sweepServo();
      break;
    case 'Y':
      pulse(PIN_DEBATE_YELLOW, 200);
      sweepServo();
      break;
    case 'W':
      setLedsOff();
      parkServo();
      break;
    default:
      setLedsOff();
      parkServo();
      break;
  }
}

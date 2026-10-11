import React, { useRef, useEffect } from 'react';

export default function OtpInput({
  value = '',
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
}) {
  const inputsRef = useRef([]);

  // Ensure internal array of digits
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e, index) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        // Clear current
        newDigits[index] = '';
        onChange(newDigits.join(''));
      } else if (index > 0) {
        // Move to prev and clear
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleChange = (e, index) => {
    if (disabled) return;
    const inputVal = e.target.value.replace(/\D/g, '');
    if (!inputVal) return;

    const char = inputVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    const nextValue = newDigits.join('');
    onChange(nextValue);

    // Auto advance to next box
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="otp-inputs-row" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          className={`otp-box ${digits[index] ? 'is-filled' : ''}`}
          aria-label={`Digit ${index + 1} of verification code`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

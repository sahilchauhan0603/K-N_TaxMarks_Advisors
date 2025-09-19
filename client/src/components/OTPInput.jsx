import React, { useState, useRef, useEffect } from "react";

const OTPInput = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  autoFocus = false,
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    // Update internal state when value prop changes
    if (value !== otp.join("")) {
      const newOtp = value.split("").slice(0, length);
      while (newOtp.length < length) {
        newOtp.push("");
      }
      setOtp(newOtp);
    }
  }, [value, length]);

  useEffect(() => {
    // Auto focus first input
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (element, index) => {
    if (disabled) return;

    const val = element.value;
    // Allow alphanumeric characters (letters and numbers)
    if (!/^[a-zA-Z0-9]*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    onChange(otpValue);

    // Focus next input
    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;

    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    // Allow alphanumeric characters in paste
    const pasteArray = pasteData
      .split("")
      .filter((char) => /^[a-zA-Z0-9]$/.test(char))
      .slice(0, length);

    const newOtp = [...otp];
    pasteArray.forEach((char, index) => {
      if (index < length) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl
            transition-all duration-200 outline-none
            ${
              digit
                ? "border-blue-500 bg-blue-50 text-blue-900"
                : "border-gray-300 bg-white text-gray-900"
            }
            ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }
          `}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OTPInput;

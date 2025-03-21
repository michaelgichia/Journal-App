"use client";

import React, {
  useState,
  KeyboardEvent,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  format,
  isToday,
  startOfDay,
  getDaysInMonth,
  getDay,
  isBefore,
  isAfter,
  isSameMonth,
  isSameYear,
  addMonths,
  subMonths,
  startOfMonth,
  isValid,
  parseISO,
} from "date-fns";

/**
 * A reusable date picker component.
 * Provides an accessible calendar interface with keyboard navigation and screen reader support.
 * Handles complex date validation, formatting, and state management.
 */

/**
 * Props for configuring the DatePicker component.
 * Allows customization of validation constraints, appearance, and behavior.
 */
interface DatePickerProps {
  name: string;
  label?: string; // Optional label for accessibility
  maxDate?: Date | string | null; // Upper bound for date selection
  minDate?: Date | string | null; // Lower bound for date selection
  onChange?: (date: string | null) => void; // Callback for date changes
  placeholder?: string; // Input placeholder text
  helperText?: string; // Additional guidance text
  value?: string | null; // Controlled value input
  defaultValue?: string | null; //uncontrolled value
}

/**
 * Calendar icon SVG component
 */
const CalendarIcon: React.FC = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
    />
  </svg>
);

/**
 * Props for the chevron icon used in calendar navigation
 */
interface ChevronIconProps {
  direction: "left" | "right";
}

/**
 * Chevron icon SVG component for calendar navigation
 */
const ChevronIcon: React.FC<ChevronIconProps> = ({ direction }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={direction === "left" ? "rotate-180" : ""}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// Constants for calendar display - using abbreviated forms for compact UI
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/**
 * Parses date input into a standardized Date object.
 * Necessary because dates can come from multiple sources (string, Date object) and need validation.
 * Handles edge cases like invalid dates and provides consistent error handling.
 *
 * @param date - The date input to parse
 * @returns A valid Date object or null if parsing fails
 */
const parseDate = (date: Date | string | null): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return isValid(date) ? date : null;
  try {
    const parsedDate = parseISO(date);
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Invalid date format:", date, error);
    }
    return null;
  }
};

/**
 * Formats a date into YYYY-MM-DD format for API consistency.
 * This format is used for data storage and API communication to ensure consistent date handling.
 *
 * @param date - The date to format
 * @returns Formatted date string or empty string if invalid
 */
const formatDate = (date: Date | string): string => {
  const parsedDate = parseDate(date);
  return parsedDate ? format(parsedDate, "yyyy-MM-dd") : "";
};

/**
 * Formats a date for user display in DD/MM/YYYY format.
 * Uses a more human-readable format for UI display while maintaining internal YYYY-MM-DD format.
 *
 * @param date - The date string to format
 * @returns Formatted date string or empty string if invalid
 */
const formatDisplayDate = (date: string): string => {
  const parsedDate = parseDate(date);
  return parsedDate ? format(parsedDate, "dd/MM/yyyy") : "";
};

/**
 * Determines if a date should be disabled in the calendar.
 * Enforces date range constraints to prevent selection of invalid dates.
 * Used for both initial validation and UI feedback.
 *
 * @param date - The date to check
 * @param minDate - Optional minimum allowed date
 * @param maxDate - Optional maximum allowed date
 * @returns True if the date should be disabled
 */
const isDateDisabled = (
  date: string,
  minDate: Date | string | null,
  maxDate: Date | string | null
): boolean => {
  const parsedDate = parseDate(date);
  if (!parsedDate) return true;

  const maxParsedDate = parseDate(maxDate);
  const minParsedDate = parseDate(minDate);

  if (maxParsedDate && isAfter(parsedDate, maxParsedDate)) return true;
  if (minParsedDate && isBefore(parsedDate, minParsedDate)) return true;
  return false;
};

/**
 * Generates metadata for calendar day cells.
 * Creates a grid of dates including previous/next month overflow for consistent calendar display.
 * Handles edge cases like month boundaries and applies proper styling classes.
 *
 * @param currentDate - The current month being displayed
 * @param selectedDate - The currently selected date
 * @param isDateDisabled - Function to check if a date should be disabled
 * @returns Array of day metadata objects for rendering
 */
const generateCalendarDaysMetadata = (
  currentDate: Date,
  selectedDate: string | null,
  isDateDisabled: (date: string) => boolean
) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = getDay(startOfMonth(currentDate));
  const daysInCurrentMonth = getDaysInMonth(currentDate);
  const daysInPrevMonth = getDaysInMonth(subMonths(currentDate, 1));
  const days = [];

  // Previous month days
  for (let i = 0; i < firstDayOfMonth; i++) {
    const day = daysInPrevMonth - firstDayOfMonth + i + 1;
    const date = new Date(year, month - 1, day);
    const dateString = formatDate(date);
    days.push({
      day,
      type: "prev-month",
      date,
      isDisabled: isDateDisabled(dateString),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = formatDate(date);
    days.push({
      day,
      type: "current-month",
      date,
      isSelected: dateString === selectedDate,
      isToday: isToday(startOfDay(date)),
      isDisabled: isDateDisabled(dateString),
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    const dateString = formatDate(date);
    days.push({
      day: i,
      type: "next-month",
      date,
      isDisabled: isDateDisabled(dateString),
    });
  }

  return days;
};

/**
 * Props for the Calendar subcomponent.
 * Separates calendar rendering logic from the main DatePicker for better maintainability.
 */
interface CalendarProps {
  currentDate: Date;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onMonthChange: (direction: "prev" | "next") => void;
  isDateDisabled: (date: string) => boolean;
  formatDate: (date: Date | string) => string;
  minDate: Date | string | null;
  maxDate: Date | string | null;
}

/**
 * Calendar component that handles date selection and navigation.
 * Implements keyboard navigation and accessibility features.
 * Uses CSS Grid for consistent layout across browsers.
 */
const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  isDateDisabled,
  formatDate,
  minDate,
  maxDate,
}) => {
  const isMonthNavigationDisabled = useCallback(
    (direction: "prev" | "next"): boolean => {
      if (!minDate && !maxDate) return false;

      if (direction === "prev" && minDate) {
        const minDateObj = new Date(minDate);
        return (
          isSameMonth(currentDate, minDateObj) &&
          isSameYear(currentDate, minDateObj)
        );
      }

      if (direction === "next" && maxDate) {
        const maxDateObj = new Date(maxDate);
        return (
          isSameMonth(currentDate, maxDateObj) &&
          isSameYear(currentDate, maxDateObj)
        );
      }

      return false;
    },
    [currentDate, minDate, maxDate]
  );

  const renderCalendarDay = useCallback(
    (dayData: ReturnType<typeof generateCalendarDaysMetadata>[0]) => {
      if (dayData.type !== "current-month") {
        return (
          <div
            key={`${dayData.type}-${dayData.day}`}
            className={`text-center py-1 text-sm text-gray-400 ${
              dayData.isDisabled ? "line-through" : ""
            }`}
          >
            {dayData.day}
          </div>
        );
      }

      return (
        <button
          key={dayData.day}
          type="button"
          disabled={dayData.isDisabled}
          onClick={() => onDateSelect(formatDate(dayData.date))}
          aria-disabled={dayData.isDisabled}
          role="gridcell"
          aria-selected={dayData.isSelected}
          aria-label={format(dayData.date, "PPPP")}
          className={`
          text-center py-1 text-sm relative
          ${
            dayData.isSelected
              ? "text-white"
              : dayData.isToday
              ? "text-blue-500" // Changed for visibility
              : "text-gray-700"
          }
          ${dayData.isSelected ? "font-medium" : ""}
          ${
            dayData.isDisabled
              ? "line-through cursor-not-allowed"
              : "hover:bg-gray-100 hover:text-black"
          }
          rounded
        `}
        >
          {dayData.day}
          {dayData.isSelected && !dayData.isDisabled && (
            <div className="absolute inset-0 bg-blue-500 rounded-full z-[-1]" /> // Changed for visibility
          )}
          {dayData.isToday && !dayData.isSelected && !dayData.isDisabled && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" /> // Changed for visibility
          )}
        </button>
      );
    },
    [onDateSelect, formatDate]
  );

  const daysMetadata = useMemo(
    () =>
      generateCalendarDaysMetadata(currentDate, selectedDate, isDateDisabled),
    [currentDate, selectedDate, isDateDisabled]
  );

  return (
    <div
      role="dialog"
      aria-label="Calendar"
      aria-modal="true"
      className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-[280px] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => onMonthChange("prev")}
          disabled={isMonthNavigationDisabled("prev")}
          aria-label="Previous month"
          className={`p-1 rounded ${
            isMonthNavigationDisabled("prev")
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          <ChevronIcon direction="left" />
        </button>
        <div
          className="font-medium text-sm"
          role="heading"
          aria-level={2}
          aria-live="polite"
        >
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button
          type="button"
          onClick={() => onMonthChange("next")}
          disabled={isMonthNavigationDisabled("next")}
          aria-label="Next month"
          className={`p-1 rounded ${
            isMonthNavigationDisabled("next")
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2" role="rowgroup">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-gray-500 font-medium"
            role="columnheader"
            aria-label={day}
          >
            {day.slice(0, 3)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" role="grid">
        {daysMetadata.map(renderCalendarDay)}
      </div>
    </div>
  );
};

/**
 * Main DatePickerField component that integrates with Formik and provides a calendar interface
 */
const DatePickerField: React.FC<DatePickerProps> = ({
  label,
  maxDate = null,
  minDate = null,
  name,
  onChange,
  placeholder = "DD/MM/YYYY",
  helperText,
  value: controlledValue,
  defaultValue,
}) => {
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue || null);
    const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

    // Use controlled value if provided, otherwise use internal state
    const value = controlledValue !== undefined ? controlledValue : internalValue;


  useEffect(() => {
        if(defaultValue){
            setInternalValue(defaultValue)
        }
  },[defaultValue])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target as Node)
    ) {
      setShowCalendar(false);
    }
  }, []);

  const handleOtherDatePickerClick = useCallback(
    (event: CustomEvent) => {
      // @ts-expect-error - name does not exist on type Event.
      if (event.detail.name !== "date-picker") { // Made a constant
        setShowCalendar(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener(
      "datepicker-click",
      handleOtherDatePickerClick as EventListener
    );

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener(
        "datepicker-click",
        handleOtherDatePickerClick as EventListener
      );
    };
  }, [handleClickOutside, handleOtherDatePickerClick]);

  const handleDatePickerClick = useCallback(() => {
    document.dispatchEvent(
      new CustomEvent("datepicker-click", { detail: { name: "date-picker" } }) // Made a constant
    );
    setShowCalendar(!showCalendar);
  }, [showCalendar]);

  const handleDateSelect = useCallback(
    (date: string) => {
      if (controlledValue === undefined) {
        setInternalValue(date);
      }
      onChange?.(date);
    },
    [onChange, controlledValue]
  );

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setShowCalendar(false);
    }
  }, []);

  const handleClearDate = useCallback(() => {
        if (controlledValue === undefined) {
          setInternalValue(null);
        }
    onChange?.(null);
  }, [onChange, controlledValue]);

  const handleMonthChange = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  }, []);

  const isDateDisabledMemo = useCallback(
    (date: string) => isDateDisabled(date, minDate, maxDate),
    [minDate, maxDate]
  );

  return (
    <div className="relative flex flex-col gap-2 w-full" ref={datePickerRef}>
      {label && (
        <label htmlFor="date-picker" className="text-sm font-semibold">
          {label}
        </label>
      )}

      <div className="relative" onKeyDown={handleKeyDown} role="presentation">
        <input
          id="date-picker"
          type="text"
          value={value ? formatDisplayDate(value) : ""}
          readOnly
          onClick={handleDatePickerClick}
          placeholder={placeholder}
          aria-label={label || "Date picker"}
          role="combobox"
          name={name}
          aria-expanded={showCalendar}
          aria-controls="date-picker-calendar" // Made a constant
          aria-autocomplete="none"
          className={`w-full p-2 pr-8 rounded-md bg-white border focus:ring-offset-0 border-gray-300 focus-visible:border-blue-500 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring cursor-pointer`} //changed
        />
        {value ? (
          <button
            type="button"
            onClick={handleClearDate}
            aria-label="Clear date"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ×
          </button>
        ) : (
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            aria-hidden="true"
            onClick={handleDatePickerClick}
          >
            <CalendarIcon />
          </span>
        )}

        {showCalendar && (
          <Calendar
            currentDate={currentDate}
            selectedDate={value || ""}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
            isDateDisabled={isDateDisabledMemo}
            formatDate={formatDate}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      </div>
      <div className="relative">
        {helperText && (
          <span className="text-sm text-gray-500">{helperText}</span> // Changed color
        )}
      </div>
    </div>
  );
};

export default DatePickerField;

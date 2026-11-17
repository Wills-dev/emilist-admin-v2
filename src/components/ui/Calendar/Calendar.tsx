'use client';
import { useEffect, useId, useRef, useState } from 'react';
import {
  addCalendarDays,
  calendarDate,
  calendarMonth,
  dateName,
  monthDays,
  parseCalendarDate,
  type DateRange,
} from '@/lib/date/calendarDates';
import { cn } from '@/lib/utils/cn';
type Props = { initialFocus?: boolean; initialMonth?: string } & (
  | { mode?: 'single'; value: string; onSelect: (value: string) => void }
  | { mode: 'range'; value: DateRange; onSelect: (value: DateRange) => void }
);
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export function Calendar(props: Props) {
  const id = useId();
  const selected = props.mode === 'range' ? props.value.from : props.value;
  const initial =
    parseCalendarDate(selected || props.initialMonth || '') || new Date();
  const [focused, setFocused] = useState(calendarDate(initial));
  const [month, setMonth] = useState(calendarDate(initial));
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef(props.initialFocus ?? false);
  useEffect(() => {
    if (pendingFocus.current) {
      buttons.current.get(focused)?.focus();
      pendingFocus.current = false;
    }
  }, [focused, month]);
  const date = parseCalendarDate(month)!;
  const year = date.getUTCFullYear();
  const currentMonth = date.getUTCMonth();
  const days = monthDays(month);
  const yearOptions = Array.from(
    { length: Math.max(2100, year) - Math.min(1900, year) + 1 },
    (_, index) => Math.min(1900, year) + index,
  );
  function move(value: string) {
    pendingFocus.current = true;
    setFocused(value);
    setMonth(value);
  }
  function choose(value: string) {
    setFocused(value);
    setMonth(value);
    if (props.mode !== 'range') props.onSelect(value);
    else if (!props.value.from || props.value.to)
      props.onSelect({ from: value, to: '' });
    else
      props.onSelect(
        value < props.value.from
          ? { from: value, to: props.value.from }
          : { from: props.value.from, to: value },
      );
  }
  function changeMonth(value: number, nextYear = year) {
    const valueDate = calendarDate(new Date(Date.UTC(nextYear, value, 1, 12)));
    setMonth(valueDate);
    setFocused(valueDate);
  }
  return (
    <div className="w-full max-w-72 rounded-lg bg-white p-3 text-xs text-neutral-700">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <label className="sr-only" htmlFor={`${id}-month`}>
          Month
        </label>
        <select
          id={`${id}-month`}
          aria-label="Calendar month"
          value={currentMonth}
          onChange={(event) => changeMonth(Number(event.target.value))}
          className="min-w-0 rounded-md border-0 bg-neutral-50 px-2 py-2 text-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          {months.map((label, index) => (
            <option key={label} value={index}>
              {label}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor={`${id}-year`}>
          Year
        </label>
        <select
          id={`${id}-year`}
          aria-label="Calendar year"
          value={year}
          onChange={(event) =>
            changeMonth(currentMonth, Number(event.target.value))
          }
          className="min-w-0 rounded-md border-0 bg-neutral-50 px-2 py-2 text-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          {yearOptions.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <table
        role="grid"
        aria-label={`${months[currentMonth]} ${year}`}
        className="w-full table-fixed border-collapse text-center"
      >
        <thead>
          <tr>
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
              <th
                key={day}
                scope="col"
                aria-label={
                  [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ][index]
                }
                className="pb-2 text-[10px] font-medium"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: days.length / 7 }, (_, week) => (
            <tr key={week}>
              {days.slice(week * 7, week * 7 + 7).map((value) => {
                const endpoint =
                  props.mode === 'range'
                    ? value === props.value.from || value === props.value.to
                    : value === props.value;
                const inRange =
                  props.mode === 'range' &&
                  props.value.from &&
                  props.value.to &&
                  value > props.value.from &&
                  value < props.value.to;
                return (
                  <td
                    role="gridcell"
                    key={value}
                    aria-selected={!!endpoint || !!inRange}
                    className="border border-neutral-200 p-0"
                  >
                    <button
                      type="button"
                      ref={(element) => {
                        if (element) buttons.current.set(value, element);
                        else buttons.current.delete(value);
                      }}
                      tabIndex={value === focused ? 0 : -1}
                      aria-label={dateName(value)}
                      aria-pressed={!!endpoint}
                      onClick={() => choose(value)}
                      onKeyDown={(event) => {
                        let next: string | undefined;
                        const offset =
                          (parseCalendarDate(value)!.getUTCDay() + 6) % 7;
                        if (event.key === 'ArrowLeft')
                          next = addCalendarDays(value, -1);
                        if (event.key === 'ArrowRight')
                          next = addCalendarDays(value, 1);
                        if (event.key === 'ArrowUp')
                          next = addCalendarDays(value, -7);
                        if (event.key === 'ArrowDown')
                          next = addCalendarDays(value, 7);
                        if (event.key === 'Home')
                          next = addCalendarDays(value, -offset);
                        if (event.key === 'End')
                          next = addCalendarDays(value, 6 - offset);
                        if (event.key === 'PageUp')
                          next = calendarMonth(
                            value,
                            event.shiftKey ? -12 : -1,
                          );
                        if (event.key === 'PageDown')
                          next = calendarMonth(value, event.shiftKey ? 12 : 1);
                        if (next) {
                          event.preventDefault();
                          move(next);
                        }
                      }}
                      className={cn(
                        'h-9 w-full text-[10px] transition-colors hover:bg-emerald-100 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-emerald-600 motion-reduce:transition-none',
                        value.slice(0, 7) !== month.slice(0, 7) &&
                          'text-neutral-400',
                        inRange && 'bg-emerald-50',
                        endpoint &&
                          'bg-[#20c46b] font-semibold text-white hover:bg-emerald-600',
                      )}
                    >
                      {Number(value.slice(8))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

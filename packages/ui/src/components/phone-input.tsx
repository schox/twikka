"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { ChevronDown } from "lucide-react";
import { cn } from "../utils";
import { Input } from "./input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { ScrollArea } from "./scroll-area";

// Country names for display
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function getCountryName(code: CountryCode): string {
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}

// Flag emoji from country code
function getFlag(code: CountryCode): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

// Prioritised countries shown at top of list
const PRIORITY_COUNTRIES: CountryCode[] = [
  "AU", "US", "GB", "CA", "NZ", "IN", "SG", "DE", "FR", "JP",
];

interface CountryEntry {
  code: CountryCode;
  name: string;
  dial: string;
  flag: string;
}

function buildCountryList(): CountryEntry[] {
  const all = getCountries();
  const entries: CountryEntry[] = all.map((code) => ({
    code,
    name: getCountryName(code),
    dial: "+" + getCountryCallingCode(code),
    flag: getFlag(code),
  }));
  entries.sort((a, b) => a.name.localeCompare(b.name));

  const prioritySet = new Set(PRIORITY_COUNTRIES);
  const priority = PRIORITY_COUNTRIES.map(
    (c) => entries.find((e) => e.code === c)!
  ).filter(Boolean);
  const rest = entries.filter((e) => !prioritySet.has(e.code));

  return [...priority, ...rest];
}

const COUNTRIES = buildCountryList();

function detectDefaultCountry(): CountryCode {
  if (typeof navigator === "undefined") return "US";
  const lang = navigator.language; // e.g. "en-AU", "en-US"
  const parts = lang.split("-");
  if (parts.length >= 2) {
    const region = parts[parts.length - 1].toUpperCase() as CountryCode;
    if (getCountries().includes(region)) return region;
  }
  return "US";
}

export interface PhoneInputProps {
  /** The raw text the user typed (displayed in the input) */
  value: string;
  /** Called with the raw text on every keystroke */
  onChange: (raw: string) => void;
  /** Called with the E.164 number when valid, or "" when invalid */
  onE164Change?: (e164: string) => void;
  /** The selected country code */
  country?: CountryCode;
  /** Called when the user picks a different country */
  onCountryChange?: (country: CountryCode) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id?: string;
}

export function PhoneInput({
  value,
  onChange,
  onE164Change,
  country: controlledCountry,
  onCountryChange,
  placeholder,
  autoFocus,
  className,
  id,
}: PhoneInputProps) {
  const [internalCountry, setInternalCountry] = useState<CountryCode>(detectDefaultCountry);
  const country = controlledCountry ?? internalCountry;
  const setCountry = onCountryChange ?? setInternalCountry;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dial.includes(q)
    );
  }, [search]);

  // Auto-detect country when user pastes a number starting with +
  useEffect(() => {
    if (!value.startsWith("+")) return;
    const parsed = parsePhoneNumberFromString(value);
    if (parsed?.country && parsed.country !== country) {
      setCountry(parsed.country);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Emit E.164 whenever value or country changes
  useEffect(() => {
    if (!value.trim()) {
      onE164Change?.("");
      return;
    }
    const parsed = parsePhoneNumberFromString(value, country);
    onE164Change?.(parsed?.isValid() ? parsed.format("E.164") : "");
  }, [value, country]); // eslint-disable-line react-hooks/exhaustive-deps

  const dialCode = "+" + getCountryCallingCode(country);
  const flag = getFlag(country);

  return (
    <div className={cn("flex", className)}>
      <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch(""); }}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "border-input bg-transparent flex h-9 shrink-0 items-center gap-1 rounded-l-md border border-r-0 px-2 text-sm transition-colors",
              "hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            )}
          >
            <span className="text-base leading-none">{flag}</span>
            <span className="text-muted-foreground text-xs">{dialCode}</span>
            <ChevronDown className="text-muted-foreground h-3 w-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2">
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="h-8 text-sm"
              autoFocus
            />
          </div>
          <ScrollArea className="h-56">
            <div className="px-1 pb-1">
              {filtered.map((c, i) => {
                // Show separator after priority countries
                const showSep =
                  !search &&
                  i === PRIORITY_COUNTRIES.length &&
                  i < filtered.length;
                return (
                  <div key={c.code}>
                    {showSep && (
                      <div className="border-border mx-2 my-1 border-t" />
                    )}
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors",
                        "hover:bg-accent",
                        c.code === country && "bg-accent"
                      )}
                      onClick={() => {
                        setCountry(c.code);
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      <span className="text-base leading-none">{c.flag}</span>
                      <span className="flex-1 truncate text-left">
                        {c.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {c.dial}
                      </span>
                    </button>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-muted-foreground px-2 py-3 text-center text-sm">
                  No countries found
                </p>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <Input
        id={id}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Phone number"}
        autoFocus={autoFocus}
        className="rounded-l-none"
      />
    </div>
  );
}

/**
 * Parse a raw phone string to E.164 using the given country as default.
 * Returns null if the number is invalid.
 */
export function toE164(raw: string, country: CountryCode): string | null {
  const parsed = parsePhoneNumberFromString(raw, country);
  return parsed?.isValid() ? parsed.format("E.164") : null;
}

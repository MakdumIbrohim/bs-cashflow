"use client";

import React from "react";
import { formatRupiah } from "../lib/utils";

export function FormTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#135156]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-slate-500">{description}</p>
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  readOnly = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "numeric";
  readOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all placeholder:text-slate-400 focus:border-[#135156] focus:ring-4 focus:ring-[rgba(19,81,86,0.15)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        readOnly={readOnly}
        disabled={disabled}
      />
    </label>
  );
}

export function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all focus:border-[#135156] focus:ring-4 focus:ring-[rgba(19,81,86,0.15)]"
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function SelectInput({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="block relative" ref={dropdownRef}>
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <div 
        className={`mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all cursor-pointer flex justify-between items-center ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 text-slate-500' : 'focus-within:border-[#135156] focus-within:ring-4 focus-within:ring-[rgba(19,81,86,0.15)]'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`w-5 h-5 text-[#135156] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <input 
              type="text"
              className="w-full px-4 py-3 text-base rounded-xl bg-white border border-slate-200 outline-none focus:border-[#135156] focus:ring-4 focus:ring-[rgba(19,81,86,0.15)] transition-all"
              placeholder="Ketik untuk mencari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div 
                  key={option.value}
                  className={`px-4 py-3 cursor-pointer rounded-xl transition-all font-medium ${value === option.value ? 'bg-[rgba(19,81,86,0.08)] text-[#135156]' : 'hover:bg-slate-50 text-slate-700'}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-slate-400 text-center text-sm font-medium">Data tidak ditemukan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ReadonlyMoney({ label, value }: { label: string; value: number }) {
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-5 py-4 text-lg font-black text-slate-900 outline-none"
        value={formatRupiah(value)}
        readOnly
      />
    </label>
  );
}

export function SubmitButton({
  children,
  tone,
  disabled = false,
}: {
  children: React.ReactNode;
  tone: "income" | "expense";
  disabled?: boolean;
}) {
  const className =
    tone === "income"
      ? "bg-[#135156] hover:bg-[#0f4347] focus:ring-[rgba(19,81,86,0.25)] shadow-lg shadow-[rgba(19,81,86,0.2)]"
      : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-600/25 shadow-lg shadow-rose-600/20";

  return (
    <button
      type="submit"
      disabled={disabled}
      className={`rounded-2xl px-5 py-4 text-lg font-black text-white transition-all focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 flex justify-center items-center gap-2 ${className} ${
        disabled ? "" : "hover:-translate-y-0.5"
      }`}
    >
      {disabled && (
        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

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
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
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
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
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
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
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
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <select
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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
}: {
  children: React.ReactNode;
  tone: "income" | "expense";
}) {
  const className =
    tone === "income"
      ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/25 shadow-lg shadow-emerald-600/20"
      : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-600/25 shadow-lg shadow-rose-600/20";

  return (
    <button
      className={`rounded-2xl px-5 py-4 text-lg font-black text-white transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${className}`}
    >
      {children}
    </button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CONDITION_OPTIONS,
  FUEL_OPTIONS,
  PASSENGER_OPTIONS,
  QUESTIONS,
  TRANSMISSION_OPTIONS,
  USAGE_OPTIONS,
} from "@/config/find-my-car";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { budgetBand } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";
import { encodeAnswers } from "@/lib/find-my-car/share-code";
import type { AnswerKey, FindMyCarAnswers, FindMyCarDraft } from "@/lib/find-my-car/types";
import { validateAnswers, validateField } from "@/lib/find-my-car/validation";
import { BudgetInput } from "./BudgetInput";
import { ChoiceGroup } from "./ChoiceGroup";
import { DistanceInput } from "./DistanceInput";
import { PriorityPicker } from "./PriorityPicker";

interface QuestionnaireProps {
  /** Pre-fills the form, e.g. when editing answers from a result page. */
  initialAnswers?: FindMyCarAnswers;
}

export function Questionnaire({ initialAnswers }: QuestionnaireProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<FindMyCarDraft>(() => initialAnswers ?? { priorities: [] });
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);
  const startTracked = useRef(false);

  const question = QUESTIONS[stepIndex];
  const isLast = stepIndex === QUESTIONS.length - 1;
  const headingId = `question-${question.id}`;
  const descriptionId = `${headingId}-description`;
  const errorId = `${headingId}-error`;

  useEffect(() => {
    if (startTracked.current) return;
    startTracked.current = true;
    track("find_my_car_started", {});
  }, []);

  // Move focus to the new question so keyboard and screen-reader users follow the step change.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex]);

  function update<K extends AnswerKey>(key: K, value: FindMyCarDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function goBack() {
    setError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    const fieldError = validateField(question.id, draft[question.id]);
    if (fieldError) {
      setError(fieldError);
      return;
    }
    if (isLast) submit();
    else setStepIndex((i) => i + 1);
  }

  function submit() {
    const result = validateAnswers(draft);
    if (!result.ok) {
      const firstInvalid = QUESTIONS.findIndex((q) => result.errors[q.id]);
      setStepIndex(firstInvalid);
      setError(result.errors[QUESTIONS[firstInvalid].id] ?? null);
      return;
    }

    const answers = result.value;
    track("find_my_car_completed", {
      budget_band: budgetBand(answers.budget),
      condition: answers.condition,
      usage: answers.usage,
      fuel: answers.fuel,
      transmission: answers.transmission,
      priorities: answers.priorities.join(",") || "none",
    });
    setSubmitting(true);
    router.push(`/find-my-car/result/${encodeAnswers(answers)}`);
  }

  const describedBy = [question.description && descriptionId, error && errorId].filter(Boolean).join(" ") || undefined;

  function renderInput() {
    const common = { name: question.id, labelledBy: headingId };
    switch (question.id) {
      case "budget":
        return (
          <BudgetInput
            labelledBy={headingId}
            describedBy={describedBy}
            invalid={Boolean(error)}
            value={draft.budget}
            onChange={(v) => update("budget", v)}
          />
        );
      case "condition":
        return <ChoiceGroup {...common} options={CONDITION_OPTIONS} value={draft.condition} onChange={(v) => update("condition", v)} />;
      case "usage":
        return <ChoiceGroup {...common} options={USAGE_OPTIONS} value={draft.usage} onChange={(v) => update("usage", v)} />;
      case "monthlyKm":
        return <DistanceInput {...common} describedBy={describedBy} value={draft.monthlyKm} onChange={(v) => update("monthlyKm", v)} />;
      case "fuel":
        return <ChoiceGroup {...common} columns={2} options={FUEL_OPTIONS} value={draft.fuel} onChange={(v) => update("fuel", v)} />;
      case "transmission":
        return <ChoiceGroup {...common} options={TRANSMISSION_OPTIONS} value={draft.transmission} onChange={(v) => update("transmission", v)} />;
      case "passengers":
        return <ChoiceGroup {...common} options={PASSENGER_OPTIONS} value={draft.passengers} onChange={(v) => update("passengers", v)} />;
      case "priorities":
        return <PriorityPicker {...common} value={draft.priorities ?? []} onChange={(v) => update("priorities", v)} />;
    }
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        goNext();
      }}
      className="flex flex-col gap-8"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-500 tabular-nums">
          Question {stepIndex + 1} of {QUESTIONS.length}
        </p>
        <div
          role="progressbar"
          aria-label="Questionnaire progress"
          aria-valuemin={1}
          aria-valuemax={QUESTIONS.length}
          aria-valuenow={stepIndex + 1}
          className="h-1.5 overflow-hidden rounded-full bg-slate-200"
        >
          <div
            className="h-full rounded-full bg-primary-600 transition-[width] duration-300"
            style={{ width: `${((stepIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2
            id={headingId}
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight text-ink-900 outline-none sm:text-3xl"
          >
            {question.title}
          </h2>
          {question.description && (
            <p id={descriptionId} className="text-slate-600">
              {question.description}
            </p>
          )}
        </div>

        {/* key resets local input state (e.g. custom distance) when the step changes */}
        <div key={question.id}>{renderInput()}</div>

        {error && (
          <p id={errorId} role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>

      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        {stepIndex > 0 && (
          <Button variant="secondary" size="lg" onClick={goBack} aria-label="Previous question">
            <ArrowLeftIcon className="size-5" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        )}
        <Button type="submit" size="lg" className="flex-1 sm:flex-none" disabled={submitting}>
          {isLast ? (submitting ? "Loading…" : "See my matches") : "Next"}
          {!isLast && <ArrowRightIcon className="size-5" />}
        </Button>
      </div>
    </form>
  );
}

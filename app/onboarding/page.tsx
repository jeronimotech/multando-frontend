"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, Coins, Trophy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import { useTranslation } from "@/hooks/use-translation";

const STORAGE_KEY = "hasSeenOnboarding";

const stepIcons = [Camera, Coins, Trophy] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    {
      icon: stepIcons[0],
      title: t('onboarding.step1_title'),
      description: t('onboarding.step1_desc'),
    },
    {
      icon: stepIcons[1],
      title: t('onboarding.step2_title'),
      description: t('onboarding.step2_desc'),
    },
    {
      icon: stepIcons[2],
      title: t('onboarding.step3_title'),
      description: t('onboarding.step3_desc'),
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (seen === "true") {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const completeOnboarding = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    router.push("/dashboard");
  }, [router]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  }, [currentStep, completeOnboarding, steps.length]);

  const handleSkip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-surface-0 px-6 py-12 dark:bg-surface-900">
      {/* Skip link */}
      <div className="flex w-full max-w-md justify-end">
        {!isLastStep && (
          <button
            onClick={handleSkip}
            className="text-sm font-medium text-surface-500 transition-colors hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
          >
            {t('onboarding.skip')}
          </button>
        )}
      </div>

      {/* Step content */}
      <div className="flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          {shouldReduceMotion ? (
            <div key={currentStep}>
              <OnboardingStep
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <OnboardingStep
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        {/* Dot indicators */}
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to step ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-brand-500"
                  : "w-2.5 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600"
              }`}
            />
          ))}
        </div>

        {/* Next / Get Started button */}
        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-md transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900"
        >
          {isLastStep ? t('onboarding.get_started') : t('onboarding.next')}
        </button>
      </div>
    </div>
  );
}

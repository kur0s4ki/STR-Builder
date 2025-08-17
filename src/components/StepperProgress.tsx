import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepperProgressProps {
  steps: Step[];
  currentStep: number;
}

export function StepperProgress({ steps, currentStep }: StepperProgressProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="relative">
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-3 transition-all duration-300 ease-in-out
                    ${isCompleted
                      ? 'bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] border-[#2F80ED] text-white shadow-lg scale-110'
                      : isCurrent
                      ? 'bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] border-[#2F80ED] text-white shadow-xl scale-125 animate-pulse'
                      : 'bg-white/80 border-white/60 text-gray-400 backdrop-blur-sm'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6 animate-bounce" />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                </div>

                {/* Glow effect for current step */}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] opacity-30 animate-ping"></div>
                )}
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="relative mx-6">
                  <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`
                        h-full transition-all duration-500 ease-in-out rounded-full
                        ${isCompleted
                          ? 'w-full bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] shadow-md'
                          : isCurrent
                          ? 'w-1/2 bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] animate-pulse'
                          : 'w-0 bg-white/40'
                        }
                      `}
                    />
                  </div>

                  {/* Animated progress for current step */}
                  {isCurrent && (
                    <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] rounded-full opacity-50 animate-pulse"></div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
import React from "react";

export default function Stepper({
  totalSteps,
  icons,
  currentStep,
  className,
}: {
  totalSteps: string[];
  icons: React.ReactNode[];
  currentStep: string;
  className?: string;
}) {
  const steps = totalSteps.indexOf(currentStep) + 1;
  const totalStepsLength = totalSteps.length;
  if (steps === 0) {
    return null;
  }

  return (
    <div className={`items-center w-full ${className}`}>
      <div className="flex items-center justify-center mb-1">
        {Array.from({ length: totalStepsLength }, (_, index) => (
          <React.Fragment key={index}>
            <div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors delay-300 duration-500 ease-in-out
                ${
                  index + 1 <= steps
                    ? "bg-custom-green/80 text-white"
                    : "bg-custom-gray-300 text-black"
                }`}
              >
                {icons[index]}
              </div>
            </div>
            {index < totalStepsLength - 1 && (
              <div className="relative w-14">
                <div className="absolute top-1/2 w-full h-0.5 bg-custom-gray-300 -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 h-0.5 bg-custom-green/80 -translate-y-1/2 origin-left transition-all duration-300 ease-out"
                  style={{
                    width: index + 1 < steps ? "100%" : "0%",
                  }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-12 text-center">
        {Array.from({ length: totalStepsLength }, (_, index) => (
          <p
            key={index}
            className={`transition-colors w-10 text-xs delay-300 duration-500 ease-in-out
            ${
              index + 1 <= steps ? "text-custom-green " : "text-custom-gray-300"
            }`}
          >
            {totalSteps[index]}
          </p>
        ))}
      </div>
    </div>
  );
}

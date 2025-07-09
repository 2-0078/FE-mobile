'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AIPricePredictionProps {
  aiEstimatedPrice: number;
  description: string;
}

export default function AIPricePrediction({
  aiEstimatedPrice,
  description,
}: AIPricePredictionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [dots, setDots] = useState('');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const analysisSteps = [
    '데이터 수집 중',
    '시장 분석 중',
    'AI 모델 분석 중',
    '예측 결과 생성 중',
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            setIsAnalyzing(true);

            // 분석 단계 애니메이션
            const stepTimer = setInterval(() => {
              setAnalysisStep((prev) => {
                if (prev >= analysisSteps.length - 1) {
                  clearInterval(stepTimer);
                  return prev;
                }
                return prev + 1;
              });
            }, 500);

            // 점 애니메이션
            const dotsTimer = setInterval(() => {
              setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
            }, 300);

            // AI 분석 완료 후 결과 표시
            const analyzeTimer = setTimeout(() => {
              setIsAnalyzing(false);
              setShowResult(true);
            }, 2500);

            // 가격 카운트업 애니메이션
            setTimeout(() => {
              const targetPrice = aiEstimatedPrice;
              const duration = 1500;
              const steps = 80;
              const increment = targetPrice / steps;
              let currentPrice = 0;

              const countUp = setInterval(() => {
                currentPrice += increment;
                if (currentPrice >= targetPrice) {
                  setDisplayPrice(targetPrice);
                  clearInterval(countUp);
                } else {
                  setDisplayPrice(Math.floor(currentPrice));
                }
              }, duration / steps);
            }, 500);

            return () => {
              clearTimeout(analyzeTimer);
              clearInterval(dotsTimer);
              clearInterval(stepTimer);
            };
          }
        });
      },
      {
        threshold: 0.3, // 30% 보일 때 시작
        rootMargin: '0px 0px -50px 0px', // 하단에서 50px 전에 시작
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [aiEstimatedPrice, analysisSteps.length, hasStarted]);

  return (
    <>
      <div
        ref={containerRef}
        className="text-center items-center gap-y-4 bg-gradient-to-b from-custom-black/20 to-transparent rounded-sm p-6 mb-6 border-1 border-custom-green/50"
      >
        <div className="w-32 h-32 bg-custom-black/20 rounded-full mx-auto mb-4 flex items-center justify-center relative">
          {isAnalyzing ? (
            <>
              {/* 회전하는 AI 아이콘 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-custom-green/30 border-t-custom-green rounded-full animate-spin"></div>
              </div>
              {/* 추가 회전 링 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-custom-green/20 border-t-custom-green/60 rounded-full animate-spin"></div>
              </div>
              <span className="text-custom-green text-3xl relative z-10 animate-pulse">
                🤖
              </span>
            </>
          ) : hasStarted ? (
            <span className="text-custom-green text-4xl animate-bounce">
              🤖
            </span>
          ) : (
            <span className="text-custom-green text-4xl">🤖</span>
          )}
        </div>

        {isAnalyzing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-custom-green text-lg font-bold">
                {analysisSteps[analysisStep]}
                {dots}
              </p>
              <div className="flex justify-center space-x-1">
                {analysisSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index <= analysisStep
                        ? 'bg-custom-green'
                        : 'bg-custom-green/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-white text-sm font-medium">
              AI가 데이터를 분석하고 있습니다
            </p>
          </div>
        ) : hasStarted ? (
          <div className="space-y-2">
            <p className="text-custom-green text-4xl font-bold animate-pulse">
              {displayPrice.toLocaleString()}원
            </p>
            <p className="text-white text-base font-medium">AI예측가</p>
            {showResult && (
              <div className="mt-2 p-2 bg-custom-green/10 rounded-lg">
                <p className="text-custom-green text-xs font-medium">
                  ✓ AI 분석 완료
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-custom-green text-4xl font-bold">
              {aiEstimatedPrice.toLocaleString()}원
            </p>
            <p className="text-white text-base font-medium">AI예측가</p>
          </div>
        )}
      </div>

      <div className="rounded-sm p-4 w-full bg-custom-green/10 text-white/50">
        <p className="text-xs font-medium">
          해당 상품은{' '}
          <span className="font-bold">
            약 {aiEstimatedPrice.toLocaleString()}원
          </span>
          의 가치가 있는 상품입니다.
          <br />
          {description}
        </p>
      </div>
    </>
  );
}

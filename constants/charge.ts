export const CHARGE_CONSTANTS = {
  MIN_AMOUNT: 10000,
  MAX_AMOUNT: 1000000,
  QUICK_AMOUNTS: [10000, 50000, 100000, 200000, 500000],
  INFO_ITEMS: [
    '최소 충전 금액: 10,000원',
    '최대 충전 금액: 1,000,000원',
    '충전된 금액은 즉시 반영됩니다',
    '환불은 출금하기를 통해 가능합니다',
  ],
} as const;

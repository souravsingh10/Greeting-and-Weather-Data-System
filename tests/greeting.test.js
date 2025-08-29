const { greetingForHour } = require('../src/utils/timezone');

describe('greetingForHour', () => {
  test('morning 5-11', () => {
    for (let h = 5; h < 12; h++) expect(greetingForHour(h)).toBe('Good morning');
  });
  test('afternoon 12-16', () => {
    for (let h = 12; h < 17; h++) expect(greetingForHour(h)).toBe('Good afternoon');
  });
  test('evening other hours', () => {
    for (let h = 0; h < 24; h++) {
      if (h >= 5 && h < 17) continue;
      expect(greetingForHour(h)).toBe('Good evening');
    }
  });
});
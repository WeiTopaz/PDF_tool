const assert = require('assert');

/**
 * 模擬 PDF_tool.html 中的核心邏輯
 */

function baseName(name) {
  const i = name.lastIndexOf('.');
  return i > 0 ? name.slice(0, i) : name;
}

function parseRanges(input, total) {
  if (!input || !input.trim()) {
    return Array.from({ length: total }, (_, i) => i);
  }
  const set = new Set();
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  for (const p of parts) {
    if (/^-?\d+$/.test(p)) {
      const n = Math.max(1, Math.min(total, parseInt(p, 10)));
      set.add(n - 1);
    } else {
      const m = p.match(/^(\d+)\s*[-–]\s*(\d+)$/);
      if (m) {
        let s = parseInt(m[1], 10), e = parseInt(m[2], 10);
        if (s > e) [s, e] = [e, s];
        s = Math.max(1, s); e = Math.min(total, e);
        for (let i = s; i <= e; i++) set.add(i - 1);
      }
    }
  }
  return Array.from(set).sort((a, b) => a - b);
}

// ---------- 測試案例 ----------

console.log('--- 正在執行邏輯單元測試 ---');

// 測試 baseName
try {
  assert.strictEqual(baseName('test.pdf'), 'test');
  assert.strictEqual(baseName('my.archive.tar.gz'), 'my.archive.tar');
  assert.strictEqual(baseName('noextension'), 'noextension');
  console.log('✅ baseName 測試通過');
} catch (e) {
  console.error('❌ baseName 測試失敗:', e.message);
}

// 測試 parseRanges
try {
  // 正常範圍
  assert.deepStrictEqual(parseRanges('1-3, 5', 10), [0, 1, 2, 4]);
  // 逆向範圍
  assert.deepStrictEqual(parseRanges('5-3', 10), [2, 3, 4]);
  // 超出範圍
  assert.deepStrictEqual(parseRanges('1, 15', 10), [0, 9]);
  // 空輸入
  assert.deepStrictEqual(parseRanges('', 5), [0, 1, 2, 3, 4]);
  // 重複輸入
  assert.deepStrictEqual(parseRanges('1, 1, 2-3, 3', 5), [0, 1, 2]);
  console.log('✅ parseRanges 測試通過');
} catch (e) {
  console.error('❌ parseRanges 測試失敗:', e.message);
}

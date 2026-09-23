import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floorFigure, compact } from '../src/lib/format.ts';

test('floorFigure rounds down to a defensible "over N" figure', () => {
  assert.equal(floorFigure(571_992), 570_000);
  assert.equal(floorFigure(54_116), 54_000);
  assert.equal(floorFigure(1_680), 1_600);
  assert.equal(floorFigure(56), 50);
});

test('compact shortens counts for card metadata', () => {
  assert.equal(compact(954), '954');
  assert.equal(compact(1_680), '1.7k');
  assert.equal(compact(2_000), '2k');
  assert.equal(compact(54_116), '54k');
  assert.equal(compact(194_099), '194k');
});

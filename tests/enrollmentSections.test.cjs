const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');

const source = path.join(
  __dirname,
  '../src/utils/constants/form/groupEnrollmentFields.ts',
);

const compiled = new Module(source);

compiled._compile(
  ts.transpileModule(fs.readFileSync(source, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  source,
);

const { groupEnrollmentFields } = compiled.exports;

const fallback = {
  name: 'Profile',
  description: 'Details',
};

const fields = [
  { id: 'a', required: true },
  { id: 'b' },
  { id: 'static' },
];

test('uses fallback when there are no DHIS2 sections', () => {
  const groups = groupEnrollmentFields(fields, [], fallback);

  assert.equal(groups.length, 1);
  assert.equal(groups[0].name, 'Profile');
  assert.equal(groups[0].description, 'Details');
  assert.deepEqual(groups[0].fields, fields);
});

test('uses DHIS2 sections when available', () => {
  const sections = [
    {
      id: 'section-2',
      displayName: 'Second',
      sortOrder: 2,
      dataElements: [{ id: 'a' }],
    },
    {
      id: 'section-1',
      displayName: 'First',
      sortOrder: 1,
      dataElements: [{ id: 'b' }],
    },
  ];

  const groups = groupEnrollmentFields(fields, sections, fallback);

  assert.deepEqual(
    groups.map(group => group.id),
    ['section-1', 'section-2'],
  );

  assert.deepEqual(
    groups.map(group => group.fields.map(field => field.id)),
    [
      ['static', 'b'],
      ['a'],
    ],
  );

  assert.equal(groups[0].name, 'First');
});

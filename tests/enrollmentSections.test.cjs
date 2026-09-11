const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const source = path.join(__dirname, '../src/utils/constants/form/groupEnrollmentFields.ts');
const compiled = new Module(source);
compiled._compile(ts.transpileModule(fs.readFileSync(source, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, source);
const { groupEnrollmentFields } = compiled.exports;
const fallback = { name: 'Profile', description: 'Details' };
const fields = [{ id: 'a', required: true }, { id: 'b' }, { id: 'static' }];

test('without sections all fields are rendered', () => {
  for (const sections of [undefined, []]) assert.deepEqual(groupEnrollmentFields(fields, sections, fallback)[0].fields, fields);
});
test('stage sections determine section and field order while preserving ungrouped fields', () => {
  const sections = [{ id: 'second', sortOrder: 2, dataElements: [{ id: 'a' }] }, { id: 'first', sortOrder: 1, dataElements: [{ id: 'b' }] }];
  const groups = groupEnrollmentFields(fields, sections, fallback);
  assert.deepEqual(groups.map(g => g.fields.map(f => f.id)), [['static'], ['b'], ['a']]);
  assert.equal(groups[0].name, 'Profile');
  assert.equal(groups[2].fields[0].required, true);
  assert.equal(sections[0].id, 'second');
});
test('attribute sections use tracked entity attributes and ignore missing or duplicated references', () => {
  const groups = groupEnrollmentFields(fields, [{ id: 's', trackedEntityAttributes: [{ id: 'a' }, { id: 'missing' }, { id: 'a' }] }], fallback);
  assert.deepEqual(groups.map(g => g.fields.map(f => f.id)), [['b', 'static'], ['a']]);
});

test('attribute sections accept nested DHIS2 trackedEntityAttribute references', () => {
  const groups = groupEnrollmentFields(fields, [{ id: 's', trackedEntityAttributes: [
    { trackedEntityAttribute: { id: 'a' } },
  ] }], fallback);
  assert.deepEqual(groups.map(g => g.fields.map(f => f.id)), [['b', 'static'], ['a']]);
});

test('unassigned fields can be appended after configured sections', () => {
  const groups = groupEnrollmentFields(fields, [{ id: 's', dataElements: [{ id: 'a' }] }], fallback, false);
  assert.deepEqual(groups.map(g => g.fields.map(f => f.id)), [['a'], ['b', 'static']]);
});

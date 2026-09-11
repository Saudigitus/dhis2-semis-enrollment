interface Section {
  id: string;
  displayName?: string;
  description?: string;
  sortOrder?: number;
  dataElements?: { id: string }[];
  trackedEntityAttributes?: { id: string }[];
}

/** Apply DHIS2 section order without changing the flat fields used for saving. */
export function groupEnrollmentFields(fields: any[], sections: Section[] | undefined, fallback: { name: string; description: string }, unassignedFirst = true) {
  if (!sections?.length) return [{ ...fallback, visible: fields.length > 0, fields }];
  const byId = new Map(fields.map(field => [field.id, field]));
  const used = new Set<string>();
  const groups = [...sections].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map(section => {
    const references = [...(section.dataElements ?? []), ...(section.trackedEntityAttributes ?? [])]
      .map(reference => ({
        id: reference.id ?? reference.dataElement?.id ?? reference.trackedEntityAttribute?.id,
      }))
      .filter(reference => reference.id);
    const sectionFields = references.flatMap(({ id }) => {
      if (!byId.has(id) || used.has(id)) return [];
      used.add(id);
      return [byId.get(id)];
    });
    return { id: section.id, name: section.displayName ?? '', description: section.description ?? '',
      visible: sectionFields.length > 0, fields: sectionFields };
  });
  // Preserve static fields and fields omitted from metadata sections.
  const remaining = fields.filter(field => !used.has(field.id));
  const unassigned = remaining.length ? [{ ...fallback, visible: true, fields: remaining }] : [];
  return unassignedFirst ? [...unassigned, ...groups] : [...groups, ...unassigned];
}

export function groupEnrollmentFields(
  fields: any[],
  sections: any[] | undefined,
  fallback: {
    name: string;
    description: string;
  },
) {

  if (!sections?.length) {
    return [
      {
        id: `static-${fallback.name}`,
        name: fallback.name,
        description: fallback.description,
        visible: fields.length > 0,
        fields,
      },
    ];
  }

  const byId = new Map(fields.map(field => [field.id, field]));
  const used = new Set<string>();

  const groups = [...sections]
    .sort(
      (a, b) =>
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    )
    .map(section => {
      const references = [
        ...(section.dataElements ?? []),
        ...(section.trackedEntityAttributes ?? []),
      ];

      const sectionFields = references.flatMap(({ id }) => {
        if (!id || !byId.has(id) || used.has(id)) {
          return [];
        }

        used.add(id);

        return [byId.get(id)];
      });

      return {
        id: section.id,
        name: section.displayName ?? '',
        description: section.description ?? '',
        visible: sectionFields.length > 0,
        fields: sectionFields,
      };
    });

  const remainingFields = fields.filter(
    field => !used.has(field.id),
  );

  if (!remainingFields.length) {
    return groups;
  }

  groups[0] = {
    ...groups[0],
    fields: [
      ...remainingFields,
      ...groups[0].fields,
    ],
    visible: true,
  };

  return groups;
}
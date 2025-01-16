import { reducer } from "../common/formatDistinctValue";

interface trackerPostBodyInterface {
    programId: string,
    orgUnitId: string,
    enrollmentDate: string
    trackedEntityId?: string,
    trackedEntityType: string,
    formVariablesFields: any[],
    programStagesToSave: (string | undefined)[],
}

export const trackerPostBody = ({ formVariablesFields, programId, orgUnitId, enrollmentDate, programStagesToSave, trackedEntityType, trackedEntityId }: trackerPostBodyInterface) => {
    const form: { attributes: any[], events: any[] } = {
        attributes: [],
        events: []
    }

    for (const enrollmentData of formVariablesFields) {
        if (enrollmentData?.[0]?.type === "attribute") {
            enrollmentData.forEach((attribute: { id: string, assignedValue: string | boolean }) => {
                if (attribute.assignedValue !== undefined && attribute.assignedValue !== false) {
                    form.attributes.push({ attribute: attribute.id, value: attribute.assignedValue })
                }
            });
        } else if (enrollmentData?.[0]?.type === "dataElement") {
            for (const [key, value] of Object.entries(reducer(enrollmentData))) {
                form.events.push({
                    notes: [],
                    orgUnitId,
                    status: "ACTIVE",
                    program: programId,
                    programStage: key,
                    dataValues: value,
                    occurredAt: enrollmentDate,
                    scheduledAt: enrollmentDate,
                })
            }
        }
    }

    programStagesToSave.forEach(programStageToSave => {
        form.events.push({
            orgUnitId,
            notes: [],
            status: "ACTIVE",
            program: programId,
            occurredAt: enrollmentDate,
            scheduledAt: enrollmentDate,
            programStage: programStageToSave,
        })
    })

    return {
        trackedEntities: [
            {
                enrollments: [
                    {
                        orgUnitId,
                        program: programId,
                        status: "COMPLETED",
                        events: form.events,
                        attributes: form.attributes,
                        occurredAt: enrollmentDate,
                        enrolledAt: enrollmentDate,
                    }
                ],
                orgUnitId,
                trackedEntityType,
                ...(trackedEntityId ? { trackedEntity: trackedEntityId } : {})
            }
        ]
    }
}
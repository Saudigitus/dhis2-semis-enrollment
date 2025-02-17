import { format } from "date-fns";
import { reducer } from "../common/formatDistinctValue";

interface enrollmentUpdateBodyInterface {
    programId: string,
    orgUnitId: string,
    enrollmentDate: string,
    trackedEntityId: string,
    trackedEntityType: string,
    formValues: Record<string, any>,
    enrollmentId: string,
    events: any[],
    formVariablesFields: any[],
}

export const enrollmentUpdateBody = ({ formVariablesFields, enrollmentId, enrollmentDate, trackedEntityId, trackedEntityType, orgUnitId, programId, formValues, events }: enrollmentUpdateBodyInterface): any => {
    const form: { attributes: any[], events: any[] } = {
        attributes: [],
        events: []
    }

    for (const data of formVariablesFields) {
        if (data[0].type === "attribute") {
            data.forEach((attribute: { id: string }) => {
                const value = formValues[attribute.id];
                if (value !== null && value !== undefined) {
                    form.attributes.push({ attribute: attribute.id, value });
                }
            })
        }
        else if (data[0].type === "dataElement") {
            for (const [key, value] of Object.entries(reducer(data, formValues))) {
                const event = events?.find((event: any) => event.programStage === key)
                if (event && Object.keys(event).length > 4)
                    form.events.push({
                        ...event,
                        occurredAt: enrollmentDate,
                        scheduledAt: enrollmentDate,
                        createdAt: enrollmentDate,
                        dataValues: returnEventDataValues(value as Record<string, any>[])
                    })
                else
                    form.events.push({
                        notes: [],
                        orgUnit: orgUnitId,
                        status: "COMPLETED",
                        programStage: key,
                        program: programId,
                        enrollment: event?.enrollment,
                        trackedEntity: trackedEntityId,
                        dataValues: returnEventDataValues(value as Record<string, any>[]),
                        occurredAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                        scheduledAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                        createdAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                    })
            }
        }

    }

    return {
        trackedEntities: [
            {
                enrollments: [
                    {
                        orgUnit: orgUnitId,
                        program: programId,
                        status: "COMPLETED",
                        enrollment: enrollmentId,
                        attributes: form.attributes,
                        createdAt: enrollmentDate,
                        occurredAt: enrollmentDate,
                        enrolledAt: enrollmentDate,
                        events: form.events
                    }
                ],
                orgUnit: orgUnitId,
                trackedEntity: trackedEntityId,
                trackedEntityType,
            }
        ]
    }
}


const returnEventDataValues = (dataValues: Record<string, any>[]) => {
    return dataValues.map(({ dataElement, value }) => ({
        dataElement,
        ...(value !== null && value !== undefined ? { value } : {})
    }));
};
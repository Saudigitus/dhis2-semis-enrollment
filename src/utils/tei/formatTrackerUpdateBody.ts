import { format } from "date-fns";
import { reducer } from "../common/formatDistinctValue";

interface trackerUpdateBodyInterface {
    enrollmentData: any[],
    orgUnitId: string,
    trackedEntityType: string,
    trackedEntity: string,
    formValues: any,
    enrollmentDate: string,
    programId: string,
    enrollmentId: string,
    events: any[]
}

export const trackerUpdateBody = ({ enrollmentData, enrollmentId, enrollmentDate, trackedEntity, trackedEntityType, orgUnitId, programId, formValues, events }: trackerUpdateBodyInterface): any => {
    const form: { attributes: any[], events: any[] } = {
        attributes: [],
        events: []
    }

    for (const data of enrollmentData) {
        if (data.length && data[0].type === "attribute") {
            data.forEach((attribute: any) => {
                if (attribute.assignedValue !== undefined && attribute.assignedValue !== false && formValues.hasOwnProperty(attribute.id))
                    form.attributes.push({ attribute: attribute.id, value: attribute.assignedValue })
                else
                    form.attributes.push({ attribute: attribute.id, value: undefined })
            });
        }
        if (enrollmentData.length && enrollmentData[0].type === "dataElement") {
            for (const [key, value] of Object.entries(reducer(enrollmentData))) {
                const event = events?.find((event: any) => event.programStage === key)
                if (event && Object.keys(event).length > 4)
                    form.events.push({
                        ...event,
                        occurredAt: enrollmentDate,
                        scheduledAt: enrollmentDate,
                        createdAt: enrollmentDate,
                        dataValues: returnEventDataValues(enrollmentData, formValues)
                    })
                else
                    form.events.push({
                        notes: [],
                        orgUnit: orgUnitId,
                        status: "COMPLETED",
                        programStage: key,
                        program: programId,
                        trackedEntity: trackedEntity,
                        enrollment: event?.enrollment,
                        occurredAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                        scheduledAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                        createdAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                        dataValues: returnEventDataValues(enrollmentData, formValues)
                    })
            }
        }

        return {
            trackedEntities: [
                {
                    enrollments: [
                        {
                            orgUnitId,
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
                    orgUnitId,
                    trackedEntity,
                    trackedEntityType,
                }
            ]
        }
    }
}

const returnEventDataValues = (enrollmentData: any[], formValues: any) => {
    return enrollmentData?.map((dataValue: any) => {
        if (dataValue.assignedValue !== undefined && dataValue.assignedValue !== false && formValues.hasOwnProperty(dataValue.id))
            return { dataElement: dataValue.id, value: dataValue.assignedValue }

        else
            return { dataElement: dataValue.id, value: undefined }
    })
}
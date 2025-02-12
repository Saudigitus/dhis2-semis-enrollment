import { useState } from 'react';
import { format } from 'date-fns';
import { useDataStoreKey } from 'dhis2-semis-components';
import { useGetSectionTypeLabel, useUrlParams, useGetEvents, useGetTei, attributes, dataValues } from 'dhis2-semis-functions';

function useGetEnrollmentUpdateInitialValues() {
    const { getTei } = useGetTei()
    const { getEvents } = useGetEvents()
    const { urlParameters } = useUrlParams()
    const { sectionName } = useGetSectionTypeLabel();
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [initialValues, setInitialValues] = useState<any>({})
    const [enrollmentEvents, setEnrollmentEvents] = useState<any>({})
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const { academicYear, grade, class: section, schoolName, school } = urlParameters()
    const { registration, 'socio-economics': socioEconomics, program: programId, } = useDataStoreKey({ sectionType: sectionName })

    const getInitialValues = (trackedEntity: string, enrollment: string) => {
        setLoading(true)

        if (Object.keys(dataStoreData)?.length) {
            getTei(programId, [trackedEntity])
                .then(async (trackedEntityInstance: any) => {
                    let socioEconomicData: any = {}

                    const registrationData: any = await getEvents({ program: programId, programStage: registration.programStage as string, trackedEntity, fields: "*", orgUnit: school as string })

                    if (socioEconomics) {
                        socioEconomicData = await getEvents({ program: programId, programStage: socioEconomics?.programStage as string, trackedEntity, fields: "*", orgUnit: school as string })
                    }

                    setInitialValues({
                        program: programId,
                        enrollment: enrollment,
                        trackedEntity: trackedEntity,
                        ...attributes(trackedEntityInstance?.results?.instances[0]?.attributes ?? []),
                        orgUnit: registrationData?.find((x: any) => x.enrollment === enrollment)?.orgUnit,
                        enrollmentDate: registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt,
                        ...dataValues(registrationData?.find((x: any) => x.enrollment === enrollment)?.dataValues ?? []),
                        ...dataValues(socioEconomicData?.find((x: any) => x.enrollment === enrollment)?.dataValues ?? []),
                        enrollment_date: registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt ? format(new Date(registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt), "yyyy-MM-dd") : undefined,
                    })

                    setEnrollmentEvents({
                        events: [
                            registrationData?.find((x: any) => x.enrollment === enrollment) ?? { enrollment: enrollment, programStage: registrationData },
                            socioEconomicData?.find((x: any) => x.enrollment === enrollment) ?? { enrollment: enrollment, programStage: socioEconomics },
                        ]
                    })

                })
                .catch(() => {
                    setError(true)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }

    return { enrollmentEvents, getInitialValues, initialValues, loading, error }
}

export default useGetEnrollmentUpdateInitialValues
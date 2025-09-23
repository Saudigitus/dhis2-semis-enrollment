import { useState } from 'react';
import { format } from 'date-fns';
import useGetSelectedKeys from '../config/useGetSelectedKeys';
import { useUrlParams, useGetEvents, useGetTeis, attributes, dataValues } from 'dhis2-semis-functions';

function useGetEnrollmentUpdateInitialValues() {
    const { getTeis } = useGetTeis()
    const { getEvents } = useGetEvents()
    const { urlParameters } = useUrlParams()
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [initialValues, setInitialValues] = useState<any>({})
    const [enrollmentEvents, setEnrollmentEvents] = useState<any>({})
    const { dataStoreData } = useGetSelectedKeys()
    const { school } = urlParameters
    const { registration, 'socio-economics': socioEconomics, program: programId, } = dataStoreData

    const getInitialValues = (trackedEntity: string, enrollment: string) => {
        setLoading(true)

        if (Object.keys(dataStoreData)?.length) {
            getTeis({ program: programId, trackedEntity: [trackedEntity] })
                .then(async (responseTracker: any) => {
                    const trackedEntityInstance = responseTracker?.[0]

                    const registrationData: any = await getEvents({ program: programId, programStage: registration.programStage as string, trackedEntity, fields: "*", orgUnit: school as string })

                    let socioEconomicData
                    if (socioEconomics)
                        socioEconomicData = await getEvents({ program: programId, programStage: socioEconomics?.programStage as string, trackedEntity, fields: "*", orgUnit: school as string })

                    setInitialValues({
                        program: programId,
                        enrollment: enrollment,
                        trackedEntity: trackedEntity,
                        ...attributes(trackedEntityInstance?.attributes ?? []),
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
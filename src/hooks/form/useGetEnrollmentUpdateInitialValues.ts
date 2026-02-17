import { useState } from 'react';
import { format } from 'date-fns';
import useGetSelectedKeys from '../config/useGetSelectedKeys';
import { attributes, dataValues, useGetEnrollment } from 'dhis2-semis-functions';

function useGetEnrollmentUpdateInitialValues() {
    const { getEnrollment } = useGetEnrollment()
    const { dataStoreData } = useGetSelectedKeys()
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [initialValues, setInitialValues] = useState<any>({})
    const [enrollmentEvents, setEnrollmentEvents] = useState<any>({})
    const { registration, 'socio-economics': socioEconomics, program: programId, } = dataStoreData

    const getInitialValues = async (trackedEntity: string, enrollment: string) => {
        setLoading(true)

        if (Object.keys(dataStoreData)?.length) {
            await getEnrollment(enrollment)
                .then((response: any) => {
                    const registrationData: any = response?.results?.events?.filter((event: any) => event.programStage === dataStoreData?.registration?.programStage)
                    const socioEconomicData: any = response?.results?.events?.filter((event: any) => event.programStage === dataStoreData?.['socio-economics']?.programStage)

                    setInitialValues({
                        program: programId,
                        enrollment: enrollment,
                        trackedEntity: trackedEntity,
                        ...attributes(response?.results?.attributes ?? []),
                        orgUnit: registrationData?.find((x: any) => x.enrollment === enrollment)?.orgUnit,
                        enrollmentDate: registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt,
                        ...dataValues(registrationData?.find((x: any) => x.enrollment === enrollment)?.dataValues ?? []),
                        ...dataValues(socioEconomicData?.find((x: any) => x.enrollment === enrollment)?.dataValues ?? []),
                        enrollment_date: registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt ? format(new Date(registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt), "yyyy-MM-dd") : undefined,
                    })

                    setEnrollmentEvents({
                        events: [
                            registrationData?.find((x: any) => x.enrollment === enrollment) ?? { enrollment: enrollment, programStage: registration },
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
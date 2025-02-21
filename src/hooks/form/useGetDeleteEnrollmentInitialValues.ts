import { useState } from 'react';
import { format } from 'date-fns';
import { useDataStoreKey, useProgramsKeys } from 'dhis2-semis-components';
import { useGetSectionTypeLabel, attributes, dataValues, useGetEnrollment } from 'dhis2-semis-functions';

function useGetDeleteEnrollmentInitialValues() {
    const programsValues = useProgramsKeys();
    const { programStages } = programsValues[0];
    const { getEnrollment } = useGetEnrollment()
    const { sectionName } = useGetSectionTypeLabel();
    const [loading, setLoading] = useState<boolean>(false)
    const [initialValues, setInitialValues] = useState<any>({})
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const { registration, 'socio-economics': socioEconomics, program: programId, } = useDataStoreKey({ sectionType: sectionName })

    const getInitialValues = async (trackedEntity: string, enrollment: string) => {
        setLoading(true)

        if (Object.keys(dataStoreData)?.length) {
            let socioEconomicData: any = {}

            await getEnrollment(enrollment)
                .then((resp: any) => {
                    const enrollmentEvents = programStages?.filter((programStage: { id: string }) => programStage.id !== socioEconomics?.programStage && programStage.id !== registration?.programStage)?.map((value: any) => {

                        const event = resp?.results?.events?.filter((event: { programStage: string, dataValues: any[] }) => event.programStage === value.id && event.dataValues.length)

                        return {
                            name: value.displayName,
                            value: event?.length,
                            repeatable: value.repeatable,
                            class: event?.length ? 'hasValuesColor' : 'noValuesColor',
                            label: value.repeatable ? event?.length ? `${value.displayName + "s"}` : `No ${value.displayName.toLowerCase() + "s"}` : event?.length ? "Value assigned" : 'No value assigned'
                        }
                    })

                    const registrationData: any = resp?.results?.events?.filter((event: any) => event.programStage === dataStoreData?.registration?.programStage)

                    if (socioEconomics)
                        socioEconomicData = resp?.results?.events?.filter((event: any) => event.programStage === dataStoreData?.['socio-economics']?.programStage)

                    setInitialValues({
                        events: enrollmentEvents,
                        program: programId,
                        enrollment: enrollment,
                        trackedEntity: trackedEntity,
                        ...attributes(resp?.results?.attributes ?? []),
                        orgUnit: registrationData?.find((x: any) => x.enrollment === enrollment)?.orgUnit,
                        enrollmentDate: registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt,
                        ...dataValues(registrationData?.find((x: any) => x.enrollment === enrollment)?.dataValues ?? []),
                        ...dataValues(socioEconomicData?.find((x: any) => x.enrollment === enrollment)?.dataValues ?? []),
                        enrollment_date: registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt ? format(new Date(registrationData?.find((x: any) => x.enrollment === enrollment)?.occurredAt), "yyyy-MM-dd") : undefined,
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }

    return { getInitialValues, initialValues, loading }
}

export default useGetDeleteEnrollmentInitialValues
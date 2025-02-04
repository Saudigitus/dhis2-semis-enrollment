import { format } from 'date-fns'
import ModalContent from './ModalContent';
import React, { useState, useEffect } from 'react'
import { formFields } from '../../utils/constants/form/enrollmentForm';
import { trackerPostBody } from '../../utils/tei/formatTrackerPostBody';
import useGetSectionTypeLabel from '../../hooks/common/useGetSectionTypeLabel';
import { ModalComponent, useDataStoreKey, useProgramsKeys, useGetUsedProgramStages } from 'dhis2-semis-components';
import { modules, useBuildForm, useGetAttributes, useGetPatternCode, useSaveTei } from 'dhis2-semis-functions';
import { useUrlParams } from 'dhis2-semis-functions';

interface ModalManagerInterface {
    open: boolean,
    saveMode: "CREATE" | "UPDATE"
    setOpen: (arg: boolean) => void
    initialValues?: Record<string, any>
}

function ModalManager(props: ModalManagerInterface) {
    const { open, setOpen, saveMode } = props;
    const { saveTei } = useSaveTei()
    const { urlParameters } = useUrlParams();
    const { school, schoolName } = urlParameters()
    const programsValues = useProgramsKeys();
    const dataStoreData = useDataStoreKey({ sectionType: "student" });
    const programData = programsValues[0]
    const { sectionName } = useGetSectionTypeLabel();
    const { returnPattern, loadingCodes, generatedVariables } = useGetPatternCode()
    const { formData } = useBuildForm({ dataStoreData, programData, module: modules.enrollment })
    // const [values, setValues] = useState<Record<string, string>>({})
    // const [fieldsWitValue, setFieldsWitValues] = useState<any[]>([formData])
    const { attributes = [] } = useGetAttributes({ programData })
    const [initialValues] = useState<object>({
        registerschoolstaticform: schoolName,
        enrollment_date: format(new Date(), "yyyy-MM-dd"),
    })
    const programStagesToSave = useGetUsedProgramStages({ sectionType: "student" })

    useEffect(() => {
        if (saveMode == "CREATE")
            void returnPattern(attributes)
    }, [])

    const handleCloseModal = () => setOpen(false)

    function onChange(e: any): void {
        console.log(e)
        // const sections = formData;
        // for (let i = 0; i < sections?.length; i++) {
        //     const section = sections[i]

        //     for (let j = 0; j < section?.length; j++) {
        //         if (section[j].valueType === "TRUE_ONLY" && !section[j].assignedValue)
        //             section[j].assignedValue = ''

        //         if (section[j].valueType === "BOOLEAN")
        //             section[j].value = e[section[j].id]

        //         section[j].assignedValue = e[section[j].id]
        //     }
        // }

        // setFieldsWitValues(sections)
        // setValues(removeFalseKeys(e))
    }


    function onSubmit(e: Record<string, any>): void {
        const data = () => {
            if (0 == 0) {
                return
            }
        }

        saveMode == "CREATE" ?
            trackerPostBody({
                orgUnitId: school!,
                programStagesToSave,
                programId: programData?.id!,
                formVariablesFields: formData,
                enrollmentDate: e?.enrollment_date,
                trackedEntityType: programData?.trackedEntityType?.id!,
            }) : {}

        saveTei({
            data,
            handleComplete: handleCloseModal,
            messages: {
                error: `Could not ${saveMode.toLowerCase()} enrollment.`,
                sucess: `Enrollment ${saveMode.toLowerCase()}d sucessfully.`
            },
        })
    }

    return (
        <ModalComponent
            open={open}
            loading={loadingCodes}
            handleClose={handleCloseModal}
            title={`${sectionName} enrollment`}
        >
            <ModalContent
                onChange={onChange}
                onSubmit={onSubmit}
                initialValues={{ ...initialValues, ...generatedVariables }}
                formFields={formFields({ formFieldsData: formData, sectionName })}
            />
        </ModalComponent>
    )
}

export default ModalManager
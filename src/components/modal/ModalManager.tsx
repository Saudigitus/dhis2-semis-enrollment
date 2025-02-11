import ModalContent from "./ModalContent";
import React, { useState, useEffect } from "react";
import { trackerPostBody, trackerUpdateBody } from "../../utils/tei";
import { formFields } from "../../utils/constants/form/enrollmentForm";
import useGetSectionTypeLabel from "../../hooks/common/useGetSectionTypeLabel";
import { ModalComponent, useDataStoreKey, useProgramsKeys, useGetUsedProgramStages, } from "dhis2-semis-components";
import { modules, useBuildForm, useGetAttributes, useGetPatternCode, useSaveTei, useUrlParams, removeFalseKeys } from "dhis2-semis-functions";

interface ModalManagerInterface {
    open: boolean;
    saveMode: "CREATE" | "UPDATE";
    setOpen: (arg: boolean) => void;
    initialValues?: Record<string, any>;
}

function ModalManager(props: ModalManagerInterface) {
    const { open, setOpen, saveMode, initialValues } = props;
    const { saveTei, loading } = useSaveTei();
    const { urlParameters } = useUrlParams();
    const { school } = urlParameters();
    const programsValues = useProgramsKeys();
    const programData = programsValues[0];
    const { sectionName } = useGetSectionTypeLabel();
    const { attributes = [] } = useGetAttributes({ programData });
    const dataStoreData = useDataStoreKey({ sectionType: "student" });
    const programStagesToSave = useGetUsedProgramStages({ sectionType: "student" });
    const { returnPattern, loadingCodes, generatedVariables } = useGetPatternCode();
    const { formData } = useBuildForm({ dataStoreData, programData, module: modules.enrollment });

    useEffect(() => {
        if (saveMode == "CREATE") void returnPattern(attributes);
    }, []);

    const handleCloseModal = () => setOpen(false);

    function onChange(e: any): void {
       console.log(e);
    }

    function onSubmit(e: Record<string, any>): void {
        const data = () => {
            if (saveMode == "CREATE")
                return trackerPostBody({
                    orgUnitId: school!,
                    programStagesToSave,
                    programId: programData?.id!,
                    formVariablesFields: formData,
                    values: e,
                    enrollmentDate: e?.enrollment_date,
                    trackedEntityType: programData?.trackedEntityType?.id!,
                });

            if (saveMode == "UPDATE") {
                return trackerUpdateBody({
                    formVariablesFields: formData,
                    enrollmentId: e?.enrollment_id,
                    enrollmentDate: e?.enrollment_date,
                    trackedEntityId: e?.tracked_entity_id,
                    trackedEntityType: programData?.trackedEntityType?.id!,
                    orgUnitId: school!,
                    programId: programData?.id!,
                    formValues: e,
                    events: programStagesToSave,
                });
            }
        };

        saveTei({
            data: data(),
            handleComplete: handleCloseModal,
            messages: {
                error: `Could not ${saveMode.toLowerCase()} enrollment.`,
                sucess: `Enrollment ${saveMode.toLowerCase()}d sucessfully.`,
            },
        });
    }

    return (
        <ModalComponent
            open={open}
            loading={loadingCodes}
            handleClose={handleCloseModal}
            title={`${sectionName} enrollment`}
        >
            <ModalContent
                loading={loading!}
                onChange={onChange}
                onSubmit={onSubmit}
                initialValues={{ ...initialValues, ...generatedVariables }}
                formFields={formFields({ formFieldsData: formData, sectionName })}
            />
        </ModalComponent>
    );
}

export default ModalManager;

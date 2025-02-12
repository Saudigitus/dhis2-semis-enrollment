import { format } from "date-fns";
import ModalContent from "./ModalContent";
import React, { useEffect, useState } from "react";
import { trackerPostBody, trackerUpdateBody } from "../../utils/tei";
import { formFields } from "../../utils/constants/form/enrollmentForm";
import useGetSectionTypeLabel from "../../hooks/common/useGetSectionTypeLabel";
import useGetEnrollmentUpdateInitialValues from "../../hooks/form/useGetEnrollmentUpdateInitialValues";
import { ModalComponent, useDataStoreKey, useProgramsKeys, useGetUsedProgramStages, } from "dhis2-semis-components";
import { modules, useBuildForm, useGetAttributes, useGetPatternCode, useSaveTei, useUrlParams, removeFalseKeys } from "dhis2-semis-functions";

interface ModalManagerInterface {
    open: boolean;
    saveMode: "CREATE" | "UPDATE";
    setOpen: (arg: boolean) => void;
}

function ModalManager(props: ModalManagerInterface) {
    const { open, setOpen, saveMode } = props;
    const programsValues = useProgramsKeys();
    const programData = programsValues[0];
    const { urlParameters, useQuery } = useUrlParams();
    const { school, schoolName } = urlParameters();
    const { saveTei, loading: saving } = useSaveTei();
    const { sectionName } = useGetSectionTypeLabel();
    const enrollment = useQuery().get("enrollment") as string
    const { attributes = [] } = useGetAttributes({ programData });
    const trackedEntity = useQuery().get("trackedEntity") as string
    const dataStoreData = useDataStoreKey({ sectionType: "student" });
    const programStagesToSave = useGetUsedProgramStages({ sectionType: "student" });
    const { returnPattern, loadingCodes, generatedVariables } = useGetPatternCode();
    const { formData } = useBuildForm({ dataStoreData, programData, module: modules.enrollment });
    const { getInitialValues, initialValues: updateInitialValues, loading: initialValuesLoading, enrollmentEvents } = useGetEnrollmentUpdateInitialValues()

    const [initialValues] = useState<object>({
        registerschoolstaticform: schoolName,
        enrollment_date: format(new Date(), "yyyy-MM-dd"),
    });

    useEffect(() => {
        if (saveMode == "CREATE") void returnPattern(attributes);

        if (saveMode == "UPDATE") void getInitialValues(trackedEntity, enrollment);
    }, [open]);

    const handleCloseModal = () => setOpen(false);

    function onChange(e: any): void { }

    function onSubmit(e: Record<string, any>): void {
        const data = () => {
            if (saveMode === "CREATE") {
                return trackerPostBody({
                    values: e,
                    orgUnitId: school!,
                    programStagesToSave,
                    programId: programData?.id!,
                    formVariablesFields: formData,
                    enrollmentDate: e?.enrollment_date,
                    trackedEntityType: programData?.trackedEntityType?.id!,
                });
            }

            if (saveMode === "UPDATE") {
                return trackerUpdateBody({
                    formVariablesFields: formData,
                    enrollmentId: e?.enrollment,
                    enrollmentDate: e?.enrollment_date,
                    trackedEntityId: e?.trackedEntity,
                    trackedEntityType: programData?.trackedEntityType?.id!,
                    orgUnitId: school!,
                    programId: programData?.id!,
                    formValues: e,
                    events: enrollmentEvents?.events,
                });
            }
        };

        saveTei({
            data: data(), handleComplete: handleCloseModal,
            messages: {
                error: `Could not ${saveMode.toLowerCase()} enrollment.`,
                sucess: `Enrollment ${saveMode.toLowerCase()}d sucessfully.`,
            },
        });
    }

    return (
        <ModalComponent
            open={open}
            handleClose={handleCloseModal}
            title={`${sectionName} enrollment`}
            loading={loadingCodes || initialValuesLoading}
        >
            <ModalContent
                loading={saving!}
                onChange={onChange}
                onSubmit={onSubmit}
                onCancel={handleCloseModal}
                formFields={formFields({ formFieldsData: formData, sectionName })}
                initialValues={{ ...initialValues, ...generatedVariables, ...updateInitialValues }}
            />
        </ModalComponent>
    );
}

export default ModalManager;
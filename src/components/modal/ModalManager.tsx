import { format } from "date-fns";
import { useRecoilState } from "recoil";
import ModalContent from "./ModalContent";
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import { ModalManagerInterface } from "src/types/modal/ModalProps";
import { enrollmentPostBody, enrollmentUpdateBody } from "../../utils/enrollment";
import { formFields } from "../../utils/constants/form/enrollmentForm";
import useGetEnrollmentUpdateInitialValues from "../../hooks/form/useGetEnrollmentUpdateInitialValues";
import { ModalComponent, useDataStoreKey, useProgramsKeys, useGetUsedProgramStages, } from "dhis2-semis-components";
import { useBuildForm, useGetAttributes, useGetPatternCode, useSaveTei, useUrlParams, useGetSectionTypeLabel } from "dhis2-semis-functions";

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
    const [refetch, setRefetch] = useRecoilState(TableDataRefetch);
    const trackedEntity = useQuery().get("trackedEntity") as string
    const dataStoreData = useDataStoreKey({ sectionType: "student" });
    const programStagesToSave = useGetUsedProgramStages({ sectionType: "student" });
    const { returnPattern, loadingCodes, generatedVariables } = useGetPatternCode();
    const { formData } = useBuildForm({ dataStoreData, programData, module: Modules.Enrollment });
    const [initialValues] = useState<object>({ registerschoolstaticform: schoolName, enrollment_date: format(new Date(), "yyyy-MM-dd") });
    const { getInitialValues, initialValues: updateInitialValues, loading: initialValuesLoading, enrollmentEvents } = useGetEnrollmentUpdateInitialValues()

    useEffect(() => {
        if (saveMode == "CREATE") void returnPattern(attributes);

        if (saveMode == "UPDATE") void getInitialValues(trackedEntity, enrollment);
    }, [open]);

    const handleCloseModal = () => setOpen(false);

    function onChange(e: any): void { }

    function onSubmit(e: Record<string, any>): void {
        const data = () => {
            if (saveMode === "CREATE") {
                return enrollmentPostBody({
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
                return enrollmentUpdateBody({
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
            data: data(),
            messages: {
                error: `Could not ${saveMode.toLowerCase()} enrollment.`,
                sucess: `Enrollment ${saveMode.toLowerCase()}d sucessfully.`,
            },
            handleComplete: () => { handleCloseModal(); setRefetch(!refetch) },
        });
    }

    return (
        <ModalComponent
            open={open}
            handleClose={handleCloseModal}
            loading={loadingCodes || initialValuesLoading}
            title={`Single ${sectionName} Enrollment ${saveMode == "UPDATE" ? "Update" : ""}`}
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
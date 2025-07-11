import { format } from "date-fns";
import { useRecoilState } from "recoil";
import ModalContent from "./ModalContent";
import React, { useEffect, useState } from "react";
import { Modules, TableDataRefetch } from "dhis2-semis-types"
import { ModalManagerInterface } from "../../../types/modal/ModalProps";
import useGetSelectedKeys from "../../../hooks/config/useGetSelectedKeys";
import { ModalComponent, useGetUsedProgramStages, } from "dhis2-semis-components";
import { enrollmentPostBody, enrollmentUpdateBody } from "../../../utils/enrollment";
import useGetEnrollmentUpdateInitialValues from "../../../hooks/form/useGetEnrollmentUpdateInitialValues";
import {
    useGetAttributes, useGetPatternCode, useSaveTei, useUrlParams,
    useGetSectionTypeLabel, RulesEngine, capitalizeString, useBuildForm
} from "dhis2-semis-functions";


function ModalManager(props: ModalManagerInterface) {
    const { urlParameters, useQuery } = useUrlParams();
    const { school, schoolName } = urlParameters();
    const { saveTei, loading: saving } = useSaveTei();
    const { sectionName } = useGetSectionTypeLabel();
    const enrollment = useQuery.get("enrollment") as string
    const [refetch, setRefetch] = useRecoilState(TableDataRefetch);
    const trackedEntity = useQuery.get("trackedEntity") as string
    const { program: programData, dataStoreData } = useGetSelectedKeys()
    const { attributes = [] } = useGetAttributes({ programData: programData! });
    const programStagesToSave = useGetUsedProgramStages({ sectionType: sectionName });
    const { returnPattern, loadingCodes, generatedVariables } = useGetPatternCode();
    const { formData: formVariablesFields } = useBuildForm({ dataStoreData, programData, module: Modules.Enrollment });
    const { open, setOpen, saveMode, initialValues: initialValuesFromSearch, formFields = [] } = props;
    const [initialValues] = useState<object>({ registerschoolstaticform: schoolName, enrollment_date: format(new Date(), "yyyy-MM-dd"), ...initialValuesFromSearch });
    const { getInitialValues, initialValues: updateInitialValues, loading: initialValuesLoading, enrollmentEvents } = useGetEnrollmentUpdateInitialValues()
    const allInitialValues = { ...initialValues, ...generatedVariables, ...updateInitialValues }
    const [values, setValues] = useState<{ [key: string]: any }>({ orgUnit: school, ...allInitialValues });

    const { runRulesEngine, updatedVariables } = RulesEngine({
        values: values,
        variables: formFields,
        program: programData!.id,
        type: "programStageSection",
    })

    useEffect(() => {
        runRulesEngine()
    }, [values])

    useEffect(() => {
        setValues(prev => ({
            ...prev,
            ...allInitialValues,
        }));
    }, [updateInitialValues, generatedVariables])

    useEffect(() => {
        if (open && saveMode == "CREATE")
            void returnPattern(attributes);

        if (open && saveMode == "UPDATE")
            void getInitialValues(trackedEntity, enrollment);
    }, [open]);

    const handleCloseModal = () => setOpen(false);

    const handleChange = (e: { field: any; value: string; name: string }) => {
        const { name, value } = e;
        setValues(prev => ({
            ...allInitialValues,
            ...prev,
            [name]: value,
        }));
    };

    function onSubmit(e: Record<string, any>): void {
        const data = () => {
            if (saveMode === "CREATE") {
                return enrollmentPostBody({
                    values: e,
                    orgUnitId: school!,
                    programStagesToSave,
                    programId: programData?.id!,
                    formVariablesFields: formVariablesFields,
                    enrollmentDate: e?.enrollment_date,
                    trackedEntityType: programData?.trackedEntityType?.id!,
                    trackedEntityId: initialValuesFromSearch!["trackedEntity"]
                });
            }

            if (saveMode === "UPDATE") {
                return enrollmentUpdateBody({
                    formVariablesFields: formVariablesFields,
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
            title={`Single ${capitalizeString(sectionName)} Enrollment ${saveMode == "UPDATE" ? "Update" : ""}`}
        >
            <ModalContent
                loading={saving!}
                onSubmit={onSubmit}
                onChange={handleChange}
                onCancel={handleCloseModal}
                formFields={updatedVariables}
                initialValues={allInitialValues}
            />
        </ModalComponent>
    );
}

export default ModalManager;
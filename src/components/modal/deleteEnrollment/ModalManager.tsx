import { ModalComponent, useDataStoreKey, useProgramsKeys } from 'dhis2-semis-components'
import { useBuildForm, useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';
import React, { useEffect, useState } from 'react'
import { ModalManagerInterface } from '../../../types/modal/ModalProps'
import ModalContent from './ModalContent';
import { Modules, TableDataRefetch } from 'dhis2-semis-types';
import { format } from "date-fns";
import useGetDeleteEnrollmentInitialValues from '../../../hooks/form/useGetDeleteEnrollmentInitialValues';
import { enrollmentDeletionFormField } from '../../../utils/constants/form/enrollmentDeletionForm';
import { useDeleteEnrollment } from '../../../hooks/enrollment/useDeleteEnrollment';
import { useRecoilState } from 'recoil';

const ModalManagerEnrollmentDelete = (props: ModalManagerInterface) => {
    const [loadingDelete, setLoadingDelete] = useState(false)
    const { urlParameters, useQuery } = useUrlParams();
    const { deleteEnrollment } = useDeleteEnrollment()
    const sectionTypeParam = useQuery().get("sectionType");
    const sectionType: "student" | "staff" =
        sectionTypeParam === "student" || sectionTypeParam === "staff"
            ? sectionTypeParam
            : "student"; // Fallback para 'student' se for null ou inválido
    const { sectionName } = useGetSectionTypeLabel();
    const [refetch, setRefetch] = useRecoilState(TableDataRefetch);
    const programsValues = useProgramsKeys();
    const programData = programsValues[0];
    const { open, setOpen } = props;
    const dataStoreData = useDataStoreKey({ sectionType: sectionType });
    const { schoolName } = urlParameters();
    const { formData } = useBuildForm({ dataStoreData, programData, module: Modules.Enrollment });
    const [initialValues] = useState<object>({ registerschoolstaticform: schoolName, enrollment_date: format(new Date(), "yyyy-MM-dd") });
    const { getInitialValues, initialValues: updateInitialValues, loading: initialValuesLoading } = useGetDeleteEnrollmentInitialValues()
    const enrollment = useQuery().get("enrollment") as string
    const trackedEntity = useQuery().get("trackedEntity") as string


    useEffect(() => {
        void getInitialValues(trackedEntity, enrollment);
    }, [open]);

    const handleCloseModal = () => setOpen(false);

    const onDeleteEnrollment = async () => {
        setLoadingDelete(true)
        await deleteEnrollment(enrollment)
            .then(() => {
                setLoadingDelete(false)
                setRefetch(!refetch)
                setOpen(false)
            })
            .catch((error) => {
                setLoadingDelete(false)
                setRefetch(!refetch)
                setOpen(false)
            })
    }

    return (
        <ModalComponent
            open={open}
            handleClose={handleCloseModal}
            loading={initialValuesLoading}
            title="Enrollment deletion"
        >
            <ModalContent
                loading={loadingDelete}
                onChange={() => { }}
                onSubmit={onDeleteEnrollment}
                onCancel={handleCloseModal}
                formFields={enrollmentDeletionFormField({ formFieldsData: formData, sectionName })}
                initialValues={{ ...initialValues, ...updateInitialValues }}
            />
        </ModalComponent>
    )
}

export default ModalManagerEnrollmentDelete
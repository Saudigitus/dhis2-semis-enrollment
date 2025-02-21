import { ModalComponent, useDataStoreKey, useProgramsKeys } from 'dhis2-semis-components'
import { useBuildForm, useDeleteEnrollment, useGetSectionTypeLabel, useUrlParams, useGetTotalEnrollments, useDeleteTEI } from 'dhis2-semis-functions';
import React, { useEffect, useState } from 'react'
import { ModalManagerInterface } from '../../../types/modal/ModalProps'
import ModalContent from './ModalContent';
import { Modules, TableDataRefetch } from 'dhis2-semis-types';
import { format } from "date-fns";
import useGetDeleteEnrollmentInitialValues from '../../../hooks/form/useGetDeleteEnrollmentInitialValues';
import { enrollmentDeletionFormField } from '../../../utils/constants/form/enrollmentDeletionForm';
import { useRecoilState } from 'recoil';

const ModalManagerEnrollmentDelete = (props: ModalManagerInterface) => {
    const [loadingDelete, setLoadingDelete] = useState(false)
    const { urlParameters, useQuery } = useUrlParams();
    const { deleteEnrollment } = useDeleteEnrollment();
    const { getTotalEnrollment } = useGetTotalEnrollments()
    const sectionTypeParam = useQuery().get("sectionType");
    const sectionType: "student" | "staff" =
        sectionTypeParam === "student" || sectionTypeParam === "staff"
            ? sectionTypeParam
            : "student"; // Fallback para 'student' se for null ou inválido
    const { sectionName } = useGetSectionTypeLabel();
    const [refetch, setRefetch] = useRecoilState(TableDataRefetch);
    const programsValues = useProgramsKeys();
    const programData = programsValues[0];
    const { deleteTEI } = useDeleteTEI()
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
        await getTotalEnrollment(trackedEntity)
            .then(async (totalEnrollment) => {
                const enrollments: any[] = totalEnrollment?.results?.enrollments;

                const deleteAction = enrollments.length > 1 ? deleteEnrollment(enrollment) : deleteTEI(trackedEntity);
                await deleteAction
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
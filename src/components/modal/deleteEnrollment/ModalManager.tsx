import { format } from "date-fns";
import { useRecoilState } from 'recoil';
import ModalContent from './ModalContent';
import React, { useEffect, useState } from 'react'
import { ModalComponent } from 'dhis2-semis-components'
import { Modules, TableDataRefetch } from 'dhis2-semis-types';
import { ModalManagerInterface } from '../../../types/modal/ModalProps'
import useGetSelectedKeys from '../../../hooks/config/useGetSelectedKeys';
import { enrollmentDeletionFormField } from '../../../utils/constants/form/enrollmentDeletionForm';
import useGetDeleteEnrollmentInitialValues from '../../../hooks/form/useGetDeleteEnrollmentInitialValues';
import { useBuildForm, useDeleteEnrollment, useGetSectionTypeLabel, useUrlParams, useGetTotalEnrollments, useDeleteTEI } from 'dhis2-semis-functions';

const ModalManagerEnrollmentDelete = (props: ModalManagerInterface) => {
    const [loadingDelete, setLoadingDelete] = useState(false)
    const { urlParameters, useQuery } = useUrlParams();
    const { deleteEnrollment } = useDeleteEnrollment();
    const { getTotalEnrollment } = useGetTotalEnrollments()
    const { sectionName } = useGetSectionTypeLabel();
    const [refetch, setRefetch] = useRecoilState(TableDataRefetch);
    const { dataStoreData, program: programData } = useGetSelectedKeys()
    const { deleteTEI } = useDeleteTEI()
    const { open, setOpen, i18n } = props;
    const { schoolName } = urlParameters;
    const { formData } = useBuildForm({ dataStoreData, programData, module: Modules.Enrollment });
    const [initialValues] = useState<object>({ registerschoolstaticform: schoolName, enrollment_date: format(new Date(), "yyyy-MM-dd") });
    const { getInitialValues, initialValues: updateInitialValues, loading: initialValuesLoading } = useGetDeleteEnrollmentInitialValues()
    const enrollment = useQuery.get("enrollment") as string
    const trackedEntity = useQuery.get("trackedEntity") as string


    useEffect(() => {
        void getInitialValues(trackedEntity, enrollment);
    }, [open]);

    const handleCloseModal = () => setOpen(false);

    const onDeleteEnrollment = async () => {
        setLoadingDelete(true)
        await getTotalEnrollment(trackedEntity)
            .then(async (totalEnrollment: any) => {
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
            title={i18n.t("Enrollment Deletion")}
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
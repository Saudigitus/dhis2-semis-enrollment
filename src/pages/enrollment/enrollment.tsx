import { useRecoilState } from 'recoil';
import React, { useEffect, useState } from "react";
import { IconDelete24, IconEdit24 } from "@dhis2/ui";
import { Table, InfoPage, useSchoolCalendar } from "dhis2-semis-components";
import ModalManager from "../../components/modal/saveEnrollment/ModalManager";
import { TableDataRefetch, Modules, ProgramConfig } from "dhis2-semis-types"
import useGetSelectedProgram from '../../hooks/config/useGetSelectedKeys';
import ModalManagerEnrollmentDelete from '../../components/modal/deleteEnrollment/ModalManager';
import { useBuildForm, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { formFields } from '../../utils/constants/form/enrollmentForm';

export default function EnrollmentsPage() {
    const { viewPortWidth } = useViewPortWidth()
    const { urlParameters, add, remove } = useUrlParams()
    const { program, dataStoreData } = useGetSelectedProgram()
    const { academicYear: academicYearId } = useSchoolCalendar()
    const { academicYear, grade, class: section, school, schoolName, sectionType } = urlParameters()
    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const { getData, tableData, loading } = useTableData({ module: Modules.Enrollment });
    const [filterState, setFilterState] = useState<{ dataElements: any, attributes: any }>({ attributes: [], dataElements: [] });
    const [refetch,] = useRecoilState(TableDataRefetch);
    const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 50, totalPages: 0, totalElements: 0 })
    const { columns } = useHeader({ dataStoreData, programConfigData: program as unknown as ProgramConfig, programStage: "" });
    const { formData } = useBuildForm({ dataStoreData, programData: program, module: Modules.Enrollment });
    const enrollmentFormFields = formFields({ formFieldsData: formData, sectionName: sectionType! })

    const handleOpenModal = (e: Record<string, any>, type: "edit" | "delete",) => {
        add("trackedEntity", e?.row?.trackedEntity);
        add("enrollment", e?.row?.enrollmentId);

        if (type === "delete") {
            setOpenDeleteModal(true)
        } else {
            setOpenEditModal(true)
        }
    };

    useEffect(() => {
        setPagination((prev: any) => ({ ...prev, totalPages: tableData?.pagination?.totalPages, totalElements: tableData?.pagination?.totalElements }))
    }, [tableData])

    useEffect(() => {
        if (!openDeleteModal && !openEditModal) {
            remove("trackedEntity")
            remove("enrollment")
        }
    }, [openDeleteModal, openEditModal])

    const rowsActions = [
        { icon: <IconEdit24 />, color: '#277314', label: `Edition`, disabled: false, disableOnInactive: true, loading: false, onClick: (e: any) => handleOpenModal(e, "edit") },
        { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, disableOnInactive: false, loading: false, onClick: (e: any) => { handleOpenModal(e, "delete") } },
    ];

    useEffect(() => {
        void getData({
            page: pagination?.page,
            pageSize: pagination?.pageSize,
            program: program!.id as string,
            orgUnit: school!,
            baseProgramStage: dataStoreData?.registration?.programStage as string,
            attributeFilters: filterState.attributes,
            dataElementFilters: [
                academicYear !== null ? `${academicYearId}:in:${academicYear}` : null,
                grade !== null ? `${dataStoreData.registration.grade}:in:${grade}` : null,
                section !== null ? `${dataStoreData.registration.section}:in:${section}` : null,
            ].filter((filter): filter is string => filter !== null),
            order: dataStoreData.defaults.defaultOrder
        })
    }, [sectionType, filterState, pagination.page, pagination?.pageSize, refetch, grade, section, school, academicYear])

    return (
        <div style={{ height: "85vh" }}>
            {
                !(Boolean(schoolName) && Boolean(school)) ?
                    <InfoPage
                        title="SEMIS-Enrollment"
                        sections={[
                            {
                                sectionTitle: "Follow the instructions to proceed:",
                                instructions: [
                                    "Select the Organization unit you want to view data",
                                    "Use global filters(Class, Grade and Academic Year)"
                                ]
                            }
                        ]}
                    />
                    :
                    <>
                        <Table
                            tableData={tableData.data}
                            programConfig={program!}
                            pagination={pagination}
                            setPagination={setPagination}
                            paginate={!loading}
                            title="Enrollments"
                            viewPortWidth={viewPortWidth}
                            columns={columns}
                            rowAction={rowsActions}
                            defaultFilterNumber={3}
                            showRowActions
                            filterState={filterState}
                            loading={loading}
                            rightElements={<EnrollmentActionsButtons />}
                            setFilterState={setFilterState}
                        />
                        {openEditModal && <ModalManager formFields={enrollmentFormFields} open={openEditModal} setOpen={setOpenEditModal} saveMode="UPDATE" />}
                        {openDeleteModal && <ModalManagerEnrollmentDelete open={openDeleteModal} setOpen={setOpenDeleteModal} saveMode="UPDATE" />}
                    </>
            }
        </div>
    )
}
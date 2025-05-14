import { useRecoilState } from 'recoil';
import { ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import { IconDelete24, IconEdit24 } from "@dhis2/ui";
import { InfoPage, useDataStoreKey } from 'dhis2-semis-components'
import ModalManager from "../../components/modal/ModalManager";
import { Table, useProgramsKeys } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useGetSectionTypeLabel, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";
import ModalManagerEnrollmentDelete from '../../components/modal/deleteEnrollment/ModalManager';

export default function EnrollmentsPage() {
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const programsValues = useProgramsKeys();
    const programData = programsValues[0]
    const { viewPortWidth } = useViewPortWidth()
    const { urlParameters, add, remove } = useUrlParams()
    const { academicYear, grade, class: section, school, schoolName } = urlParameters()
    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const { getData, tableData, loading } = useTableData({ module: Modules.Enrollment });
    const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], programStage: dataStoreData?.registration?.programStage as string });
    const [filterState, setFilterState] = useState<{ dataElements: any, attributes: any }>({ attributes: [], dataElements: [] });
    const [refetch,] = useRecoilState(TableDataRefetch);
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 0 })

    console.log(programData.programTrackedEntityAttributes)
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
        setPagination((prev) => ({ ...prev, totalPages: tableData?.pagination?.totalPages }))
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
            program: programData.id as string,
            orgUnit: school!,
            baseProgramStage: dataStoreData?.registration?.programStage as string,
            attributeFilters: filterState.attributes,
            dataElementFilters: [
                academicYear !== null ? `${dataStoreData.registration.academicYear}:in:${academicYear}` : null,
                grade !== null ? `${dataStoreData.registration.grade}:in:${grade}` : null,
                section !== null ? `${dataStoreData.registration.section}:in:${section}` : null,
            ].filter((filter): filter is string => filter !== null),
        })
    }, [filterState, pagination.page, pagination?.pageSize, refetch, grade, section, school])

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
                            programConfig={programData}
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
                            rightElements={<EnrollmentActionsButtons filetrState={filterState} selectedDataStoreKey={dataStoreData} programData={programData as unknown as ProgramConfig} />}
                            setFilterState={setFilterState}
                        />
                        {openEditModal && <ModalManager open={openEditModal} setOpen={setOpenEditModal} saveMode="UPDATE" />}
                        {openDeleteModal && <ModalManagerEnrollmentDelete open={openDeleteModal} setOpen={setOpenDeleteModal} saveMode="UPDATE" />}
                    </>
            }
        </div>
    )
}
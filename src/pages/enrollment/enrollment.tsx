import { useRecoilState } from 'recoil';
import { ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules  } from "dhis2-semis-types"
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
    const programData = programsValues[0];
    const { viewPortWidth } = useViewPortWidth();
    const { urlParameters, add, remove } = useUrlParams();
    const { academicYear, grade, class: section, schoolName, school } = urlParameters();
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const { getData, tableData, loading } = useTableData({ module: Modules.Enrollment, selectedDataStore: dataStoreData });
    const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], module: Modules.Enrollment });
    const [filetrState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] });
    const [refetch,] = useRecoilState(TableDataRefetch);

    const handleOpenEditModal = (e: Record<string, any>) => {
        add("trackedEntity", e?.row?.trackedEntity);
        add("enrollment", e?.row?.enrollmentId);
        setOpenEditModal(true);
    };

    const handleOpenDeleteModal = (e: Record<string, any>) => {
        add("trackedEntity", e?.row?.trackedEntity)
        add("enrollment", e?.row?.enrollmentId)
        setOpenDeleteModal(true)
    }

    useEffect(() => {
        if (!openEditModal) {
            remove("trackedEntity");
            remove("enrollment");
        }
    }, [openEditModal]);

    useEffect(() => {
        if (!openDeleteModal) {
            remove("trackedEntity")
            remove("enrollment")
        }
    }, [openDeleteModal])

    const rowsActions = [
        { icon: <IconEdit24 />, color: '#277314', label: `Edition`, disabled: false, loading: false, onClick: (e: any) => handleOpenEditModal(e) },
        { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, loading: false, onClick: (e: any) => handleOpenDeleteModal(e) },
    ];

    useEffect(() => {
        void getData({ page: 1, pageSize: 10, program: programData.id as string, orgUnit: "Shc3qNhrPAz", baseProgramStage: dataStoreData?.registration?.programStage as string, attributeFilters: filetrState.attributes, dataElementFilters: [`${dataStoreData?.registration?.academicYear}:in:2023`] })
    }, [filetrState, refetch])

    useEffect(() => {
        const filters = [
            `${dataStoreData.registration.academicYear}:in:${academicYear}`,
            `${dataStoreData.registration.grade}:in:${grade}`,
            `${dataStoreData.registration.section}:in:${section}`,
        ]
        setFilterState({ dataElements: filters, attributes: [] })
    }, [academicYear, grade, section])


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
                            programConfig={programData}
                            title="Enrollments"
                            viewPortWidth={viewPortWidth}
                            columns={columns}
                            totalElements={4}
                            tableData={tableData}
                            rowAction={rowsActions}
                            defaultFilterNumber={3}
                            showRowActions
                            filterState={{ attributes: [], dataElements: [] }}
                            loading={loading}
                            rightElements={<EnrollmentActionsButtons filetrState={filetrState} selectedDataStoreKey={dataStoreData} programData={programData as unknown as ProgramConfig} />}
                            setFilterState={setFilterState}
                        />
                        {openEditModal && <ModalManager open={openEditModal} setOpen={setOpenEditModal} saveMode="UPDATE" />}
            {openDeleteModal && <ModalManagerEnrollmentDelete open={openDeleteModal} setOpen={setOpenDeleteModal} saveMode="UPDATE" />}
                    </>
            }
        </div>
    )
}
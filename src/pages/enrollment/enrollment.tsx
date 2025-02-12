import { ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { IconDelete24, IconEdit24 } from "@dhis2/ui";
import { useDataStoreKey } from 'dhis2-semis-components'
import ModalManager from "../../components/modal/ModalManager";
import { Table, useProgramsKeys, useHeaderKey, stateEmitter } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { modules, useGetSectionTypeLabel, useHeader, useTableData, useUrlParams } from "dhis2-semis-functions";

export default function EnrollmentsPage() {
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const programsValues = useProgramsKeys();
    const { headerValues } = useHeaderKey()
    const programData = programsValues[0]
    const { urlParameters, add, remove } = useUrlParams()
    const { academicYear, grade, class: section, schoolName } = urlParameters()
    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    const { getData, tableData, loading } = useTableData({ module: modules.enrollment })
    const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], module: modules.enrollment })
    const [filetrState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] })

    const handleOpenEditModal = (e: Record<string, any>) => {
        add("trackedEntity", e?.row?.trackedEntity)
        add("enrollment", e?.row?.enrollmentId)
        setOpenEditModal(true)
    }

    useEffect(() => {
        if (!openEditModal) {
            remove("trackedEntity")
            remove("enrollment")
        }
    }, [openEditModal])

    const rowsActions = [
        { icon: <IconEdit24 />, color: '#277314', label: `Edition`, disabled: false, loading: false, onClick: (e: any) => handleOpenEditModal(e) },
        { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, loading: false, onClick: (e: any) => { console.log(e) } },
    ];

    useEffect(() => {
        void getData({ page: 1, pageSize: 10, program: programData.id as string, orgUnit: "Shc3qNhrPAz", baseProgramStage: dataStoreData?.registration?.programStage as string, attributeFilters: filetrState.attributes, dataElementFilters: [`${dataStoreData?.registration?.academicYear}:in:2023`] })
    }, [filetrState])

    useEffect(() => {
        const filters = [
            `${dataStoreData.registration.academicYear}:in:${academicYear}`,
            `${dataStoreData.registration.grade}:in:${grade}`,
            `${dataStoreData.registration.section}:in:${section}`,
        ]
        setFilterState({ dataElements: filters, attributes: [] })
    }, [academicYear, grade, section])

    return (
        <div style={{ height: "85vh" }} >
            <Table
                programConfig={programData}
                title="Enrollments"
                viewPortWidth={1040}
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
        </div>
    )
}
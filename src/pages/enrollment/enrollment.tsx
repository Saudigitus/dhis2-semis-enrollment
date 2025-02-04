import { Table, useProgramsKeys, useDataStoreKey } from "dhis2-semis-components";
import React, { useEffect, useState } from "react";
import { IconDelete24, IconEdit24 } from "@dhis2/ui";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { modules, useGetSectionTypeLabel, useHeader, useTableData } from "dhis2-semis-functions";
import { ProgramConfig } from 'dhis2-semis-types'

export default function EnrollmentsPage() {
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const programsValues = useProgramsKeys();
    const programData = programsValues[0]
    const { getData, tableData, loading } = useTableData({ module: modules.enrollment })
    const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], module: modules.enrollment })
    const [filetrState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] })

    const rowsActions = [
        { icon: <IconEdit24 />, color: '#277314', label: `Edition`, disabled: true, loading: false, onClick: () => { alert("Edition") } },
        { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, loading: false, onClick: () => { alert("Delete") } },
    ];

    useEffect(() => {
        void getData({ page: 1, pageSize: 10, program: programData.id as string, orgUnit: "Shc3qNhrPAz", baseProgramStage: dataStoreData?.registration?.programStage as string, attributeFilters: filetrState.attributes, dataElementFilters: [`${dataStoreData?.registration?.academicYear}:in:2024`] })
    }, [filetrState])

    return (
        <div style={{ height: "80vh" }} >
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
                rightElements={<EnrollmentActionsButtons selectedDataStoreKey={dataStoreData} programData={programData as unknown as ProgramConfig} />}
                setFilterState={setFilterState}
            />
        </div>
    )
}
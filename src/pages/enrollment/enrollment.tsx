import { ProgramConfig, Table, useDataStoreKey, useProgramsKeys } from "dhis2-semis-components";
import React, { useEffect, useState } from "react";
import { RowActionsType } from "dhis2-semis-components/dist/declarations/types/table/TableRowActionsProps";
import { IconCheckmarkCircle24, IconDelete24, IconEdit24 } from "@dhis2/ui";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { modules, useHeader, useTableData, useUrlParams } from "dhis2-semis-functions";

export default function EnrollmentsPage() {
    const dataStoreData = useDataStoreKey({ sectionType: "student" });
    const { programsValues } = useProgramsKeys();
    const programData = programsValues[0]
    const [filetrState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] })
    const { getData, tableData, loading } = useTableData({ module: modules.enrollment })
    const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], module: modules.enrollment })

    const rowsActions: RowActionsType[] = [
        { icon: <IconEdit24 />, color: '#277314', label: `Edition`, disabled: true, loading: false, onClick: () => { alert("Edition") } },
        { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, loading: false, onClick: () => { alert("Delete") } },
        { icon: <IconCheckmarkCircle24 />, color: '#147cd7', disabled: false, loading: false, label: 'Complete', onClick: () => { alert("Complete") } }
    ];

    useEffect(() => {
        void getData({ page: 1, pageSize: 10, program: programData.id as string, orgUnit: "Shc3qNhrPAz", baseProgramStage: dataStoreData?.registration?.programStage as string, attributeFilters: filetrState.attributes, dataElementFilters: [`${dataStoreData?.registration?.academicYear}:in:2024`] })
    }, [filetrState])

    return (
        <div style={{ height: "80vh" }} >
            <Table
                programConfig={programData as unknown as any}
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
                rightElements={<EnrollmentActionsButtons />}
                setFilterState={setFilterState}
            />
        </div>
    )
}
import { ProgramConfig, Table, useDataStoreKey, useProgramsKeys } from "dhis2-semis-components";
import React, { useEffect } from "react";
import { headerColumns, rowsData } from "../../utils/constants/table/tableConstants";
import { RowActionsType } from "dhis2-semis-components/dist/declarations/types/table/TableRowActionsProps";
import { IconCheckmarkCircle24, IconDelete24, IconEdit24 } from "@dhis2/ui";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { modules, useHeader, useTableData, useUrlParams  } from "dhis2-semis-functions";

export default function EnrollmentsPage() {
    const { dataStoreValues } = useDataStoreKey();
    const { programsValues } = useProgramsKeys();
    const dataStoreData = dataStoreValues[0]
    const programData = programsValues[0]

    const { getData, tableData, loading } = useTableData({ module: modules.enrollment })
    const { columns } = useHeader({ dataStoreData, programConfigData: programData as ProgramConfig[0], tableColumns: [], module: modules.enrollment })
  
    const rowsActions: RowActionsType[] = [
        { icon: <IconEdit24 />, color: '#277314', label: `Edition`, disabled: true, loading: false, onClick: () => { alert("Edition") } },
        { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, loading: false, onClick: () => { alert("Delete") } },
        { icon: <IconCheckmarkCircle24 />, color: '#147cd7', disabled: false, loading: false, label: 'Complete', onClick: () => { alert("Complete") } }
    ];

    useEffect(() => { 
        void getData({ page: 1, pageSize: 10, program: programData.id as string, orgUnit: "Shc3qNhrPAz", baseProgramStage: dataStoreData?.registration?.programStage as string, attributeFilters: [], dataElementFilters: [`${dataStoreData?.registration?.academicYear}:in:2024`] })
    }, [])

    return (
        <div style={{ height: "80vh" }} >
            <Table
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
            />
        </div>
    )
}
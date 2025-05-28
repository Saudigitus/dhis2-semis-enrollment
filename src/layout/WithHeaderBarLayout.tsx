import { Outlet } from "react-router-dom"
import { useConfig } from "@dhis2/app-runtime"
import { HeaderBarLayout, SemisHeader } from "dhis2-semis-components"
import useGetSelectedKeys from "src/hooks/config/useGetSelectedKeys"

const WithHeaderBarLayout = () => {
    const { baseUrl } = useConfig()
    const { program, dataStoreData } = useGetSelectedKeys()

    return (
        <HeaderBarLayout
            header={
                <SemisHeader
                    baseUrl={baseUrl}
                    dataSoreValues={dataStoreData}
                    program={program}
                />
            }
        >
            <Outlet />
        </HeaderBarLayout>
    )
}

export default WithHeaderBarLayout
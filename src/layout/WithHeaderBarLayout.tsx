import { Outlet } from "react-router-dom"
import { useConfig } from "@dhis2/app-runtime"
import useGetSelectedKeys from "../hooks/config/useGetSelectedKeys"
import { HeaderBarLayout, SemisHeader } from "dhis2-semis-components"

const WithHeaderBarLayout = () => {
    const { baseUrl } = useConfig()
    const { program, dataStoreData } = useGetSelectedKeys()

    return (
        <HeaderBarLayout
            header={
                <SemisHeader
                    baseUrl={baseUrl}
                    program={program}
                    dataStoreValues={dataStoreData}
                />
            }
        >
            <Outlet />
        </HeaderBarLayout>
    )
}

export default WithHeaderBarLayout
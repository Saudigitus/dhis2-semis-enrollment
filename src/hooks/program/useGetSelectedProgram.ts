import { useGetSectionTypeLabel } from "dhis2-semis-functions";
import { useDataStoreKey, useProgramsKeys } from "dhis2-semis-components";

export default function useGetSelectedProgram() {
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const programsValues = useProgramsKeys();

    return {
        dataStoreData,
        program: programsValues?.find((program) => program?.id == dataStoreData?.program)
    }
}
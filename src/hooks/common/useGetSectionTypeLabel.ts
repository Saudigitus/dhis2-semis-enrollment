import { useUrlParams, formatStringToTitleCase } from "dhis2-semis-functions";

const useGetSectionTypeLabel = () => {
    const { urlParameters } = useUrlParams()
    const sectionType = urlParameters().sectionType ?? 'student';

    return { sectionName: formatStringToTitleCase(sectionType as unknown as string) };
}
export default useGetSectionTypeLabel;

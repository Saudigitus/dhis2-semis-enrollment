import { useUrlParams } from "dhis2-semis-functions";
import { formatCamelToTitleCase } from "../../utils/common/formatCamelCaseToWords";

const useGetSectionTypeLabel = () => {
    const { urlParameters } = useUrlParams()
    const sectionType = urlParameters().sectionType ?? 'student';

    return { sectionName: formatCamelToTitleCase(sectionType as unknown as string) };
}
export default useGetSectionTypeLabel;

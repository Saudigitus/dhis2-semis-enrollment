import { formatCamelToTitleCase } from "../../utils/common/formatCamelCaseToWords";
import { useParams } from "./useQueryParams";

const useGetSectionTypeLabel = () => {
    const { urlParamiters } = useParams()
    const sectionType = urlParamiters().sectionType ?? 'Student';

    return { sectionName: formatCamelToTitleCase(sectionType as unknown as string) };
}
export default useGetSectionTypeLabel;

import { format } from "date-fns";
import { VariablesTypes } from "dhis2-semis-types";
import { groupEnrollmentFields } from './groupEnrollmentFields';

const staticForm = () => {
  return {
    registeringSchool: {
      required: true,
      name: "registerschoolstaticform",
      labelName: "Registering School",
      valueType: "TEXT",
      options: undefined,
      disabled: true,
      pattern: "",
      visible: true,
      description: "Registering School",
      searchable: false,
      error: false,
      programStage: "",
      content: "",
      id: "registerschoolstaticform",
      displayName: "Registering School",
      header: "Registering School",
      type: VariablesTypes.DataElement,
      assignedValue: undefined
    },
    enrollmentDate: {
      required: true,
      name: "enrollment_date",
      labelName: "Enrollment date",
      valueType: "DATE",
      options: undefined,
      disabled: false,
      pattern: "",
      visible: true,
      description: "Enrollment date",
      searchable: false,
      error: false,
      programStage: "",
      content: "",
      id: "enrollment_date",
      displayName: "Enrollment date",
      header: "Enrollment date",
      type: VariablesTypes.DataElement,
      assignedValue: format(new Date(), "yyyy-MM-dd")
    }
  }
}

function formFields({ formFieldsData, programData, dataStoreData }: { formFieldsData: any[], sectionName?: string, programData?: any, dataStoreData?: any }) {
  const [enrollmentDetails = [], studentsProfile = [], socioEconomicDetails = []] = formFieldsData;
  const registration = programData?.programStages?.find((stage: any) => stage.id === dataStoreData?.registration?.programStage);
  const socioEconomics = programData?.programStages?.find((stage: any) => stage.id === dataStoreData?.['socio-economics']?.programStage);
  const enrollmentGroups = groupEnrollmentFields(
    [staticForm().registeringSchool, ...enrollmentDetails, staticForm().enrollmentDate],
    registration?.programStageSections,
    { name: "Enrollment Details", description: "Details related to the enrollment process" },
    false,
  );
  const attributeGroups = groupEnrollmentFields(
    studentsProfile,
    programData?.programSections,
    { name: "Student Profile", description: "Student personal details" },
    false,
  );
  const socioEconomicGroups = groupEnrollmentFields(
    socioEconomicDetails,
    socioEconomics?.programStageSections,
    { name: "Socio-economic Details", description: "Socio-economic details" },
    false,
  );
  return [...enrollmentGroups, ...attributeGroups, ...socioEconomicGroups];
}

export { formFields, staticForm };

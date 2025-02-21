import { format } from "date-fns";
import { VariablesTypes } from "dhis2-semis-types";

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

function enrollmentDeletionFormField({ formFieldsData, sectionName }: { formFieldsData: any[], sectionName: string }) {

  const [enrollmentDetails = [], studentsProfile = [], socioEconomicDetails = []] = formFieldsData;


  const updatedEnrollmentData = enrollmentDetails.map((item: any) => {
    return { ...item, disabled: true, required: false };
    return item;
  });

  const updatedDataProfile = studentsProfile
    .filter((item: any) => ["G0B8B0AH5Ek", "gz8w04YBSS0", "ZIDlK6BaAU2"].includes(item.id))
    .map((item: any) => ({ ...item, disabled: true, required: false }));


  return [
    {
      name: `${sectionName} profile`,
      // description: `${sectionName} personal details`,
      visible: true,
      fields: [
        ...updatedDataProfile
      ]
    },
    {
      name: "Enrollment Details",
      // description: "Details related to the enrollment process",
      visible: true,
      fields: [
        ...updatedEnrollmentData,
      ]
    }
  ];
}

export { enrollmentDeletionFormField, staticForm };

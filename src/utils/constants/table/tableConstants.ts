import { CustomAttributeProps, VariablesTypes } from "dhis2-semis-components";

export const rowsData = [
    { fistid1: 'First Name', fistid2: 'Second Name', fistid3: 'Therd Name', fistid4: 'Fourth Name' },
    { fistid1: 'First Name', fistid2: 'Second Name', fistid3: 'Therd Name', fistid4: 'Fourth Name' },
    { fistid1: 'First Name', fistid2: 'Second Name', fistid3: 'Therd Name', fistid4: 'Fourth Name' },
    { fistid1: 'First Name', fistid2: 'Second Name', fistid3: 'Therd Name', fistid4: 'Fourth Name' }
]

export const headerColumns = [
    {
        id: "fistid1",
        displayName: "First Name",
        header: "First Name",
        required: false,
        name: "firstName",
        valueType: "TEXT" as unknown as CustomAttributeProps["valueType"],
        disabled: false,
        visible: true,
        options: {
            optionSet: {
                id: "optionSetId",
                options: [
                    {
                        value: "option1",
                        label: "Option 1"
                    }
                ]
            }
        },
        labelName: "First Name",
        type: VariablesTypes.Attribute,
        trackedEntity: "trackedEntity",
        placeholder: "First Name",
        unique: false,
        searchable: true,
    },
    {
        id: "fistid2",
        displayName: "Second Name",
        header: "First Name",
        required: false,
        name: "firstName",
        valueType: "TEXT" as unknown as CustomAttributeProps["valueType"],
        disabled: false,
        visible: true,
        options: {
            optionSet: {
                id: "optionSetId",
                options: [
                    {
                        value: "option1",
                        label: "Option 1"
                    }
                ]
            }
        },
        labelName: "First Name",
        type: VariablesTypes.Attribute,
        trackedEntity: "trackedEntity",
        placeholder: "First Name",
        unique: false,
        searchable: true,
    },
    {
        id: "fistid3",
        displayName: "Therd Name",
        header: "First Name",
        required: false,
        name: "firstName",
        valueType: "TEXT" as unknown as CustomAttributeProps["valueType"],
        disabled: false,
        visible: true,
        options: {
            optionSet: {
                id: "optionSetId",
                options: [
                    {
                        value: "option1",
                        label: "Option 1"
                    }
                ]
            }
        },
        labelName: "First Name",
        type: VariablesTypes.Attribute,
        trackedEntity: "trackedEntity",
        placeholder: "First Name",
        unique: false,
        searchable: true,
    },
    {
        id: "fistid4",
        displayName: "Fourth Name",
        header: "First Name",
        required: false,
        name: "firstName",
        valueType: "TEXT" as unknown as CustomAttributeProps["valueType"],
        disabled: false,
        visible: true,
        options: {
            optionSet: {
                id: "optionSetId",
                options: [
                    {
                        value: "option1",
                        label: "Option 1"
                    }
                ]
            }
        },
        labelName: "First Name",
        type: VariablesTypes.Attribute,
        trackedEntity: "trackedEntity",
        placeholder: "First Name",
        unique: false,
        searchable: true,
    }
]

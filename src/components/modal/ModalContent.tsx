import React from 'react'
import { CustomForm, WithBorder, WithPadding } from 'dhis2-semis-components';
import { Form } from 'react-final-form';
interface ModalContentInterface {
    formFields: any
    onSubmit: (arg: any) => void
    onChange: (arg: any) => void
    initialValues?: Record<string, any>
}


function ModalContent(props: ModalContentInterface) {
    const { formFields, onChange, onSubmit, initialValues } = props;

    return (
        <WithPadding>
            <WithBorder type='all'>
                <CustomForm
                    withButtons={true}
                    formFields={formFields}
                    initialValues={initialValues}
                    onFormSubtmit={(e) => { onSubmit(e) }}
                    onInputChange={(e) => { onChange(e) }}
                    Form={Form}
                />
            </WithBorder>
        </WithPadding>
    )
}

export default ModalContent
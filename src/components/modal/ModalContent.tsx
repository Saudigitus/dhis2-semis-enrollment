import React from 'react'
import { Form } from 'react-final-form';
import { CustomForm, WithBorder, WithPadding } from 'dhis2-semis-components';
interface ModalContentInterface {
    formFields: any
    loading: boolean
    onSubmit: (arg: any) => void
    onChange: (arg: any) => void
    onCancel: (arg: any) => void
    initialValues?: Record<string, any>
}


function ModalContent(props: ModalContentInterface) {
    const { formFields, onChange, onSubmit, onCancel, initialValues, loading } = props;

    return (
        <WithPadding>
            <WithBorder type='all'>
                <CustomForm
                    Form={Form}
                    loading={loading}
                    withButtons={true}
                    formFields={formFields}
                    initialValues={initialValues}
                    onCancel={() => { onCancel() }}
                    onFormSubtmit={(e) => { onSubmit(e) }}
                    onInputChange={(e) => { onChange(e) }}
                />
            </WithBorder>
        </WithPadding>
    )
}

export default ModalContent
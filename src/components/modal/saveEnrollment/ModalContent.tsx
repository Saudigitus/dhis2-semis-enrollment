import React from 'react'
import { Form } from 'react-final-form';
import { ModalContentInterface } from '../../../types/modal/ModalProps';
import { TestForm, WithBorder, WithPadding } from 'dhis2-semis-components';

function ModalContent(props: ModalContentInterface) {
    const { formFields, onChange, onSubmit, onCancel, initialValues, loading, formValues, setFormValues } = props;

    return (
        <WithPadding>
            <WithBorder type='all'>
                <WithPadding>
                    <TestForm
                        Form={Form}
                        loading={loading}
                        withButtons={true}
                        formValues={formValues}
                        formFields={formFields}
                        onInputChange={onChange}
                        setFormValues={setFormValues}
                        initialValues={initialValues}
                        onCancel={() => { onCancel() }}
                        onFormSubtmit={(e) => { onSubmit(e) }}
                    />
                </WithPadding>
            </WithBorder>
        </WithPadding>
    )
}

export default ModalContent
import React from 'react'
import { Form } from 'react-final-form';
import { ModalContentInterface } from '../../../types/modal/ModalProps';
import { CustomForm, WithBorder, WithPadding } from 'dhis2-semis-components';
import { useConfig } from '@dhis2/app-runtime';

function ModalContent(props: ModalContentInterface) {
    const {baseUrl } = useConfig();
    const { formFields, onChange, onSubmit, onCancel, initialValues, loading } = props;

    return (
        <WithPadding>
            <WithBorder type='all'>
                <WithPadding>
                    <CustomForm
                        Form={Form}
                        loading={loading}
                        baseUrl={baseUrl}
                        withButtons={true}
                        formFields={formFields}
                        setFormValues={onChange}
                        onInputChange={onChange}
                        initialValues={initialValues}
                        onCancel={() => { onCancel() }}
                        onFormSubtmit={(e) => { onSubmit(e) }}
                        trackedEntity={initialValues?.trackedEntity}
                    />
                </WithPadding>
            </WithBorder>
        </WithPadding>
    )
}

export default ModalContent
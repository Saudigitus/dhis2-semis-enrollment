import React, { useState } from 'react'
import { Form } from "react-final-form";
import { Tooltip } from '@mui/material';
import { useConfig } from '@dhis2/app-runtime';
import styles from './enrollmentActionsButtons.module.css'
import ModalManager from '../modal/saveEnrollment/ModalManager';
import { useBuildForm, useGetSectionTypeLabel, useUrlParams, useShowAlerts, useCheckFilters } from 'dhis2-semis-functions';
import { Modules } from 'dhis2-semis-types'
import { IconAddCircle24, Button, ButtonStrip, IconUserGroup16, IconSearch24 } from "@dhis2/ui";
import { ModalSearchEnrollmentContent, DataExporter, DataImporter, CustomDropdown as DropdownButton } from 'dhis2-semis-components';
import { formFields } from '../../utils/constants/form/enrollmentForm';
import useGetSelectedKeys from '../../hooks/config/useGetSelectedKeys';

function EnrollmentActionsButtons() {
    const { baseUrl } = useConfig()
    const { urlParameters } = useUrlParams();
    const { sectionName } = useGetSectionTypeLabel();
    const { dataStoreData, program: programData } = useGetSelectedKeys()
    const [formInitialValues, setFormInitialValues] = useState({})
    const [openSaveModal, setOpenSaveModal] = useState<boolean>(false)
    const { school: orgUnit, academicYear, grade, class: section } = urlParameters();
    const [openSearchEnrollment, setOpenSearchEnrollment] = useState<boolean>(false);
    const { formData } = useBuildForm({ dataStoreData, programData, module: Modules.Enrollment });
    const { hide, show } = useShowAlerts()
    const filters = [
        academicYear !== null ? `${dataStoreData.registration.academicYear}:in:${academicYear}` : null,
        grade !== null ? `${dataStoreData.registration.grade}:in:${grade}` : null,
        section !== null ? `${dataStoreData.registration.section}:in:${section}` : null,
    ].filter((filter): filter is string => filter !== null)
    const { areAllSelected } = useCheckFilters({ filters: dataStoreData.filters.dataElements as unknown as any })

    const showAlert = (error: any) => {
        show({ message: `Unknown error: ${error}`, type: { critical: true } })
        setTimeout(hide, 5000);
    }

    const enrollmentOptions: any = [
        {
            label: <DataImporter
                baseURL={baseUrl}
                label={'Enroll new ' + sectionName + '\'s'}
                module={Modules.Enrollment}
                onError={(e: any) => { showAlert(e) }}
                programConfig={programData!}
                sectionType={sectionName}
                selectedSectionDataStore={dataStoreData}
                updating={false}
                title={"Bulk Enrollment"}
            />,
            divider: true,
            disabled: false,
        },
        {
            label: <DataImporter
                baseURL={baseUrl}
                label={`Update existing ${sectionName}'s`}
                module={Modules.Enrollment}
                onError={(e: any) => { showAlert(e) }}
                programConfig={programData!}
                sectionType={sectionName}
                selectedSectionDataStore={dataStoreData}
                updating={true}
                title={"Bulk Enrollment Update"}
            />,
            divider: true,
            disabled: false,
        },
        {
            label: <DataExporter
                Form={Form}
                baseURL={baseUrl}
                eventFilters={filters}
                label='Export Empty Template'
                module={Modules.Enrollment}
                onError={(e: any) => { showAlert(e) }}
                programConfig={programData!}
                sectionType={sectionName}
                selectedSectionDataStore={dataStoreData}
                empty={true}
                stagesToExport={[dataStoreData.registration.programStage]}
            />,
            divider: false,
            disabled: false,
        },
        {
            label: <DataExporter
                Form={Form}
                baseURL={baseUrl}
                eventFilters={filters}
                label={'Export Existing ' + sectionName + '\'s'}
                module={Modules.Enrollment}
                onError={(e: any) => { showAlert(e) }}
                programConfig={programData!}
                sectionType={sectionName}
                selectedSectionDataStore={dataStoreData}
                empty={false}
                stagesToExport={[dataStoreData.registration.programStage]}
            />,
            divider: false,
            disabled: false,
        }
    ];

    return (
        <div className={styles.container}>
            <ButtonStrip className={styles.work_buttons}>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
                    <span>
                        <Button onClick={() => {
                            setOpenSearchEnrollment(true);
                        }} icon={<IconSearch24 />}>
                            <span className={styles.work_buttons_text}>Search {sectionName?.toLowerCase()}</span>
                        </Button>
                    </span>
                </Tooltip>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}
                    onClick={() => setOpenSaveModal(true)}
                >
                    <span>
                        <Button icon={<IconAddCircle24 />}>
                            <span className={styles.work_buttons_text}>Enroll {sectionName.toLocaleLowerCase()}</span>
                        </Button>
                    </span>
                </Tooltip>

                <Tooltip title={(grade === null || section === null) ? "Please select class and grade" : ""}>
                    <span>
                        <DropdownButton
                            name={<span className={styles.work_buttons_text}>Bulk enrollment</span> as unknown as string}
                            disabled={!!(orgUnit == undefined || !areAllSelected())}
                            icon={<IconUserGroup16 />}
                            options={enrollmentOptions}
                        />
                    </span>
                </Tooltip>

            </ButtonStrip>

            {openSaveModal && <ModalManager formFields={formFields({ formFieldsData: formData, sectionName: sectionName! })} open={openSaveModal} setOpen={setOpenSaveModal} saveMode='CREATE' initialValues={formInitialValues} />}

            {openSearchEnrollment &&
                <ModalSearchEnrollmentContent
                    open={openSearchEnrollment}
                    programConfig={programData!}
                    sectionName={sectionName}
                    setOpen={setOpenSearchEnrollment}
                    Form={Form}
                    setOpenNewEnrollmentModal={() => setOpenSaveModal(true)}
                    setFormInitialValues={(values: any) => setFormInitialValues(values)}
                />
            }
        </div>
    )
}

export default EnrollmentActionsButtons

import React, { useState } from 'react'
import { Form } from "react-final-form";
import { useConfig } from '@dhis2/app-runtime';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './enrollmentActionsButtons.module.css'
import ModalManager from '../modal/saveEnrollment/ModalManager';
import { useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';
import { Modules, ProgramConfig, selectedDataStoreKey } from 'dhis2-semis-types'
import { IconAddCircle24, Button, ButtonStrip, IconUserGroup16, IconSearch24 } from "@dhis2/ui";
import { ModalSearchEnrollmentContent, DataExporter, DataImporter, CustomDropdown as DropdownButton } from 'dhis2-semis-components';

function EnrollmentActionsButtons({ programData, selectedDataStoreKey }: { programData: ProgramConfig, selectedDataStoreKey: selectedDataStoreKey }) {
    const { baseUrl } = useConfig()
    const { urlParameters } = useUrlParams();
    const { sectionName } = useGetSectionTypeLabel();
    const [formInitialValues, setFormInitialValues] = useState({})
    const [openSaveModal, setOpenSaveModal] = useState<boolean>(false)
    const { school: orgUnit, academicYear, grade, class: section } = urlParameters();
    const [openSearchEnrollment, setOpenSearchEnrollment] = useState<boolean>(false);
    const filters = [
        academicYear !== null ? `${selectedDataStoreKey.registration.academicYear}:in:${academicYear}` : null,
        grade !== null ? `${selectedDataStoreKey.registration.grade}:in:${grade}` : null,
        section !== null ? `${selectedDataStoreKey.registration.section}:in:${section}` : null,
    ].filter((filter): filter is string => filter !== null)

    const enrollmentOptions: any = [
        {
            label: <DataImporter
                baseURL={baseUrl}
                label={'Enroll new ' + sectionName}
                module={Modules.Enrollment}
                onError={(e: any) => { console.log(e) }}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
                updating={false}
                title={"Bulk Enrollment"}
            />,
            divider: true,
            disabled: false,
        },
        {
            label: <DataImporter
                baseURL={baseUrl}
                label={`Update existing ${sectionName}s`}
                module={Modules.Enrollment}
                onError={(e: any) => { console.log(e) }}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
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
                fileName='teste'
                label='Export Empty Template'
                module={Modules.Enrollment}
                onError={(e: any) => console.log(e)}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
                empty={true}
                stagesToExport={[selectedDataStoreKey.registration.programStage]}
            />,
            divider: false,
            disabled: false,
        },
        {
            label: <DataExporter
                Form={Form}
                baseURL={baseUrl}
                eventFilters={filters}
                fileName='teste'
                label='Export Existing Students'
                module={Modules.Enrollment}
                onError={(e: any) => console.log(e)}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
                empty={false}
                stagesToExport={[selectedDataStoreKey.registration.programStage]}
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

                < DropdownButton
                    name={<span className={styles.work_buttons_text}>Bulk enrollment</span> as unknown as string}
                    disabled={false}
                    icon={<IconUserGroup16 />}
                    options={enrollmentOptions}
                />
            </ButtonStrip>

            {openSaveModal && <ModalManager open={openSaveModal} setOpen={setOpenSaveModal} saveMode='CREATE' initialValues={formInitialValues} />}

            {openSearchEnrollment &&
                <ModalSearchEnrollmentContent
                    open={openSearchEnrollment}
                    programConfig={programData}
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

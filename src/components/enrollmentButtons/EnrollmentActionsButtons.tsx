import React, { useState } from 'react'
import { IconAddCircle24, Button, ButtonStrip, IconUserGroup16, IconSearch24 } from "@dhis2/ui";
import Tooltip from '@material-ui/core/Tooltip';
import styles from './enrollmentActionsButtons.module.css'
import { useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';
import { Form } from "react-final-form";
import { ProgramConfig, selectedDataStoreKey } from 'dhis2-semis-types'
import { ModalSearchEnrollmentContent, DataExporter, DataImporter, CustomDropdown as DropdownButton } from 'dhis2-semis-components';
import ModalManager from '../modal/ModalManager';

function EnrollmentActionsButtons({ programData, selectedDataStoreKey, filetrState }: { filetrState: any, programData: ProgramConfig, selectedDataStoreKey: selectedDataStoreKey }) {
    const { urlParameters } = useUrlParams();
    const { school: orgUnit, academicYear, grade, class: section } = urlParameters();
    const { sectionName } = useGetSectionTypeLabel();
    const [formInitialValues, setFormInitialValues] = useState({})
    const [openSaveModal, setOpenSaveModal] = useState<boolean>(false)
    const [openSearchEnrollment, setOpenSearchEnrollment] = useState<boolean>(false);
    const filters = [
        academicYear !== null ? `${selectedDataStoreKey.registration.academicYear}:in:${academicYear}` : null,
        grade !== null ? `${selectedDataStoreKey.registration.grade}:in:${grade}` : null,
        section !== null ? `${selectedDataStoreKey.registration.section}:in:${section}` : null,
    ].filter((filter): filter is string => filter !== null)

    const enrollmentOptions: any = [
        {
            label: <DataImporter
                baseURL='http://localhost:8080'
                label={'Enroll new ' + sectionName}
                module='enrollment'
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
                baseURL='http://localhost:8080'
                label={`Update existing ${sectionName}s`}
                module='enrollment'
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
                baseURL='http://localhost:8080'
                eventFilters={filters}
                fileName='teste'
                label='Export Empty Template'
                module='enrollment'
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
                baseURL='http://localhost:8080'
                eventFilters={filters}
                fileName='teste'
                label='Export Existing Students'
                module='enrollment'
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

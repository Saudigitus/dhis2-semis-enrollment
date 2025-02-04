import React, { useState } from 'react'
import { IconAddCircle24, Button, ButtonStrip, IconUserGroup16, IconSearch24 } from "@dhis2/ui";
import Tooltip from '@material-ui/core/Tooltip';
import styles from './enrollmentActionsButtons.module.css'
import DropdownButtonComponent from '../buttons/DropdownButton';
import { useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';
import { Form } from "react-final-form";
import { ProgramConfig, selectedDataStoreKey } from 'dhis2-semis-types'
import { ModalSearchEnrollmentContent, DataExporter, DataImporter } from 'dhis2-semis-components';
import ModalManager from '../modal/ModalManager';

function EnrollmentActionsButtons({ programData, selectedDataStoreKey }: { programData: ProgramConfig, selectedDataStoreKey: selectedDataStoreKey }) {
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters();
    const { sectionName } = useGetSectionTypeLabel();
    const [openSaveModal, setOpenSaveModal] = useState<boolean>(false)
    const [openSearchEnrollment, setOpenSearchEnrollment] = useState<boolean>(false);

    const enrollmentOptions = [
        {
            label: "Update",
            divider: true,
            disabled: false,
            onClick: () => { { } }
        },
        {
            label: `Update existing ${sectionName}s`,
            divider: true,
            disabled: false,
            onClick: () => { { } }
        },
        {
            label: "Export empty template",
            divider: false,
            disabled: false,
            onClick: () => { { } }
        },
        {
            label: "Export existing students",
            divider: false,
            disabled: false,
            onClick: async () => { { } }
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

                <ModalManager open={openSaveModal} setOpen={setOpenSaveModal} saveMode='CREATE' />
                
                <DropdownButtonComponent
                    name={<span className={styles.work_buttons_text}>Bulk enrollment</span> as unknown as string}
                    disabled={false}
                    icon={<IconUserGroup16 />}
                    options={enrollmentOptions}
                />
            </ButtonStrip>

            {openSearchEnrollment &&
                <ModalSearchEnrollmentContent
                    open={openSearchEnrollment}
                    programConfig={programData}
                    sectionName="student"
                    setOpen={setOpenSearchEnrollment}
                    Form={Form}
                    setOpenNewEnrollmentModal={() => { }}
                    setFormInitialValues={(values: any) => console.log(values)}
                />
            }

        </div>
    )
}

export default EnrollmentActionsButtons

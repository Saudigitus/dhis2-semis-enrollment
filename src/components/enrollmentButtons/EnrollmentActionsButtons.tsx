import React, { useState } from 'react'
import {
    IconAddCircle24,
    Button,
    ButtonStrip,
    IconUserGroup16,
    IconSearch24,
} from "@dhis2/ui";
import Tooltip from '@material-ui/core/Tooltip';
import { FlyoutOptionsProps } from "../../types/buttons/FlyoutOptionsProps";
import styles from './enrollmentActionsButtons.module.css'
import useGetSectionTypeLabel from '../../hooks/common/useGetSectionTypeLabel';
import { useParams } from '../../hooks/common/useQueryParams';
import DropdownButtonComponent from '../buttons/DropdownButton';
import { ModalComponent, useProgramsKeys, ProgramConfig, useDataStoreKey } from 'dhis2-semis-components'
import { DataExporter } from 'dhis2-semis-functions'

function EnrollmentActionsButtons() {
    const { urlParamiters } = useParams();
    const { class: section, grade, school, schoolName, sectionType } = urlParamiters()
    const { sectionName } = useGetSectionTypeLabel();
    const [key, setKey] = useState("")
    const [open, setOpen] = useState<any>({ enroll: false, search: false, export: false, exportEmpty: false })
    const programConfig = useProgramsKeys().programsValues.find(x => x.displayName == sectionName) as unknown as ProgramConfig
    const selectedDataStore = useDataStoreKey().dataStoreValues.find((x: any) => x.key === sectionType)
    const handleClose = () => setOpen((open: any) => ({ ...open, [key]: false }))


    const enrollmentOptions: FlyoutOptionsProps[] = [
        {
            label: `Enroll new ${sectionName}s`,
            divider: true,
            disabled: false
        },
        {
            label: `Update existing ${sectionName}s`,
            divider: true,
            disabled: false
        },
        {
            label: <DataExporter
                fileName={"teste"}
                module={"enrollment"}
                orgUnit={'Shc3qNhrPAz'}
                orgUnitName={'Albion LBS'}
                programConfig={programConfig as unknown as any}
                sectionType={sectionType as unknown as string}
                stagesToExport={[]}
                selectedSectionDataStore={selectedDataStore as unknown as any}
                eventFilters={[`iDSrFrrVgmX:in:2023`]}
                label={"Export empty template"}
                empty={true}
            />,
            divider: false,
            disabled: false
        },
        {
            label: <DataExporter
                fileName={"teste"}
                module={"enrollment"}
                orgUnit={'Shc3qNhrPAz'}
                orgUnitName={'Albion LBS'}
                programConfig={programConfig as unknown as any}
                sectionType={sectionType as unknown as string}
                stagesToExport={[]}
                selectedSectionDataStore={selectedDataStore as unknown as any}
                eventFilters={[`iDSrFrrVgmX:in:2023`]}
                label={"Export existing students"}
            />,
            divider: false,
            disabled: false
        }
    ];

    return (
        <div className={styles.container}>
            <ButtonStrip className={styles.work_buttons}>
                <Tooltip title={school === null ? "Please select an organisation unit before" : ""}>
                    <span>
                        <Button icon={<IconSearch24 />}>
                            <span className={styles.work_buttons_text}>Search {sectionName?.toLowerCase()}</span>
                        </Button>
                    </span>
                </Tooltip>
                <Tooltip title={school === null ? "Please select an organisation unit before" : ""}>
                    <span>
                        <Button icon={<IconAddCircle24 />}>
                            <span className={styles.work_buttons_text}>Enroll {sectionName.toLocaleLowerCase()}</span>
                        </Button>
                    </span>
                </Tooltip>
                <DropdownButtonComponent
                    name={<span className={styles.work_buttons_text}>Bulk enrollment</span> as unknown as string}
                    disabled={false}
                    icon={<IconUserGroup16 />}
                    options={enrollmentOptions}
                />
            </ButtonStrip>
            <ModalComponent
                open={open[key]}
                title='Export Template'
                isClickAway={true}
                children=""
                handleClose={handleClose}
            />
        </div>
    )
}

export default EnrollmentActionsButtons

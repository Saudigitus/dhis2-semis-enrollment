import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { useConfig } from '@dhis2/app-runtime'
import { HashRouter } from 'react-router-dom'
import { AppWrapper } from 'dhis2-semis-components'
import { D2I18n } from 'dhis2-semis-types'
// import translation from '../locales/index'

const Enrollment = ({ i18n }: { i18n: D2I18n }) => {
    const { baseUrl } = useConfig()
    // const translate = i18n ? i18n : translation
       
    return (
        // <AppWrapper
        //     baseUrl={baseUrl}
        //     dataStoreKey="dataStore/semis/values"
        //     schoolCalendarKey='dataStore/semis/schoolCalendar'
        // >
        //     <HashRouter>
                <Router i18n={i18n as unknown as any} />
        //     </HashRouter >
        // </AppWrapper>
    )
}

export default Enrollment
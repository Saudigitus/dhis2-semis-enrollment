import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { useConfig } from '@dhis2/app-runtime'
import { HashRouter } from 'react-router-dom'
import { AppWrapper } from 'dhis2-semis-components'

const Enrollment = () => {
    const { baseUrl } = useConfig()

    return (
        // <AppWrapper
        //     baseUrl={baseUrl}
        //     dataStoreKey="dataStore/semis/values"
        //     schoolCalendarKey='dataStore/semis/schoolCalendar'
        // >
        //     <HashRouter>
                <Router />
        //     </HashRouter >
        // </AppWrapper>
    )
}

export default Enrollment
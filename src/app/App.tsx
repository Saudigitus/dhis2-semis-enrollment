import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'
import { HashRouter } from 'react-router-dom'
import { useConfig } from '@dhis2/app-runtime'
import InitializeWrapper from '../components/wrapper/InitializeWrapper'

const Enrollment = () => {
    const { baseUrl } = useConfig()

    return (
        <AppWrapper
            baseUrl={baseUrl}
            dataStoreKey='dataStore/semis/values'
        >
            <InitializeWrapper>
                <HashRouter>
                    <Router />
                </HashRouter>
            </InitializeWrapper>
        </AppWrapper>
    )
}

export default Enrollment
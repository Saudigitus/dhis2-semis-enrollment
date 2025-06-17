import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { useConfig } from '@dhis2/app-runtime'
import { AppWrapper } from 'dhis2-semis-components'
import InitializeWrapper from '../components/wrapper/InitializeWrapper'
import { HashRouter } from 'react-router-dom'

const Enrollment = () => {
    const { baseUrl } = useConfig()

    return (
        <AppWrapper
            baseUrl={baseUrl}
            dataStoreKey="dataStore/semis/values"
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
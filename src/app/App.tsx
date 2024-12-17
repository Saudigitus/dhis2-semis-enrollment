import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'
import { useConfig } from '@dhis2/app-runtime'

const MyApp = () => {
    const base = useConfig()

    console.log(base,'base')
    return (
        <AppWrapper dataStoreKey="semis/values">
            <Router />
        </AppWrapper>
    )
}

export default MyApp

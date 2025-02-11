import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'

const MyApp = () => {
    console.log("My App")
    return (
        <AppWrapper dataStoreKey='semis/values'>
            <Router />
        </AppWrapper>
    )
}

export default MyApp

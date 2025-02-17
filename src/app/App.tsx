import React from 'react'
import './App.module.css'
import { RecoilRoot } from 'recoil'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'

const MyApp = () => {

    return (
        <RecoilRoot>
            <AppWrapper dataStoreKey='semis/values'>
                <Router />
            </AppWrapper>
        </RecoilRoot>
    )
}

export default MyApp

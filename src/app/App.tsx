import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'
import { RecoilRoot } from 'recoil'

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

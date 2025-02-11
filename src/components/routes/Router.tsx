import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EnrollmentsPage } from '../../pages';
import { FullLayout } from '../../layout';

export default function Router() {
    console.log("Router")
    return (
        <Routes>
            <Route path='/' element={<FullLayout />}>
                <Route key={'enrollments'} path={'/'} element={<EnrollmentsPage />} />
            </Route>
        </Routes>
    );
}

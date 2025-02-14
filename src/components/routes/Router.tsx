import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EnrollmentsPage } from '../../pages';
import { FullLayout } from '../../layout';

export default function Router() {
    return (
        <Routes>
            <Route path='/' element={<FullLayout />}>
                <Route key={'enrollments'} path={'/enrollments'} element={<EnrollmentsPage />} />
            </Route>
        </Routes>
    );
}

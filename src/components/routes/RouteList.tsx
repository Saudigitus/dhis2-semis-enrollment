import React from "react";
import { FullLayout } from "../../layout"
import { EnrollmentsPage } from "../../pages";

export default function RouteList() {
    return [
        {
            path: "/semis/enrollment",
            layout: FullLayout,
            component: () => <EnrollmentsPage />
        }
    ]
}

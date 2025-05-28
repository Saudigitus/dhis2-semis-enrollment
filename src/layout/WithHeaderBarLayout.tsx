import { Outlet } from "react-router-dom"
import { HeaderBarLayout, SemisHeader, useProgramsKeys } from "dhis2-semis-components"

const WithHeaderBarLayout = () => {
    const [program] = useProgramsKeys()
    return (
        <HeaderBarLayout
            header={
                <SemisHeader
                    program={program}
                    dataSoreValues={{
                        "key": "student",
                        "filters": {
                            "dataElements": [
                                {
                                    "label": "grade",
                                    "ulrParam": "grade",
                                    "dataElement": "kNNoif9gASf",
                                },
                                {
                                    "label": "class",
                                    "ulrParam": "section",
                                    "dataElement": "RhABRLO2Fae"
                                }
                            ]
                        },
                        "modules": [
                            {
                                "key": "attendance",
                                "name": "Attendance",
                                "display": true
                            },
                            {
                                "key": "absenteeism",
                                "name": "Absenteeism",
                                "display": false
                            },
                            {
                                "key": "performance",
                                "name": "Performance",
                                "display": true
                            }
                        ],
                        "program": "wQaiD2V27Dp",
                        "defaults": {
                            "defaultOrder": "gz8w04YBSS0:asc",
                            "allowSearching": true,
                            "currentAcademicYear": "2024"
                        },
                        "transfer": {
                            "status": "YnwITieplwy",
                            "programStage": "uewAr6TmLkw",
                            "destinySchool": "kQbquG7UivM",
                            "statusOptions": [
                                {
                                    "key": "pending",
                                    "code": "Pending"
                                },
                                {
                                    "key": "approved",
                                    "code": "Approved"
                                },
                                {
                                    "key": "reproved",
                                    "code": "Reproved"
                                }
                            ]
                        },
                        "attendance": {
                            "status": "d0MKWRNGv0a",
                            "lastUpdate": "2024-10-17 12:14:41",
                            "programStage": "Ljyrr3cktAr",
                            "absenceReason": "oLUMMT84ILM",
                            "statusOptions": [
                                {
                                    "key": "absent",
                                    "code": "absent",
                                    "icon": "correct_blue_fill",
                                    "color": "#E57373"
                                },
                                {
                                    "key": "present",
                                    "code": "present",
                                    "icon": "wrong_red_fill",
                                    "color": "#81C784"
                                }
                            ]
                        },
                        "lastUpdate": "2024-10-17 12:14:41",
                        "performance": {
                            "programStages": [
                                {
                                    "programStage": "mBEhR2M4DRQ"
                                },
                                {
                                    "programStage": "aDmsN3qemOA"
                                },
                                {
                                    "programStage": "rZGdcch2PCh"
                                }
                            ]
                        },
                        "final-result": {
                            "status": "bsyU0WFfskG",
                            "programStage": "hcrjYJ6Yl5F"
                        },
                        "registration": {
                            "grade": "kNNoif9gASf",
                            "section": "RhABRLO2Fae",
                            "lastUpdate": "2024-05-09 15:50:41",
                            "academicYear": "iDSrFrrVgmX",
                            "programStage": "Ni2qsy2WJn4"
                        },
                        "socio-economics": {
                            "programStage": "Wi3KEZ7C3w9"
                        },
                        "trackedEntityType": "eMLK4VQm3Kj"
                    }}
                />
            }
        >
            <Outlet />
        </HeaderBarLayout>
    )
}

export default WithHeaderBarLayout
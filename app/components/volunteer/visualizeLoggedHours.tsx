'use client'

import { PieChart } from "@mui/x-charts";
import { iCertificationDB, iHoursLoggingDB, iPendingCertificationDB } from "../../../helpers/DatabaseTypes"

interface FlattenedPendingCert extends iPendingCertificationDB {
    Certifications: iCertificationDB,
    HoursLogging: iHoursLoggingDB | undefined,
    reviewNeeded: boolean,
}

const CertificationProgress = ({certifications} : {certifications : FlattenedPendingCert[]}) => {
    const data = certifications.map((cert : FlattenedPendingCert) => ({
        name: cert.Certifications.name,
        value: cert.hours_completed,
    }))

    const COLORS = ["#9AC2FB", "#80DFC0", "#FFDF99", "#FFAB81", "#AF19FF"];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow">
                    <p className="font-bold">{payload[0].name}</p>
                    <p>{`Hours Completed: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return(
        <div className="flex flex-col items-center justify-center w-full">
            <PieChart
                series={[
                    {
                        data: data
                    }
                ]}
                height={400}
            />
        </div>
    )
}

export default CertificationProgress;
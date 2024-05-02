
import React from "react";
import HeatMap from "@uiw/react-heat-map";
import { Tooltip } from "react-tooltip";
const value = [
    { date: '2024/01/11', count: 2 },
    { date: '2024/01/12', count: 20 },
    { date: '2024/01/13', count: 10 },
    ...[...Array(17)].map((_, idx) => ({ date: `2024/02/${idx + 10}`, count: idx, content: '' })),
    { date: '2024/04/11', count: 2 },
    { date: '2024/05/01', count: 5 },
    { date: '2024/05/02', count: 5 },
    { date: '2024/05/04', count: 11 },
];


function HeatMapChart(){

    return(
        <div className="overflow-y-auto">
            <HeatMap
                className=""
                width={700}
                height={150}
                value={value}
                weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                startDate={new Date('2024/01/01')}
                panelColors={{
                    0: '#F6F8F8',  // neutral color for 0 hours
                    1: '#ABCEC5',  // secondary color for 1 hour
                    2: '#9CC3B8',  // mix of secondary and accent colors for 2 hours
                    4: '#81BBB1',  // accent color for 4 hours
                    8: '#77AEA5',  // mix of accent and primary colors for 8 hours
                    12: '#73A59B', // primary color for 12 hours
                    16: '#5E8A82', // darkened primary color for 16 hours
                    20: '#4A6F68', // further darkened primary color for 20 hours
                  }}
            />
        </div>
    )
}

export default HeatMapChart;
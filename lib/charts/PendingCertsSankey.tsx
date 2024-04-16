'use client'
import { useEffect, useRef } from "react";
import SankeyChart from "./SankeyChart";
import * as d3 from 'd3';

interface Link {
    source: string,
    target: string,
    value: number,
}

interface Node {
    id: string;
    [key: string]: any;
}

interface Link {
    source: string;
    target: string;
    value: number;
    [key: string]: any;
}

interface SankeyChartOptions {
    format: (value: any) => string;
    align?: string;
    nodeId?: (d: Node) => string;
    nodeGroup: (d: Node) => any;
    nodeGroups?: any[];
    nodeLabel?: (d: Node) => string;
    nodeTitle?: (d: Node) => string;
    nodeAlign?: string;
    nodeSort?: (a: Node, b: Node) => number;
    nodeWidth?: number;
    nodePadding?: number;
    nodeLabelPadding?: number;
    nodeStroke?: string;
    nodeStrokeWidth?: number;
    nodeStrokeOpacity?: number;
    nodeStrokeLinejoin?: string;
    linkSource?: (d: Link) => string;
    linkTarget?: (d: Link) => string;
    linkValue?: (d: Link) => number;
    linkPath?: (d: any) => string;
    linkTitle?: (d: any) => string;
    linkColor?: string;
    linkStrokeOpacity?: number;
    linkMixBlendMode?: string;
    colors: string[];
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
}

const nodeColorMap = ["#73A59B", "#ABCEC5", "#81BBB1"]

const options: SankeyChartOptions = {
    nodeGroup: d => d.id.split(/\W/)[0], // take first word for color
    nodeAlign: "justify", // e.g., d3.sankeyJustify; set by input above
    linkColor: "target", // e.g., "source" or "target"; set by input above
    format: (f => (d: any) => `${f(d)} TWh`)(d3.format(",.1~f")),
    width: 700,
    height: 400,
    colors: nodeColorMap
}

const generateFakeData = () => {
    const totalApplications = Math.floor(Math.random() * 100) + 10; // Random number between 10 and 109
    const acceptedApplications = Math.floor(Math.random() * totalApplications);
    const deniedApplications = Math.floor(Math.random() * (totalApplications - acceptedApplications));
    const pendingApplications = totalApplications - acceptedApplications - deniedApplications;


    const links: Link[] = [
        { source: 'Total Applications', target: 'Accepted', value: acceptedApplications },
        { source: 'Total Applications', target: 'Denied', value: deniedApplications },
        { source: 'Total Applications', target: 'Pending', value: pendingApplications },
    ];

    return links;
};

export default function PendingCertsSankey() {

    const chartRef = useRef(null);

    const data = generateFakeData();

    useEffect(() => {
        if (chartRef.current) {
            const chart = SankeyChart({ links: data }, options);

            if (chartRef.current.firstChild) {
                chartRef.current.removeChild(chartRef.current.firstChild);
            }

            chartRef.current.appendChild(chart);
        }
    }, []);


    return (
        <div ref={chartRef}></div>
    )
}
'use client'
import { useContext, useEffect, useRef, useState } from "react";
import { NavBar } from "../../components/common/navbar";
import LoggingHoursList from "../../components/volunteer/loggingHoursList";
import { useQuery } from "react-query";
import { _getTotalHoursApproved, _getTotalHoursPending } from "../../utils/supabase/actions/volunteer.actions";
import { AuthContext } from "../../context/AuthContext";
import { fetchApprovedCerts } from "../../utils/queries/queries";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import PageWrapper from "../../../lib/layouts/PageWrapper";
import { NavHamburger } from "../../../lib/buttons/NavHamburger";
import * as d3 from 'd3';



export default function Page() {
    const { user } = useContext(AuthContext)!;

    const { data: totalHoursCompleted } = useQuery<number>('totalHoursCompleted', () => _getTotalHoursApproved(user.id));
    const { data: totalHoursPending } = useQuery<number>('totalHoursPending', () => _getTotalHoursPending(user.id));

    const { data, isLoading } = useQuery('approvedCerts',
        () => fetchApprovedCerts(user.id),
        {
            refetchOnMount: "always"
        }
    );

    const svgRef = useRef(null);

    useEffect(() => {
        const margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        // append the svg object to the body of the page
        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)

        //Read the data
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv").then(function (data) {

            // Add X axis
            const x = d3.scaleLinear()
                .domain([0, 0])
                .range([0, width]);
            svg.append("g")
                .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .attr("opacity", "0")

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, 500000])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.GrLivArea); })
                .attr("cy", function (d) { return y(d.SalePrice); })
                .attr("r", 1.5)
                .style("fill", "#69b3a2")

            // new X axis
            x.domain([0, 4000])
            svg.select(".myXaxis")
                .transition()
                .duration(2000)
                .attr("opacity", "1")
                .call(d3.axisBottom(x));

            svg.selectAll("circle")
                .transition()
                .delay(function (d, i) { return (i * 3) })
                .duration(2000)
                .attr("cx", function (d) { return x(d.GrLivArea); })
                .attr("cy", function (d) { return y(d.SalePrice); })
        })
    }, [])

    return (
        <PageWrapper>
            <NavHamburger />
            <div className="w-full flex justify-center pt-8">
                <h1 className="flex flex-wrap justify-center items-end">
                    <span className="text-9xl text-primary mr-1">{totalHoursCompleted}</span>
                    <span className="min-w-fit font-semibold">total hours logged</span>
                </h1>
                <h1 className="flex flex-wrap justify-center items-end">
                    <span className="text-9xl text-secondary mr-1">{totalHoursPending}</span>
                    <span className="min-w-fit font-semibold">total hours pending</span>
                </h1>
            </div>
            <div className="w-full justify-center flex flex-col-reverse md:flex-row p-10">
                {isLoading ?
                    <LoadingSpinner />
                    :
                    <>
                        <div className="w-full md:w-1/2">
                            <LoggingHoursList certifications={data} />
                        </div>
                        <div className="w-full md:w-1/2 border-2 border-black">
                            <svg ref={svgRef}></svg>
                        </div>
                    </>
                }
            </div>
        </PageWrapper>
    )
}
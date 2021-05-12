import React, { JSXElementConstructor, useEffect, useState } from 'react'

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: JSXElementConstructor<StatusBadgeProps> = ({ status }) => {

    const [bgColorClass, setBgColorClass] = useState<string>("bg-primary");

    // Selección del color del badge
    useEffect(() => {
        if(status.toUpperCase() === "OPEN") {
            setBgColorClass("bg-success");
        } else if (status.toUpperCase() === "CLOSED") {
            setBgColorClass("bg-secondary");
        } else {
            setBgColorClass("bg-danger");
        }
        return () => {}
    }, [status]);


    return (
        <span className={"badge " + bgColorClass}>
            {status}
        </span>
    )
}

export default StatusBadge

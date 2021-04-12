import { useEffect, useRef } from "react";
import * as d3 from 'd3';

const useD3 = (renderChartFn: Function, dependencies: any[]) => {
    const ref = useRef(null);

    useEffect(() => {
        const selection = d3.select(ref.current);
        renderChartFn(selection);
        return () => { };
    }, dependencies);
    return ref;
}

export default useD3
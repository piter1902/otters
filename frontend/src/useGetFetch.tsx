import { JSXElementConstructor, useState, useEffect } from "react";

// Valido para realizar GET a Backend



const useGetFetch = (url: any) => {
  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const abortCont = new AbortController();

    const getData = async () => {
      console.log("Fetching to: " + url);
      try {
        const response = await fetch(url, { signal: abortCont.signal });
        if (response.ok) {
          // console.log(await response.json());
          setData(await response.json());
        } else {
          throw Error('Could not fetch data from that resource');
        }
        setIsPending(false);
        setError(null);
        return () => abortCont.abort;

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setError(err.message);
          setIsPending(false);
        }
      }
    }

    getData();

    return () => { }

  }, []);
  return { data, isPending, error };

}

export default useGetFetch;
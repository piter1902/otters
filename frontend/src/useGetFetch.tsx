import { useState, useEffect } from "react";
import useToken from "./auth/Token/useToken";

// Valido para realizar GET a Backend



const useGetFetch = (url: any) => {

  const [data, setData] = useState<any>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  // Token para mantener el estado del usuario
  const { token } = useToken();

  useEffect(() => {

    const abortCont = new AbortController();

    const getData = async () => {
      console.log("Fetching to: " + url);
      try {
        const response =
          await fetch(url,
            {
              method: "GET",
              signal: abortCont.signal,
              headers: {
                'Authorization': `${token?.type} ${token?.token}`
              }
            });
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
    if(token !== null && token !== undefined){
      getData();
    }

    return () => { }

  }, [url, token]);
  return { data, isPending, error };

}

export default useGetFetch;
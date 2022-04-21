const useFetchHook = () => {
  const apiFetch = async (Request, apiUrl, sessionToken, profileId, interfaceUrl, timeOut = 6000) => {
    let apiTimeoutId;
    try {
      const fetchController = new AbortController();
      const { signal } = fetchController;

      apiTimeoutId = setTimeout(() => {
        fetchController.abort();
      }, timeOut);

      let url = `${interfaceUrl}/php/custom/socoapicalls.php`;
      if (process.env.NODE_ENV !== "production") {
        url = `http://localhost:8181/osvc/socoapicalls_nocs.php`;
      }
      const formData = new FormData();
      formData.append("data", JSON.stringify(Request));
      formData.append("apiUrl", apiUrl);

      const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          P_SID: sessionToken,
          P_ID: profileId,
        },
        body: formData,
        signal,
      });

      if (!response.ok) throw new Error("RESPONSE_NOT_OK");

      const data = await response.json();
      return data;
    } catch (e) {
      throw e;
    } finally {
      clearTimeout(apiTimeoutId);
    }
  };

  return { apiFetch };
};

export default useFetchHook;

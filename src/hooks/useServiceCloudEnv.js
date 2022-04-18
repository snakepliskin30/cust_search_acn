import React, { useState, useCallback } from "react";

export const useServiceCloudEnv = () => {
  const [osvcExtensionProv, setOsvcExtensionProv] = useState(null);
  const [osvcGlobalContext, setOsvcGlobalContext] = useState(null);
  const [osvcSessionToken, setOsvcSessionToken] = useState("");
  const [osvcProfileId, setOsvcProfileId] = useState("");
  const [osvcInterfaceUrl, setOsvcInterfaceUrl] = useState("");

  const getOsVcEnvValues = useCallback(async () => {
    const IExtensionProvider = await ORACLE_SERVICE_CLOUD.extension_loader.load("ExternalSearchResultsExt", "1");
    const globalContext = await IExtensionProvider.getGlobalContext();
    const sessionToken = await globalContext.getSessionToken();
    const profileId = globalContext.getProfileId();
    const interfaceUrl = globalContext.getInterfaceUrl();

    setOsvcExtensionProv(IExtensionProvider);
    setOsvcGlobalContext(globalContext);
    setOsvcSessionToken(sessionToken);
    setOsvcProfileId(profileId);
    setOsvcInterfaceUrl(interfaceUrl);

    return true;
  }, []);

  return { osvcExtensionProv, osvcGlobalContext, osvcSessionToken, osvcProfileId, osvcInterfaceUrl, getOsVcEnvValues };
};

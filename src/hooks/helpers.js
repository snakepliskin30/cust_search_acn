export const translateStatus = (code) => {
  const AccountStatus = {};
  AccountStatus["02"] = "Active";
  AccountStatus["03"] = "Pending Active";
  AccountStatus["07"] = "Void";
  AccountStatus["09"] = "Final";
  AccountStatus["18"] = "Written Off";
  AccountStatus["ACTIVE"] = "Active";
  AccountStatus["INACTIVE"] = "Inactive";

  const status = AccountStatus[code] || "";

  return status;
};

export const padLeft = (str) => {
  return str.padStart(2, "0");
};

export const getCurrentTimestamp = () => {
  const d = new Date();
  return (
    d.getFullYear() +
    padLeft((d.getMonth() + 1).toString()) +
    padLeft(d.getDate().toString()) +
    padLeft(d.getHours().toString()) +
    padLeft(d.getMinutes().toString()) +
    padLeft(d.getSeconds().toString())
  );
};

export const capitalizePremise = (premise) => {
  if (premise === "Non-GPC Account" || premise === "Customer only record") {
    return premise;
  }
  const premArray = premise.split(",");
  let finalAddress = "";
  if (premArray.length >= 1) {
    finalAddress += premArray[0].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  if (premArray.length >= 2) {
    finalAddress += `, ${premArray[1].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}`;
  }
  if (premArray.length === 4) {
    finalAddress += `, ${premArray[2].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}`;
    finalAddress += `, ${premArray[3]}`;
  } else if (premArray.length === 3) {
    finalAddress += `, ${premArray[2]}`;
  }
  return finalAddress;
};

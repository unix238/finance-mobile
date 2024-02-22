// const { PdfReader } = require("pdfreader");
// const fs = require("fs");

import { PdfReader } from "pdfreader";
import fs from "fs";

let counter = 0;
let fullResult = [];

const datas = new Promise((resolve, reject) => {
  let data = [];
  let type = 0;
  new PdfReader().parseFileItems("data.pdf", (err, item) => {
    if (err) {
      reject(err);
      return;
    }
    if (!item) {
      console.warn("end of file");
      resolve(data);
      return;
    }
    if (!item.text) {
      console.log("no text");
      return;
    }
    if (" " == item.text) {
      return;
    }
    if (++counter < 40) {
      return;
    }

    const res = item.text.trim();
    if (!res.includes("CASPKZKA") && !res.includes("заблокирована")) {
      data.push(res);
    } else {
      console.log("GERERERER");
    }
  });
});

function splitArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

datas
  .then((fullResult) => {
    console.log("call");
    const jsonData = JSON.stringify(
      splitArray(fullResult, 4).map((i) => {
        return { type: i[2], date: i[0], amount: i[1], desc: i[3] };
      }),
      null,
      2
    );
    fs.writeFile("data.json", jsonData, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return;
      }
      console.log("Data has been written to data.json");
    });
    const data = splitArray(fullResult, 4).map((i) => {
      return { type: i[2], date: i[0], amount: i[1], desc: i[3] };
    });
    const res = data.reduce((prev, curr) => {
      if (curr.amount[0] != "+") {
        return prev;
      }
      const numericValue = parseFloat(
        curr.amount.replace(/[^\d,]/g, "").replace(",", ".")
      );
      console.log(curr);
      return prev + numericValue;
    }, 0);

    console.log(res);
  })
  .catch((err) => {
    console.error("Error parsing PDF:", err);
  });

const getRightType = (data) => {
  if (
    data.date == "Перевод" ||
    data.date == "Пополнение" ||
    data.date == "Покупка"
  ) {
    return data.date;
  }
  if (
    data.summ == "Перевод" ||
    data.summ == "Пополнение" ||
    data.summ == "Покупка"
  ) {
    return data.summ;
  }
  if (
    data.description == "Перевод" ||
    data.description == "Пополнение" ||
    data.description == "Покупка"
  ) {
    return data.description;
  }
  if (
    data.type == "Перевод" ||
    data.type == "Пополнение" ||
    data.type == "Покупка"
  ) {
    return data.type;
  }
  return null;
};

const getRightAmount = (data) => {
  if (data.date[0] == "-" || data.date[0] == "+") {
    return data.date;
  }
  if (data.description[0] == "-" || data.description[0] == "+") {
    return data.description;
  }
  if (data.type[0] == "-" || data.type[0] == "+") {
    return data.type;
  }
  if (data.summ[0] == "-" || data.summ[0] == "+") {
    return data.summ;
  }
  console.log("here is an exception:", data.summ[0]);
  return null;
};

const getRightDate = (data) => {
  const regex = /^\d{2}\.\d{2}\.\d{2}$/;
  if (regex.test(data.date)) {
    return data.date;
  }
  if (regex.test(data.description)) {
    return data.description;
  }
  if (regex.test(data.type)) {
    return data.type;
  }
  if (regex.test(data.summ)) {
    return data.summ;
  }
  console.log("here is an exception:", data);

  return null;
};

const fixData = (ARdata) => {
  const data = {
    description: ARdata[0],
    date: ARdata[1],
    summ: ARdata[2],
    type: ARdata[3],
  };
  let rightType = getRightType(data);
  let rightDate = getRightDate(data);
  let rightSumm = getRightAmount(data);
  let rightDesc = "";

  if (
    rightDate != data.description &&
    rightType != data.description &&
    rightSumm != data.description
  ) {
    rightDesc = data.description;
  }
  if (
    rightDate != data.date &&
    rightType != data.date &&
    rightSumm != data.date
  ) {
    rightDesc = data.date;
  }
  if (
    rightDate != data.summ &&
    rightType != data.summ &&
    rightSumm != data.summ
  ) {
    rightDesc = data.summ;
  }
  if (
    rightDate != data.type &&
    rightType != data.type &&
    rightSumm != data.type
  ) {
    rightDesc = data.type;
  }

  return {
    type: rightType,
    amount: rightSumm,
    date: rightDate,
    desc: rightDesc,
  };
};

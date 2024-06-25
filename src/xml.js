const convert = require('xml-js');

function parse(data) {
  return convert.xml2js(data, {});
}

function query(xml, query) {
  if (query(xml)) {
    return xml;
  }
  if (xml.elements) {
    for (let i = 0; i < xml.elements.length; i++) {
      let result = query(xml.elements[i], query);
      if (result) {
        return xml.elements[i];
      }
    }
  }
  return null;
}

function queryAll(xml, query) {
  const results = [];
  if (query(xml)) {
    results.push(xml);
  }
  if (xml.elements) {
    for (let i = 0; i < xml.elements.length; i++) {
      results.push(...queryAll(xml.elements[i], query));
    }
  }
  return results;
}

function text(xml) {
  if (xml.type === "text") {
    return xml.text;
  } else if (xml.type === "element") {
    return xml.elements.map(text).join("");
  } else {
    return "";
  }
}

function cdata(xml) {
  if (xml.type === "cdata") {
    return xml.cdata;
  } else if (xml.type === "element") {
    return xml.elements.map(cdata).join("");
  } else {
    return "";
  }
}

module.exports = {
  parse,
  query,
  queryAll,
  text,
  cdata,
};
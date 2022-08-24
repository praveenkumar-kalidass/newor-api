const { encode: btoa } = require('base-64');

const getImageUri = (buffer) => {
  const uri = btoa(new Uint8Array(buffer).reduce(
    (total, current) => total + String.fromCharCode.apply(null, [current]),
    '',
  ));
  return `data:image/png;base64,${uri}`;
};

module.exports = { getImageUri };

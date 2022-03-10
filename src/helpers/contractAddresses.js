export const networkConfigs = {
  "0x4": {
    nftAddress: "0xE8988756957799676F65b498c2F54C6D527976D1",
    notproxy: "0x2f9DA884338b4E6924605B76F421A76Ca0A6ffC7",
    marketAddress: "0xD8CDc79e71B910f55A4e16Bc8EAc13Ba60927Edc",
    suffix: "Eth"
  },
  "0x61": {
    // nftAddress: "0x121949edf57afc7a57d64ab3e232000281e270b6",
    marketAddress: "0xD8CDc79e71B910f55A4e16Bc8EAc13Ba60927Edc",
  },
  "0x13881": {
    // nftAddress: "0x121949edf57afc7a57d64ab3e232000281e270b6",
    marketAddress: "0xD8CDc79e71B910f55A4e16Bc8EAc13Ba60927Edc",
  }
};

export const getNftAddress = (chain) =>
  networkConfigs[chain]?.nftAddress;

export const getMarketAddress = (chain) =>
  networkConfigs[chain]?.marketAddress;

export const getSuffix = (chain) =>
  networkConfigs[chain]?.suffix;


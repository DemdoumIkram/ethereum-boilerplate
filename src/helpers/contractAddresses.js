export const networkConfigs = {
  "0x4": {
    nftAddress: "0xE8988756957799676F65b498c2F54C6D527976D1",
    notProxy: "0x2f9DA884338b4E6924605B76F421A76Ca0A6ffC7",
    marketAddress: "0xD8CDc79e71B910f55A4e16Bc8EAc13Ba60927Edc",
    suffix: "Eth"
  },
  "0x61": {
    nftAddress: "0x1D704B3Ce7daD824e27d75a38648fD69100936a4",
    // notProxy: "0xC09D3bF323D841f878bD927F544727376E6e3b79",
    marketAddress: "0x22fbB19417fD66c82EcA1506dd07206C01E3dc2b",
    suffix: "Bsc",
  },
  "0x13881": {
    nftAddress: "0x83Ae731BFEd3dE7540dd56E544ECc398B42f2932",
    notProxy: "0xC09D3bF323D841f878bD927F544727376E6e3b79",
    marketAddress: "0x48E774Cc8290e250f1641c40F8675aF961266E3E",
    suffix: "Polygone",
  }
};

export const getNftAddress = (chain) =>
  networkConfigs[chain]?.nftAddress;

export const getMarketAddress = (chain) =>
  networkConfigs[chain]?.marketAddress;

export const getSuffix = (chain) =>
  networkConfigs[chain]?.suffix;


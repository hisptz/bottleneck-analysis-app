/// <reference types="cypress" />

const legendDefinition = [
  {
    id: "fl2oYvdCMBG",
    name: "Target achieved / on track",
    color: "#008000",
    endValue: 100,
    startValue: 67,
  },
  {
    id: "UcVmxZYSEEh",
    name: "Progress, but more effort required",
    color: "#FFFF00",
    endValue: 67,
    startValue: 33,
  },
  {
    id: "RbkOXiDk07u",
    name: "Not on track",
    color: "#FF0000",
    endValue: 33,
    startValue: 0,
  },
  {
    id: "xlU1S1twRbr",
    name: "N/A",
    color: "#D3D3D3",
    default: true,
  },
  {
    id: "DdrXbaQUTMW",
    name: "No data",
    color: "#FFFFFF",
    default: true,
  },
];

describe("Legend definition converter", () => {
  it("converts default legend ids", () => {});
});

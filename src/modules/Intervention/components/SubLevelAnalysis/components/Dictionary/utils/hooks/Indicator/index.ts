import { useRecoilValue } from "recoil";
import { DataStateDictionary } from "../../../state";
import { dataTypes, dataTypesInitials } from "../../models";

export function useGetFormulaDataDetailed(formula: string, location: string) {
  const dataElements = useRecoilValue(
    DataStateDictionary({
      location,
      formula,
      dataType: dataTypes.DATA_ELEMENT,
      dataFormulaType: dataTypesInitials.DATA_ELEMENT,
    })
  );
  const programIndicators = useRecoilValue(
    DataStateDictionary({
      location,
      formula,
      dataType: dataTypes.PROGRAM_INDICATOR,
      dataFormulaType: dataTypesInitials.PROGRAM_INDICATOR,
    })
  );

  const dataSetReportingRates = useRecoilValue(
    DataStateDictionary({
      location,
      formula,
      dataType: dataTypes.DATASET_REPORTING_RATES,
      dataFormulaType: dataTypesInitials.DATASET_REPORTING_RATES,
    })
  );

  const constants = useRecoilValue(
    DataStateDictionary({
      location,
      formula,
      dataType: dataTypes.CONSTANTS,
      dataFormulaType: dataTypesInitials.CONSTANTS,
    })
  );

  const attributes = useRecoilValue(
    DataStateDictionary({
      location,
      formula,
      dataType: dataTypes.ATTRIBUTES,
      dataFormulaType: dataTypesInitials.ATTRIBUTES,
    })
  );

  const programDataElements = useRecoilValue(
    DataStateDictionary({
      location,
      formula,
      dataType: dataTypes.PROGRAM_DATA_ELEMENT,
      dataFormulaType: dataTypesInitials.PROGRAM_DATA_ELEMENT,
    })
  );

  const orgUnitCount = useRecoilValue(
    DataStateDictionary({
      location,
      formula,
      dataType: dataTypes.ORG_UNIT_COUNT,
      dataFormulaType: dataTypesInitials.ORG_UNIT_COUNT,
    })
  );

  return {
    dataElements,
    programIndicators,
    dataSetReportingRates,
    attributes,
    constants,
    programDataElements,
    orgUnitCount,
  };
}

// eslint-disable-next-line max-params
// async function getWordData(engine: any, arr: any[], type: string, location: any) {
//   //arr for array of id of datas to get their values, type indicates the data type of data eg dataElement=0 program indicator=1, reporting rates=2
//
//   const allPromises = arr?.map((e) => {
//     return getDetailedValueFromApi(engine, e, type);
//   });
//
//   return await Promise.all(allPromises).then((value: any) => {
//     return value.map((val: Array<any>, i: number) => {
//       if (type === dataTypes.DATA_ELEMENT) {
//         if (val.length === 2) {
//           //array of two elements first element is dataElement second element of array is category option combo
//           return {
//             id: arr[i],
//             val: val[0].displayName + " " + val[1],
//             location: location,
//             sources: val[0].dataSetElements,
//           };
//         }
//         if (val.length === 1) {
//           //this is array of one element for data element that are just pure no category options
//           return {
//             id: arr[i],
//             val: val[0].displayName,
//             location: location,
//             sources: val[0].dataSetElements,
//           };
//         }
//       }
//       if (type === dataTypes.ATTRIBUTES || type === dataTypes.PROGRAM_DATA_ELEMENT) {
//         return { id: arr[i], val: val[1], location: location, sources: val[0] };
//       }
//       if (type === dataTypes.PROGRAM_INDICATOR) {
//         return {
//           id: arr[i],
//           val: val[0].displayName,
//           location: location,
//           sources: val[0].program,
//         };
//       } else {
//         //for orgUnit count, constants and reporting rates
//         return { id: arr[i], val: val[0], location: location };
//       }
//     });
//   });
// }

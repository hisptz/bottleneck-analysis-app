import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filterBySearchInput',
  pure: false
})
export class FilterBySearchInputPipe implements PipeTransform {
  transform(indicators: any[], searchingText: any): any {
    if (searchingText !== undefined && indicators !== null) {
      if (indicators.length > 0 && searchingText != '') {
        let splittedText = searchingText;
        [',', '[', ']', '(', ')', ',', '.', '-', '_'].forEach(char => {
          splittedText = splittedText.split(char).join(' ');
        });
        let newIndicators = [];

        splittedText.split(' ').forEach(partOfSearchingText => {
          if (partOfSearchingText != '') {
            _.map(newIndicators, formattedIndicator => {
              if (
                formattedIndicator.name
                  .toLowerCase()
                  .indexOf(partOfSearchingText.toLowerCase()) > -1
              ) {
                newIndicators[
                  _.findIndex(newIndicators, {
                    id: formattedIndicator.id
                  })
                ]['priority'] += 1;
              }
            });

            _.map(indicators, indicator => {
              if (
                indicator.name
                  .toLowerCase()
                  .indexOf(partOfSearchingText.toLowerCase()) > -1 &&
                _.findIndex(newIndicators, {
                  id: indicator.id
                }) == -1
              ) {
                indicator['priority'] = 1;
                newIndicators.push(indicator);
              }
            });
          }
        });

        indicators = _.orderBy(newIndicators, ['priority'], ['desc']);
      }
    }
    return indicators;
  }
}

// import { Pipe, PipeTransform } from "@angular/core";
// import * as _ from "lodash";
// import { FuseOptions } from "fuse.js";
// import * as Fuse from "fuse.js";

// @Pipe({
//   name: "filterBySearchInput",
//   pure: false
// })
// export class FilterBySearchInputPipe implements PipeTransform {
//   transform(indicators: any[], searchingText: any): any {
//     const options: Fuse.FuseOptions<any> = {
//       keys: ["name"]
//     };

//     const fuse = new Fuse(indicators, options);
//     if (searchingText !== undefined && indicators !== null) {
//       if (indicators.length > 0 && searchingText != "") {
//         let splittedText = searchingText;
//         [",", "[", "]", "(", ")", ",", ".", "-", "_"].forEach(char => {
//           splittedText = splittedText.split(char).join(" ");
//         });
//         let newIndicators = [];
//         splittedText.split(" ").forEach(partOfSearchingText => {
//           if (partOfSearchingText != "") {
//             // _.map(indicators, indicator => {
//             //   if (
//             //     indicator.name
//             //       .toLowerCase()
//             //       .indexOf(partOfSearchingText.toLowerCase()) > -1 &&
//             //     _.findIndex(newIndicators, {
//             //       id: indicator.id
//             //     }) == -1
//             //   ) {
//             //     indicator = { ...indicator, priority: 1 };
//             //     newIndicators.push(indicator);
//             //   }
//             // });
//             // let results = fuse.search(partOfSearchingText);
//             newIndicators = _.map(fuse.search(partOfSearchingText), function(
//               element
//             ) {
//               if (!element["priority"]) {
//                 return _.extend({}, element, { element, priority: 1 });
//               }
//             });
//             _.map(newIndicators, formattedIndicator => {
//               if (
//                 formattedIndicator.name
//                   .toLowerCase()
//                   .indexOf(partOfSearchingText.toLowerCase()) > -1
//               ) {
//                 newIndicators[
//                   _.findIndex(newIndicators, {
//                     id: formattedIndicator.id
//                   })
//                 ]["priority"] += 1;
//               }
//             });
//           }
//         });
//         indicators = _.orderBy(newIndicators, ["priority"], ["desc"]);
//       }
//     }
//     return indicators;
//   }
// }

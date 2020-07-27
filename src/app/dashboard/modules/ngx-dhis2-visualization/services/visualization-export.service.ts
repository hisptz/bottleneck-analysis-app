import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

declare var unescape: any;

@Injectable({ providedIn: 'root' })
export class VisualizationExportService {
  exportAll(items, filename) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    (items || []).forEach((item) => {
      switch (item.visualizationType) {
        case 'CHART': {
          const tableElement = document.getElementById(item.id + '_table');
          if (tableElement) {
            const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);
            XLSX.utils.book_append_sheet(wb, ws, 'BNA');
          }
          break;
        }
        case 'REPORT_TABLE': {
          const tableElement = document.getElementById(item.id + '_table');
          if (tableElement) {
            const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);
            XLSX.utils.book_append_sheet(wb, ws, 'Sublevel Analysis');
          }
          break;
        }
        case 'APP':
          const iframeElement: any = document.getElementById(item.id);
          if (iframeElement) {
            const innerContent =
              iframeElement.contentDocument ||
              iframeElement.contentWindow.document;

            if (innerContent) {
              const widgetTableElements = innerContent.getElementsByTagName(
                'table'
              );
              if (widgetTableElements && widgetTableElements[0]) {
                const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
                  widgetTableElements[0]
                );
                XLSX.utils.book_append_sheet(wb, ws, 'Root Cause Analysis');
              }
            }
          }
          break;
        default:
          break;
      }
    });

    XLSX.writeFile(wb, `${filename}.xlsx`);
  }
  exportXLS(filename: string, htmlTableElement: any) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(htmlTableElement);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  exportCSV(filename: string, htmlTable: any, csv?: any) {
    // Generate our CSV string from out HTML Table
    const csvString = csv ? csv : this._tableToCSV(htmlTable);
    // Create a CSV Blob
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Determine which approach to take for the download
    if (navigator.msSaveOrOpenBlob) {
      // Works for Internet Explorer and Microsoft Edge
      navigator.msSaveOrOpenBlob(blob, filename + '.csv');
    } else {
      this._downloadAnchor(URL.createObjectURL(blob), 'csv', filename);
    }
  }

  private _getMsieVersion() {
    const userAgent = window.navigator.userAgent;

    const msie = userAgent.indexOf('MSIE ');

    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(
        userAgent.substring(msie + 5, userAgent.indexOf('.', msie)),
        10
      );
    }

    const trident = userAgent.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = userAgent.indexOf('rv:');
      return parseInt(
        userAgent.substring(rv + 3, userAgent.indexOf('.', rv)),
        10
      );
    }

    const edge = userAgent.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(
        userAgent.substring(edge + 5, userAgent.indexOf('.', edge)),
        10
      );
    }

    // other browser
    return false;
  }

  private _isFirefox() {
    if (navigator.userAgent.indexOf('Firefox') > 0) {
      return 1;
    }

    return 0;
  }

  private _downloadAnchor(content, ext, filename) {
    const anchor = document.createElement('a');
    anchor.style.display = '!important';
    anchor.id = 'downloadanchor';
    document.body.appendChild(anchor);

    // If the [download] attribute is supported, try to use it

    if ('download' in anchor) {
      anchor.download = filename + '.' + ext;
    }
    anchor.href = content;
    anchor.click();
    anchor.remove();
  }

  private _tableToCSV(table) {
    // We'll be co-opting `slice` to create arrays
    const slice = Array.prototype.slice;

    return slice
      .call(table.rows)
      .map(function (row) {
        return slice
          .call(row.cells)
          .map(function (cell) {
            return '"t"'.replace('t', cell.textContent);
          })
          .join(',');
      })
      .join('\r\n');
  }
}

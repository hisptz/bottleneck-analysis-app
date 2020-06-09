import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppState } from '../../store/reducers/indicators.reducers';
import { Store } from '@ngrx/store';
import { Observable, pipe } from 'rxjs';
import * as _ from 'lodash';
import {
  getListOfProgramIndicators,
  getAllProgramIndicators,
  getProgramIndicatorGroups,
} from '../../store/selectors/indicators.selectors';
import { DatePipe } from '@angular/common';
import {
  LoadProgramIndicatorGroupsAction,
  loadProgramIndicatorsAction,
} from '../../store/actions/indicators.actions';

@Component({
  selector: 'app-program-indicators',
  templateUrl: './program-indicators.component.html',
  styleUrls: ['./program-indicators.component.css'],
})
export class ProgramIndicatorsComponent implements OnInit {
  @Input() metadataIdentifiers: any;
  @Output() selectedMetadataIdentifier = new EventEmitter<string>();
  @Output() loadedMetadata = new EventEmitter<any>();
  @Output() selectedMetadataGroups = new EventEmitter<any>();
  programIndicatorsList$: Observable<any> = null;
  allProgramIndicators$: Observable<any>;
  error = false;
  loading = true;
  hoverState = 'notHovered';
  itemsPerPageCount = 10;
  selectedIndicator: any = null;
  searchText: string;
  currentPage = 1;
  searchingTextForIndicatorGroup: string;
  indicatorGroupsForSearching = [];
  showIndicatorGroups = false;
  groupToFilter: any[] = [];
  listingIsSet: boolean;
  activeItem: number;
  searchingText: string;
  indicatorsList$: Observable<any>;
  allIndicators$: Observable<any>;
  programIndicators: any[] = [];
  completedPercentage = 0;
  totalAvailableProgramIndicators = 0;
  indicatorGroups: any[] = [];
  dataToDownload: any = [];
  pageItemsConfiguration = [
    { value: 10, symbol: '10' },
    { value: 25, symbol: '25' },
    { value: 50, symbol: '50' },
    { value: 100, symbol: '100' },
    { value: 200, symbol: '200' },
    { value: 'all', symbol: 'all' },
  ];
  programIndicatorGroups$: Observable<any>;
  programIndicatorGroups: any;
  constructor(private metadataStore: Store<AppState>) {
    this.searchText = '';
    this.searchingTextForIndicatorGroup = '';
    this.listingIsSet = true;
    if (this.completedPercentage >= 100) {
      this.loading = false;
      this.error = false;
    }
    this.metadataStore.dispatch(new LoadProgramIndicatorGroupsAction());
  }

  ngOnInit() {
    this.loadAllProgramIndicators();
  }

  setItemsPerPage(value) {
    this.itemsPerPageCount = value;
  }

  toggleListingOfItems() {
    this.listingIsSet = !this.listingIsSet;
  }

  selectedMetadata(e) {
    this.selectedMetadataIdentifier.emit(e);
  }

  mouseEnter(indicator, hoverState) {
    this.selectedIndicator = indicator.id;
    this.hoverState = hoverState;
  }

  mouseLeave() {
    this.selectedIndicator = null;
    this.hoverState = 'notHovered';
  }

  showGroups() {
    this.showIndicatorGroups = !this.showIndicatorGroups;
  }

  inGroupToFilter(id) {
    return _.find(this.groupToFilter, { id });
  }

  groupNames() {
    if (this.indicatorGroupsForSearching.length < 5) {
      return this.indicatorGroupsForSearching.map((g) => g.name).join(', ');
    } else {
      const diff = this.indicatorGroupsForSearching.length - 4;
      return (
        this.indicatorGroupsForSearching
          .slice(0, 4)
          .map((g) => g.name)
          .join(', ') +
        ' and ' +
        diff +
        ' More'
      );
    }
  }

  updateIndicatorGroupsForSearch(group, event) {
    if (event) {
      this.indicatorGroupsForSearching.push(group);
    } else {
      const index = this.indicatorGroupsForSearching.indexOf(group);
      this.indicatorGroupsForSearching.splice(index, 1);
    }
    this.programIndicatorGroups = this.indicatorGroupsForSearching;
    this.selectedMetadataGroups.emit(this.programIndicatorGroups);
  }

  loadAllProgramIndicators() {
    this.programIndicatorsList$ = this.metadataStore.select(
      pipe(getListOfProgramIndicators)
    );

    this.programIndicatorGroups$ = this.metadataStore.select(
      pipe(getProgramIndicatorGroups)
    );

    this.allProgramIndicators$ = this.metadataStore.select(
      pipe(getAllProgramIndicators)
    );
    this.programIndicatorsList$.subscribe((list) => {
      if (list) {
        this.totalAvailableProgramIndicators = list.pager['total'];
        this.allProgramIndicators$.subscribe((indicatorsLoaded) => {
          if (indicatorsLoaded) {
            this.programIndicators = [];
            _.map(indicatorsLoaded, (indicatorsByPage) => {
              this.programIndicators = [
                ...this.programIndicators,
                ...indicatorsByPage,
              ];
              this.loadedMetadata.emit({
                type: 'programIndicator',
                data: this.programIndicators,
              });
              this.completedPercentage =
                100 *
                (this.programIndicators.length /
                  this.totalAvailableProgramIndicators);
              if (this.completedPercentage === 100) {
                this.loading = false;
                this.error = false;
              }
            });
          }
        });
      } else {
        this.metadataStore.dispatch(new loadProgramIndicatorsAction());
        this.programIndicatorsList$ = this.metadataStore.select(
          pipe(getListOfProgramIndicators)
        );
        this.allProgramIndicators$ = this.metadataStore.select(
          pipe(getAllProgramIndicators)
        );
        if (this.programIndicatorsList$) {
          this.programIndicatorsList$.subscribe((list) => {
            if (list) {
              this.totalAvailableProgramIndicators = list.pager['total'];
              this.allProgramIndicators$.subscribe((indicatorsLoaded) => {
                if (indicatorsLoaded) {
                  this.programIndicators = [];
                  _.map(indicatorsLoaded, (indicatorsByPage) => {
                    this.programIndicators = [
                      ...this.programIndicators,
                      ...indicatorsByPage,
                    ];
                    this.completedPercentage =
                      100 *
                      (this.programIndicators.length /
                        this.totalAvailableProgramIndicators);
                    if (this.completedPercentage === 100) {
                      this.loading = false;
                      this.error = false;
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
    this.programIndicatorGroups$.subscribe((groups) => {
      if (groups) {
        this.programIndicatorGroups = groups.programIndicatorGroups;
        this.selectedMetadataGroups.emit(this.programIndicatorGroups);
      }
    });
  }

  dwndToCSV(metadataObject$) {
    metadataObject$.subscribe((metadataArr) => {
      const arr = [];
      arr.push('UID');
      arr.push('Indicator Name');
      arr.push('Aggregation type');
      arr.push('Description');
      arr.push('Expression');
      arr.push('Filter');
      this.dataToDownload.push(arr);
      if (metadataArr) {
        metadataArr.forEach((metadata) => {
          const arr = [];
          arr.push(metadata.id);
          arr.push(metadata.name);
          arr.push(metadata.aggregationType);
          if (metadata.description) {
            arr.push(metadata.description);
          } else {
            arr.push(metadata.name);
          }
          arr.push(metadata.expression);
          if (metadata.filter) {
            arr.push(metadata.filter);
          } else {
            arr.push('None');
          }
          this.dataToDownload.push(arr);
        });
      }
      (function () {
        let asUtf16, downloadExcelCsv, makeExcelCsvBlob, toTsv;
        let rows = this.dataToDownload;

        asUtf16 = function (str) {
          let buffer, bufferView, i, val, _i, _ref;
          buffer = new ArrayBuffer(str.length * 2);
          bufferView = new Uint16Array(buffer);
          bufferView[0] = 0xfeff;
          for (
            i = _i = 0, _ref = str.length;
            0 <= _ref ? _i <= _ref : _i >= _ref;
            i = 0 <= _ref ? ++_i : --_i
          ) {
            val = str.charCodeAt(i);
            bufferView[i + 1] = val;
          }
          return bufferView;
        };

        makeExcelCsvBlob = function (rows) {
          return new Blob([asUtf16(toTsv(rows)).buffer], {
            type: 'text/csv;charset=UTF-16',
          });
        };

        toTsv = function (rows) {
          let escapeValue;
          escapeValue = function (val) {
            if (typeof val === 'string') {
              return '"' + val.replace(/"/g, '""') + '"';
            } else if (val != null) {
              return val;
            } else {
              return '';
            }
          };
          return (
            rows
              .map(function (row) {
                return row.map(escapeValue).join(',');
              })
              .join('\n') + '\n'
          );
        };

        downloadExcelCsv = function (rows, attachmentFilename) {
          let a, blob;
          blob = makeExcelCsvBlob(rows);
          a = document.createElement('a');
          a.style.display = 'none';
          a.download = attachmentFilename;
          document.body.appendChild(a);
          a.href = URL.createObjectURL(blob);
          a.click();
          URL.revokeObjectURL(a.href);
          a.remove();
        };
        rows = this.dataToDownload;
        let theDate = new Date();
        theDate = this.datePipe.transform(theDate, 'yyyy-MM-dd');
        return downloadExcelCsv(
          this.dataToDownload,
          'List_of_' +
            this.totalAvailableProgramIndicators +
            '_program_indicators_generated_on' +
            theDate +
            '.csv'
        );
      }.call(this));
    });
  }
}

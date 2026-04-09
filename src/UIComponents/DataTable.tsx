/* React component to handle displaying imported data. */
import { connect } from "react-redux";
import { getTableData, setCurrentColumn, setHighlightColumn } from "../redux";
import { styles } from "../constants";
import { getLocalizedColumnName } from "../helpers/columnDetails";

interface DataTableProps {
  currentPanel: string;
  data: any[] | null;
  datasetId: string;
  labelColumn: string;
  selectedFeatures: string[];
  setCurrentColumn: (column: string | undefined) => void;
  setHighlightColumn: (column: string | undefined) => void;
  currentColumn: string;
  highlightColumn: string;
  reducedColumns?: boolean;
  singleRow?: number | undefined;
  startingRow?: number | undefined;
  noLabel?: boolean;
  hideLabel?: boolean;
  useResultsData?: boolean;
}

function DataTable({
  currentPanel,
  data,
  datasetId,
  labelColumn,
  selectedFeatures,
  setCurrentColumn: setCurrentColumnProp,
  setHighlightColumn: setHighlightColumnProp,
  currentColumn,
  highlightColumn,
  reducedColumns,
  singleRow,
  startingRow,
  noLabel,
  hideLabel
}: DataTableProps) {
  const getColumnHeaderStyle = (key: string) => {
    let style;

    if (key === labelColumn) {
      style = styles.dataDisplayHeaderLabel;
    } else if (selectedFeatures.includes(key)) {
      style = styles.dataDisplayHeaderFeature;
    }

    const pointerStyle =
      !reducedColumns && styles.dataDisplayHeaderClickable;

    return { ...styles.dataDisplayHeader, ...pointerStyle, ...style };
  };

  const getColumnCellStyle = (key: string) => {
    let style;

    if (hideLabel && labelColumn === key) {
      style = styles.dataDisplayCellHidden;
    } else if (key === currentColumn) {
      if (currentPanel === "dataDisplayLabel") {
        style = styles.dataDisplayCellSelectedLabel;
      } else {
        style = styles.dataDisplayCellSelected;
      }
    } else if (key === highlightColumn) {
      if (currentPanel === "dataDisplayLabel") {
        style = styles.dataDisplayCellHighlightedLabel;
      } else {
        style = styles.dataDisplayCellHighlighted;
      }
    }

    return { ...styles.dataDisplayCell, ...style };
  };

  const getColumns = () => {
    if (reducedColumns) {
      return Object.keys(data![0])
        .filter(key => {
          return (
            (!noLabel && labelColumn === key) ||
            selectedFeatures.includes(key)
          );
        })
        .sort((key1, key2) => {
          return labelColumn === key1 ? 1 : -1;
        });
    }

    return Object.keys(data![0]);
  };

  const getRows = () => {
    if (singleRow !== undefined) {
      return [
        data![
          Math.min(singleRow, data!.length - 1)
        ]
      ];
    } else {
      return data!.slice(0, 100);
    }
  };

  const handleSetCurrentColumn = (columnId: string) => {
    if (!reducedColumns) {
      setCurrentColumnProp(columnId);
    }
  };

  const handleSetHighlightColumn = (columnId: string | undefined) => {
    if (!reducedColumns) {
      setHighlightColumnProp(columnId);
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <table style={styles.displayTable}>
      <thead>
        <tr>
          {getColumns().map(columnId => {
            return (
              <th
                key={columnId}
                style={getColumnHeaderStyle(columnId)}
                onClick={() => handleSetCurrentColumn(columnId)}
                onKeyDown={() => handleSetCurrentColumn(columnId)}
                onMouseEnter={() => handleSetHighlightColumn(columnId)}
                onMouseLeave={() => handleSetHighlightColumn(undefined)}
              >
                {getLocalizedColumnName(datasetId, columnId)}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {getRows().map((row, index) => {
          return (
            <tr key={index}>
              {getColumns().map(columnId => {
                return (
                  <td
                    key={columnId}
                    className="uitest-data-table-column"
                    style={getColumnCellStyle(columnId)}
                    onClick={() => handleSetCurrentColumn(columnId)}
                    onKeyDown={() => handleSetCurrentColumn(columnId)}
                    onMouseEnter={() => handleSetHighlightColumn(columnId)}
                    onMouseLeave={() => handleSetHighlightColumn(undefined)}
                    role="gridcell"
                  >
                    {startingRow !== undefined && index <= startingRow ? (
                      <span>&nbsp;</span>
                    ) : (
                      row[columnId]
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default connect(
  (state: any, props: any) => ({
    data: getTableData(state, props.useResultsData) as any[],
    datasetId: state.metadata && state.metadata.name,
    labelColumn: state.labelColumn,
    selectedFeatures: state.selectedFeatures,
    currentColumn: state.currentColumn,
    highlightColumn: state.highlightColumn,
    currentPanel: state.currentPanel
  }),
  (dispatch: any) => ({
    setCurrentColumn(column: string | undefined) {
      dispatch(setCurrentColumn(column as any));
    },
    setHighlightColumn(column: string | undefined) {
      dispatch(setHighlightColumn(column as any));
    }
  })
)(DataTable);

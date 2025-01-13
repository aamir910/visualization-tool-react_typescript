import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Dispatch } from "redux";
import {
  setData,
  setError,
  setUniqueNodes,
  setUniqueLinks,
} from "../store/data/dataSlice"; // import the actions

interface ParseResult<T> {
  data: T[];
}

type ParseSuccessCallback<T> = (data: T[]) => void;
type ParseErrorCallback = (errorMessage: string) => void;

export const parseCSVFile = <T>(
  file: File,
  requiredColumns: string[],
  onSuccess: ParseSuccessCallback<T>,
  dispatch: Dispatch, // Pass Redux dispatch function
  onError: ParseErrorCallback
): void => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (fileExtension === "csv") {
    // Handle CSV files
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: ParseResult<T>) => {
        const data = result.data;

        if (!data || data.length === 0) {
          const errorMessage = "Parsed data is empty or invalid";
          dispatch(setError(errorMessage)); // Dispatch error
          onError(errorMessage);
          return;
        }

        const headers = Object.keys(data[0]);
        console.log(headers, "here is the header there");
        const missingColumns = requiredColumns.filter(
          (col) => !headers.includes(col)
        );

        if (missingColumns.length > 0) {
          const errorMessage = `Missing required columns: ${missingColumns.join(
            ", "
          )}`;
          dispatch(setError(errorMessage)); // Dispatch error
          onError(errorMessage);
          return;
        }

        dispatch(setData(data));

        const uniqueEntityTypes = [
          ...new Set(
            data.flatMap((item) => [item.entity_1_type, item.entity_2_type])
          ),
        ].reduce((acc, type) => ({ ...acc, [type]: true }), {});

        // Extract unique edge types and format them as key-value pairs
        const uniqueEdgeTypes = [
          ...new Set(data.map((item) => item.edge_type)),
        ].reduce((acc, edgeType) => ({ ...acc, [edgeType]: true }), {});

        console.log("Nodes:", uniqueEntityTypes);
        console.log("Edges:", uniqueEdgeTypes);

        // Dispatch to Redux store
        dispatch(setUniqueNodes(uniqueEntityTypes));
        dispatch(setUniqueLinks(uniqueEdgeTypes));

        // Dispatch valid data to Redux state
        onSuccess(data);
      },
      error: (err) => {
        const errorMessage = `Error parsing file: ${err.message}`;
        dispatch(setError(errorMessage)); // Dispatch error
        onError(errorMessage);
      },
    });
  } else if (fileExtension === "xlsx") {
    // Handle XLSX files
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as ArrayBuffer;

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Modify this if you want to pick another sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<T>(sheet);

        if (!jsonData || jsonData.length === 0) {
          const errorMessage = "Parsed data is empty or invalid";
          dispatch(setError(errorMessage)); // Dispatch error
          onError(errorMessage);
          return;
        }

        const headers = Object.keys(jsonData[0]);
        console.log(headers, "here is the header there");
        const missingColumns = requiredColumns.filter(
          (col) => !headers.includes(col)
        );

        if (missingColumns.length > 0) {
          const errorMessage = `Missing required columns: ${missingColumns.join(
            ", "
          )}`;
          dispatch(setError(errorMessage)); // Dispatch error
          onError(errorMessage);
          return;
        }

        dispatch(setData(jsonData)); // Dispatch valid data to Redux state

        const uniqueEntityTypes = jsonData
          .flatMap((item) => [
            { type: "entity_1_type", value: item.entity_1_type },
            { type: "entity_2_type", value: item.entity_2_type },
          ])
          .reduce((acc, { type, value }) => {
            acc[value] = { type, value: true }; // Dynamically set the type and value
            return acc;
          }, {});

        const uniqueEdgeTypes = jsonData.reduce((acc, item) => {
          const edgeType = item.edge_type;
          acc[edgeType] = { type: "edge_type", value: true }; // Assign type and retain value
          return acc;
        }, {});

        console.log("Nodes:", uniqueEntityTypes);
        console.log("Edges:", uniqueEdgeTypes);

        // Dispatch to Redux store
        dispatch(setUniqueNodes(uniqueEntityTypes));
        dispatch(setUniqueLinks(uniqueEdgeTypes));

        onSuccess(jsonData);
      } catch (err: any) {
        const errorMessage = `Error parsing Excel file: ${err.message}`;
        dispatch(setError(errorMessage)); // Dispatch error
        onError(errorMessage);
      }
    };

    reader.readAsArrayBuffer(file);
  } else {
    const errorMessage =
      "Unsupported file type. Only CSV and XLSX are supported.";
    dispatch(setError(errorMessage)); // Dispatch error
    onError(errorMessage);
  }
};

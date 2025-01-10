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

// Define TypeScript interfaces for the data structure
interface DataItem {
  entity_1: string;
  entity_2: string;
  entity_1_type: string;
  entity_2_type: string;
  edge_type: string;
}

interface Node {
  id: string;
  group: string;
  description_1: string | null;
  description_2: string | null;
  description_3: string | null;
  description_4: string | null;
  description_5: string | null;
  type: string;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

interface TransformedData {
  nodes: Node[];
  links: Link[];
}

export const transformData = (data: DataItem[]): TransformedData => {
  const nodes: Node[] = [];
  const links: Link[] = [];
  const nodeSet = new Set<string>(); // Ensure uniqueness of nodes

  data.forEach((item: DataItem) => {
    const {
      entity_1,
      entity_2,
      entity_1_type,
      entity_2_type,
      edge_type,
      ...rest
    } = item;

    // Check for a description-like property dynamically for entity 1
    const descriptionKey1_E1 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_1_enitity1")
    );
    const descriptionKey2_E1 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_2_enitity1")
    );
    const descriptionKey3_E1 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_3_enitity1")
    );
    const descriptionKey4_E1 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_4_enitity1")
    );
    const descriptionKey5_E1 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_5_enitity1")
    );

    // Check for a description-like property dynamically for entity 2
    const descriptionKey1_E2 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_1_enitity2")
    );
    const descriptionKey2_E2 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_2_enitity2")
    );
    const descriptionKey3_E2 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_3_enitity2")
    );
    const descriptionKey4_E2 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_4_enitity2")
    );
    const descriptionKey5_E2 = Object.keys(rest).find((key) =>
      key.toLowerCase().includes("description_5_enitity2")
    );

    // Add unique nodes for entity 1
    if (!nodeSet.has(entity_1)) {
      nodes.push({
        id: entity_1,
        group: "entity_1_type",
        type: entity_1_type,
        description_1: descriptionKey1_E1 ? item[descriptionKey1_E1] : null,
        description_2: descriptionKey2_E1 ? item[descriptionKey2_E1] : null,
        description_3: descriptionKey3_E1 ? item[descriptionKey3_E1] : null,
        description_4: descriptionKey4_E1 ? item[descriptionKey4_E1] : null,
        description_5: descriptionKey5_E1 ? item[descriptionKey5_E1] : null,
      });
      nodeSet.add(entity_1);
    }

    // Add unique nodes for entity 2
    if (!nodeSet.has(entity_2)) {
      nodes.push({
        id: entity_2,
        group: "entity_2_type",
        type: entity_2_type,
        description_1: descriptionKey1_E2 ? item[descriptionKey1_E2] : null,
        description_2: descriptionKey2_E2 ? item[descriptionKey2_E2] : null,
        description_3: descriptionKey3_E2 ? item[descriptionKey3_E2] : null,
        description_4: descriptionKey4_E2 ? item[descriptionKey4_E2] : null,
        description_5: descriptionKey5_E2 ? item[descriptionKey5_E2] : null,
      });
      nodeSet.add(entity_2);
    }

    // Add links between nodes
    links.push({ source: entity_1, target: entity_2, type: edge_type });
  });

  return { nodes, links };
};

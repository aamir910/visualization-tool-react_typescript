// Define TypeScript interfaces for the data structure
interface DataItem {
    entity_1: string;
    entity_2: string;
    entity_1_type: string;
    entity_2_type: string;
    edge_type: string;
    [key: string]: any; // Allow any other string key to access properties
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
  
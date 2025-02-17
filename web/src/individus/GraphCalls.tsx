import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Graph } from "react-d3-graph"; // Assurez-vous que vous avez cette bibliothèque installée
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Neo4jProperties {
  id: string;
  nom?: string;
  prenom?: string;
  date_naissance?: {
    year: { low: number; high: number };
    month: { low: number; high: number };
    day: { low: number; high: number };
  };
  date?: {
    year: { low: number; high: number };
    month: { low: number; high: number };
    day: { low: number; high: number };
    hour: { low: number; high: number };
    minute: { low: number; high: number };
  };
  duree?: { low: number; high: number };
  coordinates?: {
    srid: { low: number; high: number };
    x: number;
    y: number;
  };
  adresse?: string;
  type?: string;
}

interface Neo4jEntity {
  identity: {
    low: number;
    high: number;
  };
  properties: Neo4jProperties;
}

interface GraphData {
  individu: Neo4jEntity;
  appel?: Neo4jEntity;
  destinataire?: Neo4jEntity;
  source?: Neo4jEntity;
  appel_in?: Neo4jEntity;
  antenne?: Neo4jEntity;
  antenne_in?: Neo4jEntity;
}

interface Node {
  id: string;
  label: string;
  color: string;
  size: number;
}

interface Link {
  source: string;
  target: string;
  color: string;
  width: number;
}

const GraphComponent = ({ id }: { id: string | undefined }) => {
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/graph/${id}`)
      .then((response) => {
        const data = response.data;
        const nodes: Node[] = [];
        const links: Link[] = [];

        data.forEach((item: GraphData) => {
          const addNode = (
            entity: Neo4jEntity | undefined,
            labelPrefix: string,
            nodeColor: string,
            nodeSize: number
          ) => {
            if (entity) {
              const nodeId = `${labelPrefix.toLowerCase()}-${
                entity.identity.low
              }`;

              const existingNode = nodes.find((node) => node.id === nodeId);
              if (!existingNode) {
                nodes.push({
                  id: nodeId,
                  label: `${labelPrefix} ${entity.properties.id}`,
                  color: nodeColor,
                  size: nodeSize,
                });
              }
              return nodeId;
            }
            return null;
          };

          addNode(item.individu, "Individu", "red", 300);
          addNode(item.destinataire, "Individu", "lightgreen", 200);
          addNode(item.source, "Individu", "lightyellow", 200);
          addNode(item.antenne, "Antenne", "orange", 150);
          addNode(item.antenne_in, "Antenne", "purple", 150);

          if (
            item.appel &&
            item.individu &&
            item.destinataire &&
            item.antenne
          ) {
            const appelId = addNode(item.appel, "Appel", "blue", 100);
            if (appelId) {
              const individuId = `individu-${item.individu.identity.low}`;
              const destinataireId = `individu-${item.destinataire.identity.low}`;
              const antenneId = `antenne-${item.antenne.identity.low}`;

              links.push(
                {
                  source: individuId,
                  target: appelId,
                  color: "blue",
                  width: 2,
                },
                {
                  source: appelId,
                  target: destinataireId,
                  color: "blue",
                  width: 2,
                },
                {
                  source: appelId,
                  target: antenneId,
                  color: "orange",
                  width: 1,
                }
              );
            }
          }

          if (
            item.appel_in &&
            item.source &&
            item.individu &&
            item.antenne_in
          ) {
            const appelInId = addNode(item.appel_in, "Appel", "green", 100);
            if (appelInId) {
              const sourceId = `individu-${item.source.identity.low}`;
              const individuId = `individu-${item.individu.identity.low}`;
              const antenneInId = `antenne-${item.antenne_in.identity.low}`;

              links.push(
                {
                  source: sourceId,
                  target: appelInId,
                  color: "green",
                  width: 2,
                },
                {
                  source: appelInId,
                  target: individuId,
                  color: "green",
                  width: 2,
                },
                {
                  source: appelInId,
                  target: antenneInId,
                  color: "purple",
                  width: 1,
                }
              );
            }
          }
        });

        setGraphData({ nodes, links });
      })
      .catch((error) => {
        console.error("Error fetching graph data:", error);
      });
  }, [id]);

  useEffect(() => {
    if (!graphRef.current) return;

    const updateDimensions = () => {
      if (graphRef.current) {
        const width = graphRef.current.offsetWidth;
        const height = graphRef.current.offsetHeight;

        setDimensions((prev) => {
          if (prev?.width === width && prev?.height === height) return prev;
          return { width, height };
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(graphRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const shouldRenderGraph = dimensions !== null && graphData.nodes.length > 0;

  const graphConfig = {
    node: {
      color: "lightblue",
      size: 200,
      fontSize: 12,
      fontWeight: "bold",
      highlightStrokeColor: "blue",
      renderLabel: true,
      labelProperty: (node: Node) => node.label,
      fontColor: "white",
    },
    link: {
      highlightColor: "yellow",
      renderLabel: false,
      fontSize: 10,
      width: 2,
    },
    directed: true,
    d3: {
      gravity: -400,
      linkLength: 200,
    },
    height: dimensions?.height ?? 600,
    width: dimensions?.width ?? 800,
    initialZoom: 1,
  };

  const legendItems = [
    { id: "selected", color: "red", label: "Individu sélectionné" },
    { id: "recipients", color: "lightgreen", label: "Destinataires d'appels" },
    { id: "sources", color: "lightyellow", label: "Sources d'appels" },
    { id: "outgoing", color: "blue", label: "Appels sortants" },
    { id: "incoming", color: "green", label: "Appels entrants" },
    { id: "antennas-out", color: "orange", label: "Antennes sortantes" },
    { id: "antennas-in", color: "purple", label: "Antennes entrantes" },
  ];

  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Graph des interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Legendes:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {legendItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p>👉 Glissez les noeuds pour les réorganiser</p>
            <p>👉 Faites défiler pour zoomer</p>
            <p>👉 Cliquez sur les noeuds pour les mettre en évidence</p>
          </div>

          <div
            ref={graphRef}
            className="border rounded-lg p-4 flex justify-center items-center h-[600px]"
          >
            {shouldRenderGraph && (
              <Graph id="graph-id" data={graphData} config={graphConfig} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphComponent;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Call, Individu } from "@/types/individu";
import { useState } from "react";
import axios from "axios";
import Loader from "@/components/loader";

interface EntityState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export default function IndividuDetails() {
  const { id } = useParams();
  const [individu, setIndividu] = useState<EntityState<Individu>>({
    data: null,
    loading: true,
    error: null,
  });
  const [calls, setCalls] = useState<EntityState<Call[]>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const callsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/appel/${id}`
        );
        setCalls({
          data: callsResponse.data,
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        setCalls({
          data: null,
          loading: false,
          error: error as Error,
        });
        console.error("Erreur lors de la récupération des appels:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setCalls({
              data: [],
              loading: false,
              error: null,
            });
          } else {
            setCalls({
              data: null,
              loading: false,
              error: error as Error,
            });
            console.error("Erreur lors de la récupération des données:", error);
          }
        }
      }
    };

    fetchCalls();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const individuResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/individu/${id}`
        );
        setIndividu({
          data: individuResponse.data[0],
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        setIndividu({
          data: null,
          loading: false,
          error: error as Error,
        });
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (
    date:
      | Date
      | { year: { low: number }; month: { low: number }; day: { low: number } }
  ) => {
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return `${date.year.low}-${String(date.month.low).padStart(
      2,
      "0"
    )}-${String(date.day.low).padStart(2, "0")}`;
  };

  const formatDateTime = (date: {
    year: { low: number };
    month: { low: number };
    day: { low: number };
    hour: { low: number };
    minute: { low: number };
  }) => {
    return `${formatDate(date)} ${String(date.hour.low).padStart(
      2,
      "0"
    )}:${String(date.minute.low).padStart(2, "0")}`;
  };

  if (individu.loading || calls.loading) {
    return <Loader />;
  }

  if (individu.error || calls.error) {
    return <div>Erreur lors de la récupération des données</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <a href="/" className="inline-block mb-6">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
        </Button>
      </a>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Détails de l'individu {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold mb-2">
            {individu.data?.prenom} {individu.data?.nom}
          </h2>
          <div>
            ID: <Badge variant="outline">{individu.data?.id}</Badge>
          </div>
          {individu.data?.date_naissance && (
            <p>
              Date de naissance: {formatDate(individu.data?.date_naissance)}
            </p>
          )}
        </CardContent>
      </Card>

      {calls.data && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des appels</CardTitle>
          </CardHeader>
          <CardContent>
            {calls.data.length === 0 ? (
              <p>Aucun appel trouvé</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date et heure</TableHead>
                    <TableHead>Durée (min)</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Localisation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.data?.map((call, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDateTime(call.Date)}</TableCell>
                      <TableCell>{call.Duree.low}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          {call.Destination.prenom} ({call.Destination.id})
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          {call.Loacalsiation_Relais.adresse}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

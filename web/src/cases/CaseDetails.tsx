import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Case from "@/types/case";
import Loader from "@/components/loader";

export default function CaseDetails() {
  const { id } = useParams();
  const [caseDetails, setCaseDetails] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/affaire/${id}`
        );
        setCaseDetails(response.data);
        setLoading(false);
      } catch (error: unknown) {
        console.error("Erreur lors de la récupération des affaires:", error);
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchCases();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <a href="/" className="inline-block mb-6">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
        </Button>
      </a>
      <h1 className="text-3xl font-bold mb-6">Détails de l'incident {id}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{caseDetails?.description}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Individus impliqués</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {caseDetails?.individus.map((individu, index) => (
              <Badge
                className="cursor-pointer"
                key={index}
                variant="secondary"
                onClick={() => navigate(`/individu/${individu}`)}
              >
                {individu}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Témoignages</CardTitle>
        </CardHeader>
        <CardContent>
          {caseDetails?.temoignages.map((temoignage, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h3 className="font-semibold">{temoignage.auteur}</h3>
              <p className="text-sm text-gray-500 mb-1">{temoignage.date}</p>
              <p>{temoignage.recit}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lieu</CardTitle>
        </CardHeader>
        <CardContent>
          {caseDetails?.lieux.map((lieu, index) => (
            <div key={index} className="flex items-start">
              <MapPin className="mr-2 mt-1 flex-shrink-0" />
              <div>
                <p>{lieu.adresse}</p>
                <p>
                  {lieu.code_postal} {lieu.ville}
                </p>
                <p className="text-sm text-gray-500">
                  Lat: {lieu.coordonnees.lat}, Lon: {lieu.coordonnees.lon}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

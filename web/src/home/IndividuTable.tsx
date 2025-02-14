import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Individu } from "@/types/individu";
import TableSkeleton from "@/components/table-skeleton";
interface IndividuState {
  data: Individu[];
  loading: boolean;
  error: Error | null;
}

export default function IndividuTable() {
  const [individus, setIndividus] = useState<IndividuState>({
    data: [],
    loading: true,
    error: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIndividus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/individus`
        );
        setIndividus((prevIndividus) => ({
          ...prevIndividus,
          data: response.data,
          loading: false,
        }));
      } catch (error: unknown) {
        console.error("Erreur lors de la récupération des individus:", error);
        setIndividus((prevIndividus) => ({
          ...prevIndividus,
          error: error as Error,
          loading: false,
        }));
      }
    };

    fetchIndividus();
  }, []);

  if (individus.loading) {
    return <TableSkeleton />;
  }

  if (individus.error) {
    return <div>Error: {individus.error.message}</div>;
  }

  return (
    <Table className="w-2/3 mx-auto">
      <TableCaption>Cliquer sur un individu pour voir les détails</TableCaption>
      <TableHeader>
        <TableRow className="justify-between">
          <TableHead className="w-[100px] p-4">N°</TableHead>
          <TableHead className="p-4">Nom</TableHead>
          <TableHead className="p-4">Prénom
            
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {individus.data.map((individuItem: Individu) => (
          <TableRow
            key={individuItem.id}
            className="cursor-pointer"
            onClick={() => navigate(`/individu/${individuItem.id}`)}
          >
            <TableCell className="font-medium p-4">{individuItem.id}</TableCell>
            <TableCell className="p-4">{individuItem.nom}</TableCell>
            <TableCell className="p-4">{individuItem.prenom}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="justify-between">
          <TableCell colSpan={3} className="p-4">
            Total{" "}
            <span className="text-sm font-bold">{individus.data.length}</span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

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
import Case from "@/types/case";
import { useNavigate } from "react-router";
import TableSkeleton from "@/components/table-skeleton";

interface CaseState {
  data: Case[];
  loading: boolean;
  error: Error | null;
}

export default function CaseTable() {
  const [cases, setCases] = useState<CaseState>({
    data: [],
    loading: true,
    error: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/affaires`
        );
        setCases((prevCases) => ({
          ...prevCases,
          data: response.data,
          loading: false,
        }));
      } catch (error: unknown) {
        console.error("Erreur lors de la récupération des affaires:", error);
        setCases((prevCases) => ({
          ...prevCases,
          error: error as Error,
          loading: false,
        }));
      }
    };

    fetchCases();
  }, []);

  if (cases.loading) {
    return <TableSkeleton />;
  }

  if (cases.error) {
    return <div>Error: {cases.error.message}</div>;
  }

  return (
    <Table className="w-2/3 mx-auto">
      <TableCaption>Cliquer sur une affaire pour voir les détails</TableCaption>
      <TableHeader>
        <TableRow className="justify-between">
          <TableHead className="w-[100px] p-4">N°</TableHead>
          <TableHead className="p-4">Description</TableHead>
          <TableHead className="p-4">Ville</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.data.map((caseItem: Case) => (
          <TableRow
            key={caseItem._id}
            className="cursor-pointer"
            onClick={() => navigate(`/case/${caseItem._id}`)}
          >
            <TableCell className="font-medium p-4">{caseItem._id}</TableCell>
            <TableCell className="p-4">{caseItem.description}</TableCell>
            <TableCell className="p-4">{caseItem.lieux[0].ville}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="justify-between">
          <TableCell colSpan={3} className="p-4">
            Total <span className="text-sm font-bold">{cases.data.length}</span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

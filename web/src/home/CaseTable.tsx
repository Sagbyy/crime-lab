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

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/affaires`
        );
        console.log(response.data);
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
    return <div>Loading...</div>;
  }

  if (cases.error) {
    return <div>Error: {cases.error.message}</div>;
  }

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.data.map((caseItem: Case, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{caseItem._id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

import CaseTable from "./CaseTable";
import { Header } from "./Header";
import IndividuTable from "./IndividuTable";

export default function Home() {
  return (
    <div className="bg-background min-h-screen pb-10 text-white">
      <Header />
      {/* <WorldMapHome /> */}
      <h2 className="text-2xl font-bold text-center my-10">
        Liste des affaires
      </h2>
      <CaseTable />
      <h2 className="text-2xl font-bold text-center my-10">
        Liste des individus
      </h2>
      <IndividuTable />
    </div>
  );
}

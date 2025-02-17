import { Hero } from "@/components/hero";

function Header() {
  return (
    <Hero
      title="Crime Lab Platform"
      subtitle="BOUHDJEUR Salahe-eddine & GORY KANTE Mahamdou"
      actions={[
        {
          label: "Enregistrer une affaire",
          href: "/case/create",
          variant: "default",
        },
        {
          label: "Enregistrer un individu",
          href: "/individu/create",
          variant: "default",
        },
      ]}
      titleClassName="text-5xl md:text-6xl font-extrabold"
      subtitleClassName="text-lg md:text-xl max-w-[600px]"
    />
  );
}

export { Header };

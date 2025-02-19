"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  PlusCircle,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Individu } from "@/types/individu";
import { useNavigate } from "react-router";

const crimeReportSchema = z.object({
  description: z.string().min(1, "Description is required"),
  individus: z.array(z.string()).min(1, "At least one individual is required"),
  temoignages: z
    .array(
      z.object({
        auteur: z.string().min(1, "Author is required"),
        date: z.string().min(1, "Date is required"),
        recit: z.string().min(1, "Statement is required"),
      })
    )
    .min(1, "At least one testimony is required"),
  lieux: z
    .array(
      z.object({
        ville: z.string().min(1, "City is required"),
        adresse: z.string().min(1, "Address is required"),
        code_postal: z.string().regex(/^\d{5}$/, "Invalid postal code"),
        coordonnees: z.object({
          lat: z.number().min(-90).max(90),
          lon: z.number().min(-180).max(180),
        }),
      })
    )
    .min(1, "At least one location is required"),
});

export type CrimeReportType = z.infer<typeof crimeReportSchema>;

export function CaseReport() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [individuals, setIndividuals] = useState<Individu[]>([]);

  const navigate = useNavigate();

  const form = useForm<CrimeReportType>({
    resolver: zodResolver(crimeReportSchema),
    defaultValues: {
      description: "",
      individus: [],
      temoignages: [{ auteur: "", date: "", recit: "" }],
      lieux: [
        {
          ville: "",
          adresse: "",
          code_postal: "",
          coordonnees: { lat: 0, lon: 0 },
        },
      ],
    },
  });

  useEffect(() => {
    const fetchIndividuals = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/individus`
      );
      setIndividuals(response.data);
    };
    fetchIndividuals();
  }, []);

  async function onSubmit(data: CrimeReportType) {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/affaire`,
        data
      );
      if (response.status !== 201) {
        throw new Error("Failed to submit the report");
      }
      setSubmissionStatus("L'affaire a été ajoutée avec succès!");
      form.reset();
    } catch (error) {
      console.error("Error submitting report:", error);
      setSubmissionStatus("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="my-10 mx-3 sm:w-2/3 space-y-8 sm:mx-auto">
      <div onClick={() => navigate("/")}>
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la page d'accueil
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Description de l'affaire</CardTitle>
              <CardDescription>
                Renseignez la description de l'affaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Entrez la description de l'affaire"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Individus impliqués</CardTitle>
              <CardDescription>
                Sélectionnez les individus impliqués dans le crime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="individus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Individus impliqués</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value.length && "text-muted-foreground"
                            )}
                          >
                            {field.value.length
                              ? `${field.value.length} sélectionnés`
                              : "Sélectionnez des individus"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Rechercher des individus..." />
                          <CommandList>
                            <CommandEmpty>Aucun individu trouvé.</CommandEmpty>
                            <CommandGroup>
                              {individuals.map((individual) => (
                                <CommandItem
                                  key={individual.id}
                                  onSelect={() => {
                                    const newValue = field.value.includes(
                                      individual.id
                                    )
                                      ? field.value.filter(
                                          (v) => v !== individual.id
                                        )
                                      : [...field.value, individual.id];
                                    form.setValue("individus", newValue);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      field.value.includes(individual.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {individual.prenom} {individual.nom}{" "}
                                  <span className="hidden">
                                    {individual.id}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Témoignages</CardTitle>
              <CardDescription>Ajoutez des témoignages</CardDescription>
            </CardHeader>
            <CardContent>
              {form.watch("temoignages").map((_, index) => (
                <div key={index} className="space-y-4 mb-4">
                  <div className="flex justify-between flex-row">
                    <FormField
                      control={form.control}
                      name={`temoignages.${index}.auteur`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Auteur</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Entrez le nom de l'auteur"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          form.setValue(
                            "temoignages",
                            form
                              .watch("temoignages")
                              .filter((_, i) => i !== index)
                          );
                        }}
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name={`temoignages.${index}.date`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Choisissez une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date?.toISOString() ?? "")
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`temoignages.${index}.recit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Témoignage</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter witness statement"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("temoignages").length > 1 &&
                    index < form.watch("temoignages").length - 1 && (
                      <Separator className="!my-10" />
                    )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  form.setValue("temoignages", [
                    ...form.watch("temoignages"),
                    { auteur: "", date: "", recit: "" },
                  ])
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un témoignage
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lieux</CardTitle>
              <CardDescription>
                Ajoutez des lieux impliqués dans le crime
              </CardDescription>
            </CardHeader>
            <CardContent>
              {form.watch("lieux").map((_, index) => (
                <div key={index} className="space-y-4 mb-4">
                  <div className="flex flex-row justify-between">
                    <FormField
                      control={form.control}
                      name={`lieux.${index}.ville`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Entrez le nom de la ville"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          form.setValue(
                            "lieux",
                            form
                              .watch("lieux")
                              .filter((_, i) => i !== index)
                          );
                        }}
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name={`lieux.${index}.adresse`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Entrez l'adresse" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`lieux.${index}.code_postal`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Entrez le code postal"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`lieux.${index}.coordonnees.lat`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.000001"
                            placeholder="Entrez la latitude"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`lieux.${index}.coordonnees.lon`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.000001"
                            placeholder="Entrez la longitude"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("lieux").length > 1 &&
                    index < form.watch("lieux").length - 1 && (
                      <Separator className="!my-10" />
                    )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  form.setValue("lieux", [
                    ...form.watch("lieux"),
                    {
                      ville: "",
                      adresse: "",
                      code_postal: "",
                      coordonnees: { lat: 0, lon: 0 },
                    },
                  ])
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un lieu
              </Button>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Envoyer le rapport"}
          </Button>
          {submissionStatus && (
            <div className="mt-4 text-green-600">{submissionStatus}</div>
          )}
        </form>
      </Form>
    </div>
  );
}
